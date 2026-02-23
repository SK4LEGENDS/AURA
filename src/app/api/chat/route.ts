import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebase-admin";
import { findRelevantChunks, generateChatCompletionStream, DocumentChunk } from "@/lib/embeddings";
import { buildRagSystemPrompt, buildUserPrompt } from "@/lib/prompts";
import { MessageReference, ConfidenceInfo } from "@/types/chat";
import { computeConfidence, adjustConfidenceFromResponse, detectUncertaintyInResponse } from "@/lib/confidence";
import { QueryAnalytics } from "@/types/analytics";
import { getUniqueCitationNumbers } from "@/lib/citation-parser";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const timings: Record<string, number> = {};
  const start = performance.now();

  try {
    const body = await request.json();
    const { chatId, message, responseStyle, summaryLevel, model } = body;

    console.log(`[ChatRoute] Received request: chatId=${chatId}, model=${model}`);

    if (!chatId || !message) {
      return NextResponse.json(
        { error: "Chat ID and message are required" },
        { status: 400 }
      );
    }

    const dbStart = performance.now();
    const db = getDb();
    const chatRef = db.collection("chats").doc(chatId);
    const chatDoc = await chatRef.get();

    // Create chat if it doesn't exist
    if (!chatDoc.exists) {
      await chatRef.set({
        id: chatId,
        title: "New Chat",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sourceType: null,
        indexed: false,
      });
    }

    const chatData = chatDoc.exists ? chatDoc.data() : null;

    // Check if chat has a document indexed
    if (!chatData?.indexed || !chatData?.documentContent) {
      return NextResponse.json({
        answer: "Please upload a document or URL first before asking questions.",
        references: [],
      });
    }

    // Retrieve document chunks from Firestore
    const chunksSnapshot = await chatRef.collection("chunks").get();
    timings["db_fetch"] = performance.now() - dbStart;

    if (chunksSnapshot.empty) {
      return NextResponse.json({
        answer: "No document content found. Please upload a document or URL first.",
        references: [],
      });
    }

    const chunks: DocumentChunk[] = chunksSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: data.id,
        text: data.text,
        embedding: data.embedding,
        chunkIndex: data.chunkIndex,
      };
    });

    // Find relevant chunks for the user's question
    const searchStart = performance.now();
    // Balanced threshold to 0.3 to likely filter out weak citation matches while keeping relevant content
    const topK = parseInt(process.env.RAG_TOP_K || "3");
    const relevantChunks = await findRelevantChunks(message, chunks, topK, 0.3);
    timings["vector_search"] = performance.now() - searchStart;

    console.log(`[Chat] Query: "${message}"`);
    console.log(`[Chat] Found ${relevantChunks.length} relevant chunks (threshold 0.3).`);
    if (relevantChunks.length > 0) {
      console.log(`[Chat] Top Chunk Similarity: ${(relevantChunks[0].similarity ?? 0).toFixed(4)}`);
      console.log(`[Chat] Top Chunk Preview: ${relevantChunks[0].text.substring(0, 100).replace(/\n/g, " ")}...`);
    } else {
      console.warn("[Chat] No relevant chunks found. The model will likely hallucinate or refuse.");
    }

    // If no relevant chunks found, return "I do not have the answer"
    // We can be slightly more lenient here if we want the model to try with zero context, but for RAG it's better to be strict.
    // However, with 0.1 threshold, if we still get 0, it's truly irrelevant.
    if (relevantChunks.length === 0) {
      return NextResponse.json({
        answer: "I do not have the answer based on the provided document.",
        references: [],
      });
    }

    // Build context from relevant chunks
    const context = relevantChunks
      .map((chunk, index) => `[${index + 1}] ${chunk.text}`)
      .join("\n\n");

    // Check if user is asking for a graph
    const lowerMessage = message.toLowerCase();
    const graphKeywords = ["graph", "chart", "plot", "diagram", "visual", "trend"];
    const enableGraphs = graphKeywords.some(keyword => lowerMessage.includes(keyword));

    // Generate RAG prompt
    const { outputLanguage = "en" } = body;
    console.log(`[ChatRoute] Output Language: ${outputLanguage}`);
    const systemPrompt = buildRagSystemPrompt(context, responseStyle, summaryLevel, enableGraphs, outputLanguage);
    const userPrompt = buildUserPrompt(message);

    // Build references for citations
    const references: MessageReference[] = relevantChunks.map((chunk) => ({
      id: chunk.id,
      snippet: chunk.text.substring(0, 150) + (chunk.text.length > 150 ? "..." : ""),
      similarity: chunk.similarity,
    }));

    // Compute INITIAL confidence (will be adjusted after LLM response)
    const initialConfidenceMetrics = computeConfidence(message, relevantChunks);

    console.log(`[Chat] Initial Confidence: ${initialConfidenceMetrics.level} (${(initialConfidenceMetrics.overallConfidence * 100).toFixed(1)}%)`);
    console.log("Performance Timings (ms):", timings);
    const streamStart = performance.now();

    // Create a stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        // Send references first (confidence will be sent AFTER response for guardrail check)
        const referencesMessage = JSON.stringify({ type: "references", data: references });
        controller.enqueue(encoder.encode(referencesMessage + "\n"));

        let fullAnswer = "";

        try {
          // Generate streaming response
          const generator = generateChatCompletionStream(systemPrompt, userPrompt, model);

          let firstTokenTime = 0;

          for await (const chunk of generator) {
            if (firstTokenTime === 0) {
              firstTokenTime = performance.now() - streamStart;
              console.log(`Time to First Token: ${firstTokenTime.toFixed(2)}ms`);
            }
            fullAnswer += chunk;
            const tokenMessage = JSON.stringify({ type: "token", content: chunk });
            controller.enqueue(encoder.encode(tokenMessage + "\n"));
          }

          console.log(`Total Generation Time: ${(performance.now() - streamStart).toFixed(2)}ms`);

          // GUARDRAIL: Adjust confidence based on actual response content
          const adjustedMetrics = adjustConfidenceFromResponse(initialConfidenceMetrics, fullAnswer);
          const finalConfidence: ConfidenceInfo = {
            retrievalConfidence: adjustedMetrics.retrievalConfidence,
            consistencyConfidence: adjustedMetrics.consistencyConfidence,
            coverageConfidence: adjustedMetrics.coverageConfidence,
            overallConfidence: adjustedMetrics.overallConfidence,
            level: adjustedMetrics.level,
            explanation: adjustedMetrics.explanation,
          };

          if (adjustedMetrics.guardrailTriggered) {
            console.log(`[Chat] ⚠️ GUARDRAIL TRIGGERED: Confidence forced to LOW due to uncertain response`);
          }
          console.log(`[Chat] Final Confidence: ${finalConfidence.level} (${(finalConfidence.overallConfidence * 100).toFixed(1)}%)`);

          // Send final confidence AFTER response (with guardrail applied)
          const confidenceMessage = JSON.stringify({ type: "confidence", data: finalConfidence });
          controller.enqueue(encoder.encode(confidenceMessage + "\n"));

          // Save messages to Firestore after stream completes
          const userMessageRef = chatRef.collection("messages").doc();
          await userMessageRef.set({
            id: userMessageRef.id,
            role: "user",
            content: message,
            createdAt: new Date().toISOString(),
          });

          const assistantMessageRef = chatRef.collection("messages").doc();
          await assistantMessageRef.set({
            id: assistantMessageRef.id,
            role: "assistant",
            content: fullAnswer,
            createdAt: new Date().toISOString(),
            references: references,
            confidence: finalConfidence,
          });

          await chatRef.update({
            updatedAt: new Date().toISOString(),
          });

          // Log analytics
          const totalLatency = performance.now() - streamStart;
          const similarities = relevantChunks.map(c => c.similarity ?? 0);
          const { isUncertain } = detectUncertaintyInResponse(fullAnswer);

          const analyticsData: QueryAnalytics = {
            id: crypto.randomUUID(),
            chatId,
            userId: chatData?.userId || chatId,
            query: message,
            timestamp: new Date().toISOString(),
            responseLength: fullAnswer.length,
            latencyMs: totalLatency,
            firstTokenLatencyMs: firstTokenTime,
            confidenceLevel: finalConfidence.level,
            confidenceScore: finalConfidence.overallConfidence,
            guardrailTriggered: adjustedMetrics.guardrailTriggered ?? false,
            chunksRetrieved: relevantChunks.length,
            avgSimilarity: similarities.length > 0 ? similarities.reduce((a, b) => a + b, 0) / similarities.length : 0,
            topSimilarity: similarities.length > 0 ? Math.max(...similarities) : 0,
            citationsGenerated: getUniqueCitationNumbers(fullAnswer).length,
            wasAnswered: !isUncertain,
          };

          // Save to analytics collection
          try {
            await db.collection("analytics").doc(analyticsData.id).set(analyticsData);
            console.log(`[Analytics] Logged query: ${analyticsData.wasAnswered ? 'answered' : 'unanswered'}, confidence: ${analyticsData.confidenceLevel}`);
          } catch (analyticsError) {
            console.error("Failed to log analytics:", analyticsError);
          }

        } catch (error) {
          console.error("Streaming error:", error);
          const detailedError = error instanceof Error ? error.message : "Failed to generate response.";
          const errorMessage = JSON.stringify({ type: "error", content: detailedError });
          controller.enqueue(encoder.encode(errorMessage + "\n"));
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "application/x-ndjson",
        "Transfer-Encoding": "chunked",
      },
    });

  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Something went wrong while generating a response." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { chatId, all } = body;

    const db = getDb();
    const chatsRef = db.collection("chats");

    if (all) {
      // Delete all chats
      // Note: In a production app with users, this should be scoped to the user.
      // Since this is a single-user app or user-unaware for now, we'll delete all.
      // However, deleting *everything* might be dangerous if there are multiple users.
      // But based on current code, there's no auth check in the route.

      // Recursive delete is supported in firebase-admin
      const batchSize = 100;
      const query = chatsRef.orderBy('__name__').limit(batchSize);

      return new Promise<NextResponse>((resolve, reject) => {
        deleteQueryBatch(db, query, resolve).catch(reject);
      });
    }

    if (!chatId) {
      return NextResponse.json(
        { error: "Chat ID is required" },
        { status: 400 }
      );
    }

    const chatRef = chatsRef.doc(chatId);

    // Delete subcollections (messages, chunks)
    await db.recursiveDelete(chatRef);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("[chat-route-delete]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete chat" },
      { status: 500 }
    );
  }
}

async function deleteQueryBatch(db: FirebaseFirestore.Firestore, query: FirebaseFirestore.Query, resolve: (val: NextResponse) => void) {
  const snapshot = await query.get();

  const batchSize = snapshot.size;
  if (batchSize === 0) {
    // When there are no documents left, we are done
    resolve(NextResponse.json({ success: true }));
    return;
  }

  // Delete documents in parallel
  const deletePromises = snapshot.docs.map(doc => db.recursiveDelete(doc.ref));
  await Promise.all(deletePromises);

  // Recurse on the next process tick
  process.nextTick(() => {
    deleteQueryBatch(db, query, resolve);
  });
}
