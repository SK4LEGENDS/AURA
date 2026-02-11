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

        // Parallel warmup
        const p1 = ollama.chat({
            model: CHAT_MODEL,
            messages: [],
            keep_alive: "60m",
        }).catch(e => console.error("Chat warmup failed:", e));

        const p2 = ollama.embed({
            model: EMBEDDING_MODEL,
            input: "warmup",
            keep_alive: "60m",
        }).catch(e => console.error("Embedding warmup failed:", e));

        // We don't necessarily await the full completion to respond to the client quickly, 
        // but Next.js serverless functions might kill background tasks. 
        // Since this is likely a local server (long running process), we can fire and forget?
        // No, better to await to ensure it actually triggers.
        await Promise.all([p1, p2]);

        console.log("Model warmup initiated.");
        return NextResponse.json({ status: "warmed_up" });
    } catch (error) {
        console.error("Warmup error:", error);
        return NextResponse.json({ error: "Failed to warmup models" }, { status: 500 });
    }
}
