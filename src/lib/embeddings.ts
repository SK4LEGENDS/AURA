import { Ollama } from "ollama";

const OLLAMA_HOST = "http://127.0.0.1:11434"; // Force IPv4 and standard port for debugging
console.log("Initializing Ollama with host:", OLLAMA_HOST); // Debug log

const ollama = new Ollama({
    host: OLLAMA_HOST,
});

const CHAT_MODEL = process.env.OLLAMA_CHAT_MODEL || "phi3:mini";
const EMBEDDING_MODEL = process.env.OLLAMA_EMBEDDING_MODEL || "nomic-embed-text";

console.log("[Embeddings] Default CHAT_MODEL:", CHAT_MODEL);
console.log("[Embeddings] Default EMBEDDING_MODEL:", EMBEDDING_MODEL);

export interface DocumentChunk {
    id: string;
    text: string;
    embedding: number[];
    chunkIndex: number;
    similarity?: number;
}

/**
 * Generate embedding for a text using Ollama
 */
export async function generateEmbedding(text: string): Promise<number[]> {
    try {
        const response = await ollama.embed({
            model: EMBEDDING_MODEL,
            input: text,
        });

        return response.embeddings[0];
    } catch (error) {
        console.error("Error generating embedding:", error);
        throw error; // Throw original error to expose details
    }
}

/**
 * Generate embeddings for multiple texts in batch
 */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
    try {
        const embeddings: number[][] = [];

        // Process in batches to avoid overwhelming the API
        for (const text of texts) {
            const embedding = await generateEmbedding(text);
            embeddings.push(embedding);
        }

        return embeddings;
    } catch (error) {
        console.error("Error generating embeddings:", error);
        throw error; // Throw original error
    }
}

/**
 * Calculate cosine similarity between two vectors
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
        throw new Error("Vectors must have the same length");
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }

    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);

    if (normA === 0 || normB === 0) {
        return 0;
    }

    return dotProduct / (normA * normB);
}

/**
 * Find the most relevant chunks for a query using cosine similarity
 */
export async function findRelevantChunks(
    query: string,
    chunks: DocumentChunk[],
    topK: number = 5,
    similarityThreshold: number = 0.3
): Promise<DocumentChunk[]> {
    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query);

    // Calculate similarity for each chunk
    const chunksWithSimilarity = chunks.map((chunk) => ({
        ...chunk,
        similarity: cosineSimilarity(queryEmbedding, chunk.embedding),
    }));

    return chunksWithSimilarity
        .filter((chunk) => chunk.similarity! >= similarityThreshold)
        .sort((a, b) => b.similarity! - a.similarity!)
        .slice(0, topK);
}

/**
 * Generate chat completion using Ollama
 */
export async function generateChatCompletion(
    systemPrompt: string,
    userMessage: string,
    model?: string
): Promise<string> {
    try {
        const response = await ollama.chat({
            model: model || CHAT_MODEL,
            messages: [
                {
                    role: "system",
                    content: systemPrompt,
                },
                {
                    role: "user",
                    content: userMessage,
                },
            ],
            stream: false,
            options: {
                temperature: 0.3,
                repeat_penalty: 1.2,
                stop: ["Question:", "User:", "System:"],
            },
        });

        return response.message.content;
    } catch (error) {
        console.error("Error generating chat completion:", error);
        throw new Error("Failed to generate chat completion");
    }
}

/**
 * Generate chat completion using Ollama with streaming
 */
export async function* generateChatCompletionStream(
    systemPrompt: string,
    userMessage: string,
    model?: string
): AsyncGenerator<string, void, unknown> {
    const selectedModel = (model && model.trim()) || CHAT_MODEL || "phi3:mini";
    console.log(`[ChatStream] Using model: "${selectedModel}" (input model: "${model}")`);

    try {
        const response = await ollama.chat({
            model: selectedModel,
            messages: [
                {
                    role: "system",
                    content: systemPrompt,
                },
                {
                    role: "user",
                    content: userMessage,
                },
            ],
            stream: true,
            keep_alive: "5m", // Keep model loaded for 5 minutes
            options: {
                temperature: 0.3,
                repeat_penalty: 1.2,
                num_ctx: 8192, // Increase context window to handle RAG data
                stop: ["Question:", "User:", "System:"],
            },
        });

        for await (const part of response) {
            yield part.message.content;
        }
    } catch (error) {
        console.error(`Error generating chat completion stream for model ${selectedModel}:`, error);
        const errorMessage = error instanceof Error ? error.message : "Ollama connection failed";
        throw new Error(`Failed to generate response: ${errorMessage}`);
    }
}
