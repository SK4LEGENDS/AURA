import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebase-admin";
import { QueryAnalytics, computeAnalyticsSummary } from "@/types/analytics";

export const runtime = "nodejs";

/**
 * GET /api/analytics
 * 
 * Fetches all analytics data - simplified for reliability
 */
export async function GET(request: NextRequest) {
    try {
        const db = getDb();

        // Simple query - just get all documents, no filters
        const snapshot = await db.collection("analytics").get();

        const queries: QueryAnalytics[] = [];
        snapshot.forEach(doc => {
            queries.push(doc.data() as QueryAnalytics);
        });

        // Sort in memory
        queries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        const now = new Date().toISOString();
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

        // Compute summary
        const summary = computeAnalyticsSummary(queries, weekAgo, now);

        console.log(`[Analytics API] Found ${queries.length} documents`);

        return NextResponse.json({
            success: true,
            summary,
            queries: queries.slice(0, 50),
            total: queries.length,
        });

    } catch (error) {
        console.error("Analytics API error:", error);
        return NextResponse.json(
            { error: "Failed to fetch analytics", details: String(error) },
            { status: 500 }
        );
    }
}
