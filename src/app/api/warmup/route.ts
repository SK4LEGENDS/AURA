import { NextResponse } from "next/server";
import { Ollama } from "ollama";

export const runtime = "nodejs";

const ollama = new Ollama({
    host: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
});

const CHAT_MODEL = process.env.OLLAMA_CHAT_MODEL || "phi3:mini"; // Defaulting to phi3:mini as it seems to be the preferred default
const EMBEDDING_MODEL = process.env.OLLAMA_EMBEDDING_MODEL || "nomic-embed-text";

export async function GET() {
    try {
        console.log("Starting model warmup...");

        // Parallel warmup with extended keep_alive
        const p1 = ollama.chat({
            model: CHAT_MODEL,
            messages: [],
            keep_alive: "60m", // Keep loaded for 1 hour
        }).catch(e => {
            console.error(`Chat warmup failed for ${CHAT_MODEL}:`, e);
            return null;
        });

        const p2 = ollama.embed({
            model: EMBEDDING_MODEL,
            input: "warmup",
            keep_alive: "60m", // Keep loaded for 1 hour
        }).catch(e => {
            console.error(`Embedding warmup failed for ${EMBEDDING_MODEL}:`, e);
            return null;
        });

        // Wait for both to initiate (or fail)
        await Promise.all([p1, p2]);

        console.log("Model warmup initiated successfully.");
        return NextResponse.json({ status: "warmed_up", keep_alive: "60m" });
    } catch (error) {
        console.error("Warmup critical error:", error);
        return NextResponse.json({
            error: "Failed to warmup models",
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
