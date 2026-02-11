import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebase-admin";
import { processDocument, processUrl, chunkText } from "@/lib/document-processor";
import { processAndChunkExcel } from "@/lib/excel-processor";
import { generateEmbeddings } from "@/lib/embeddings";
import { DocumentChunk } from "@/types/chat";
import { adaptiveChunk, DEFAULT_CHUNK_CONFIG, getChunkStats } from "@/lib/adaptive-chunker";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const chatId = formData.get("chatId") as string;
        const type = formData.get("type") as string; // "file" or "url"
        const file = formData.get("file") as File | null;
        const url = formData.get("url") as string | null;

        if (!chatId) {
            return NextResponse.json(
                { error: "Chat ID is required" },
                { status: 400 }
            );
        }

        if (!type || (type !== "file" && type !== "url")) {
            return NextResponse.json(
                { error: "Type must be 'file' or 'url'" },
                { status: 400 }
            );
        }

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

        // Check if chat already has a source
        if (chatData?.sourceType) {
            return NextResponse.json(
                { error: "This chat already has a knowledge source. Create a new chat to upload a different source." },
                { status: 400 }
            );
        }

        let documentContent: string;
        let sourceName: string | undefined;
        let sourceUrl: string | undefined;
        let sourceFileSize: number | undefined;

        // Process based on type
        let chunks: string[] = [];

        if (type === "file") {
            if (!file) {
                return NextResponse.json(
                    { error: "File is required" },
                    { status: 400 }
                );
            }

            if (file.size > MAX_FILE_SIZE) {
                return NextResponse.json(
                    { error: "File size exceeds 10MB limit" },
                    { status: 400 }
                );
            }

            sourceName = file.name;
            sourceFileSize = file.size;

            // Check if Excel file
            if (
                file.name.endsWith(".xlsx") ||
                file.name.endsWith(".xls") ||
                file.name.endsWith(".csv")
            ) {
                console.log("[Upload] Starting Excel processing for:", file.name);
                // Specialized Excel Processing
                chunks = await processAndChunkExcel(file);
                console.log("[Upload] Excel processing complete. Chunks:", chunks.length);
                // We construct a 'documentContent' that is just a summary for storage purposes, 
                // since the real content is in the structured chunks.
                documentContent = `[Excel/CSV File Processed: ${file.name}]\nContains ${chunks.length} structured chunks.`;
            } else {
                console.log("[Upload] Starting standard processing for:", file.name);
                // Standard Processing with ADAPTIVE CHUNKING
                documentContent = await processDocument(file);

                // Use adaptive chunking for structure-aware splitting
                const adaptiveChunks = adaptiveChunk(documentContent, {
                    ...DEFAULT_CHUNK_CONFIG,
                    preserveStructure: true,
                });
                chunks = adaptiveChunks.map(c => c.text);

                const stats = getChunkStats(adaptiveChunks);
                console.log("[Upload] Adaptive chunking complete.", {
                    totalChunks: stats.count,
                    avgSize: stats.avgSize,
                    structureTypes: stats.structureBreakdown,
                });
            }
        } else {
            // type === "url"
            if (!url) {
                return NextResponse.json(
                    { error: "URL is required" },
                    { status: 400 }
                );
            }

            sourceUrl = url;
            documentContent = await processUrl(url);

            // Use adaptive chunking for URLs too
            const adaptiveChunks = adaptiveChunk(documentContent, {
                ...DEFAULT_CHUNK_CONFIG,
                preserveStructure: true,
            });
            chunks = adaptiveChunks.map(c => c.text);
            console.log("[Upload] URL adaptive chunking complete. Chunks:", chunks.length);
        }

        // Validate content if it was standard processing (Excel chunks might be valid even if documentContent is summary)
        if ((!documentContent || documentContent.length < 50) && chunks.length === 0) {
            console.error("[Upload] Content validation failed. Content length:", documentContent?.length, "Chunks:", chunks.length);
            return NextResponse.json(
                { error: "Could not extract sufficient content from the source" },
                { status: 400 }
            );
        }

        // Chunk the document (already done if Excel)
        // const chunks = chunkText(documentContent);

        if (chunks.length === 0) {
            console.error("[Upload] No chunks generated.");
            const isExcel = file?.name.match(/\.(xlsx|xls|csv)$/);
            const msg = isExcel
                ? "No readable content found in Excel file. Ensure the file has data rows (not just headers) and is not empty."
                : "Failed to extract content chunks from document.";

            return NextResponse.json(
                { error: msg },
                { status: 400 }
            );
        }

        console.log("[Upload] Generating embeddings for", chunks.length, "chunks...");
        // Generate embeddings for all chunks
        const embeddings = await generateEmbeddings(chunks);
        console.log("[Upload] Embeddings generated.");

        // Create document chunks with embeddings
        const documentChunks: DocumentChunk[] = chunks.map((text, index) => ({
            id: `chunk_${index}`,
            text,
            embedding: embeddings[index],
            chunkIndex: index,
        }));

        // Update chat document in Firestore
        await chatRef.update({
            sourceType: type,
            sourceName: sourceName || null,
            sourceUrl: sourceUrl || null,
            sourceFileSize: sourceFileSize || null,
            documentContent,
            indexed: true,
            processedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });

        // Store chunks in subcollection using batches
        const chunksRef = chatRef.collection("chunks");

        // CLEANUP: Delete existing chunks to prevent "zombie" chunks using robust recursive delete
        console.log(`[Upload] Cleanup: Deleting old chunks from ${chunksRef.path}...`);
        // recursiveDelete is available in firebase-admin v11+ and handles batching automatically
        await db.recursiveDelete(chunksRef);
        console.log("[Upload] Cleanup complete.");

        const BATCH_SIZE = 50;

        for (let i = 0; i < documentChunks.length; i += BATCH_SIZE) {
            const batch = db.batch();
            const chunkBatch = documentChunks.slice(i, i + BATCH_SIZE);

            chunkBatch.forEach((chunk) => {
                const chunkRef = chunksRef.doc(chunk.id);
                batch.set(chunkRef, chunk);
            });

            await batch.commit();
        }

        return NextResponse.json({
            success: true,
            chatId,
            documentContent: documentContent.substring(0, 500) + "...", // Preview
            chunkCount: chunks.length,
            message: `Successfully processed ${type === "file" ? "document" : "URL"}`,
        });
    } catch (error) {
        console.error("[upload-route]", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to process upload" },
            { status: 500 }
        );
    }
}
