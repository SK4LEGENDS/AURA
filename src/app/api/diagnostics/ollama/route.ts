import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
    const ollamaUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434";

    const results = {
        ollamaConnected: false,
        models: {
            llama32: false,
            nomic: false,
        },
        error: null as string | null,
    };

    try {
        // 1. Check if Ollama is running
        const tagsResponse = await fetch(`${ollamaUrl}/api/tags`).catch(() => null);

        if (!tagsResponse || !tagsResponse.ok) {
            results.error = "COULD_NOT_CONNECT_TO_OLLAMA";
            return NextResponse.json(results);
        }

        results.ollamaConnected = true;
        const tagsData = await tagsResponse.json();
        const models = tagsData.models || [];

        // 2. Check for required models
        results.models.llama32 = models.some((m: any) => m.name.includes("llama3.2"));
        results.models.nomic = models.some((m: any) => m.name.includes("nomic-embed-text"));

    } catch (err: any) {
        results.error = err.message;
    }

    return NextResponse.json(results);
}
