import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebase-admin";
import { QueryAnalytics } from "@/types/analytics";

export const runtime = "nodejs";

/**
 * POST /api/analytics/seed
 * 
 * Seeds demo analytics data for dashboard demonstration.
 * This creates realistic sample data to show the dashboard works.
 */
export async function POST(request: NextRequest) {
    try {
        const db = getDb();
        const analyticsRef = db.collection("analytics");

        // Generate 15 sample analytics entries
        const sampleQueries = [
            { query: "What is the total revenue for Q3 2024?", confidence: "high", score: 0.92, answered: true },
            { query: "Who is the CEO of the company?", confidence: "high", score: 0.88, answered: true },
            { query: "Compare Q1 and Q2 performance", confidence: "medium", score: 0.72, answered: true },
            { query: "What was the stock price on Jan 15?", confidence: "low", score: 0.35, answered: false },
            { query: "Explain the growth strategy", confidence: "high", score: 0.85, answered: true },
            { query: "What are the key risks mentioned?", confidence: "medium", score: 0.68, answered: true },
            { query: "How much was spent on R&D?", confidence: "high", score: 0.91, answered: true },
            { query: "List all product launches", confidence: "medium", score: 0.75, answered: true },
            { query: "What is the employee count?", confidence: "high", score: 0.89, answered: true },
            { query: "Forecast for next quarter", confidence: "low", score: 0.42, answered: false },
            { query: "Revenue breakdown by region", confidence: "high", score: 0.86, answered: true },
            { query: "Operating expenses trend", confidence: "medium", score: 0.71, answered: true },
            { query: "Customer acquisition cost", confidence: "medium", score: 0.65, answered: true },
            { query: "Market share analysis", confidence: "low", score: 0.48, answered: false },
            { query: "Profit margin by product", confidence: "high", score: 0.83, answered: true },
        ];

        const batch = db.batch();
        const now = Date.now();

        sampleQueries.forEach((sample, index) => {
            const id = `demo_${Date.now()}_${index}`;
            const timestamp = new Date(now - index * 3600000).toISOString(); // 1 hour apart

            const analyticsData: QueryAnalytics = {
                id,
                chatId: "demo_chat",
                userId: "demo_user",
                query: sample.query,
                timestamp,
                responseLength: 150 + Math.floor(Math.random() * 300),
                latencyMs: 800 + Math.floor(Math.random() * 1500),
                firstTokenLatencyMs: 100 + Math.floor(Math.random() * 200),
                confidenceLevel: sample.confidence as "high" | "medium" | "low",
                confidenceScore: sample.score,
                guardrailTriggered: sample.confidence === "low" && !sample.answered,
                chunksRetrieved: 3 + Math.floor(Math.random() * 5),
                avgSimilarity: 0.5 + Math.random() * 0.4,
                topSimilarity: 0.7 + Math.random() * 0.25,
                citationsGenerated: sample.answered ? 1 + Math.floor(Math.random() * 4) : 0,
                wasAnswered: sample.answered,
            };

            batch.set(analyticsRef.doc(id), analyticsData);
        });

        await batch.commit();

        console.log("[Analytics Seed] Created 15 demo analytics entries");

        return NextResponse.json({
            success: true,
            message: "Seeded 15 demo analytics entries",
            count: sampleQueries.length,
        });

    } catch (error) {
        console.error("Analytics seed error:", error);
        return NextResponse.json(
            { error: "Failed to seed analytics", details: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}
