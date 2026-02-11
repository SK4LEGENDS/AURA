/**
 * Analytics Types
 * 
 * Data models for tracking query analytics, confidence metrics,
 * and system performance.
 */

export interface QueryAnalytics {
    id: string;
    chatId: string;
    userId: string;
    query: string;
    timestamp: string;

    // Response metrics
    responseLength: number;
    latencyMs: number;
    firstTokenLatencyMs?: number;

    // Confidence data
    confidenceLevel: "high" | "medium" | "low";
    confidenceScore: number;
    guardrailTriggered: boolean;

    // Retrieval data
    chunksRetrieved: number;
    avgSimilarity: number;
    topSimilarity: number;

    // Citation data
    citationsGenerated: number;

    // Outcome
    wasAnswered: boolean;  // false if "I don't have the answer"
    category?: string;     // Optional query category
}

export interface AnalyticsSummary {
    // Time range
    startDate: string;
    endDate: string;

    // Query counts
    totalQueries: number;
    answeredQueries: number;
    unansweredQueries: number;
    answerRate: number;

    // Confidence distribution
    highConfidenceCount: number;
    mediumConfidenceCount: number;
    lowConfidenceCount: number;
    avgConfidenceScore: number;
    guardrailTriggerRate: number;

    // Performance
    avgLatencyMs: number;
    p50LatencyMs: number;
    p95LatencyMs: number;

    // Retrieval quality
    avgChunksRetrieved: number;
    avgSimilarity: number;

    // Confidence calibration
    confidenceCorrelation: number;

    // Top queries (knowledge gaps)
    topUnansweredQueries: Array<{
        query: string;
        count: number;
    }>;

    // Category breakdown
    queriesByCategory: Record<string, number>;
}

export interface DailyAnalytics {
    date: string;
    queries: number;
    answered: number;
    avgConfidence: number;
    avgLatency: number;
}

/**
 * Compute analytics summary from individual query records
 */
export function computeAnalyticsSummary(
    queries: QueryAnalytics[],
    startDate: string,
    endDate: string
): AnalyticsSummary {
    if (queries.length === 0) {
        return createEmptySummary(startDate, endDate);
    }

    const answered = queries.filter(q => q.wasAnswered);
    const unanswered = queries.filter(q => !q.wasAnswered);

    const highConf = queries.filter(q => q.confidenceLevel === "high");
    const medConf = queries.filter(q => q.confidenceLevel === "medium");
    const lowConf = queries.filter(q => q.confidenceLevel === "low");
    const guardrailTriggered = queries.filter(q => q.guardrailTriggered);

    const latencies = queries.map(q => q.latencyMs).sort((a, b) => a - b);

    // Count unanswered queries
    const unansweredCounts = new Map<string, number>();
    for (const q of unanswered) {
        const normalized = q.query.toLowerCase().trim();
        unansweredCounts.set(normalized, (unansweredCounts.get(normalized) || 0) + 1);
    }

    const topUnanswered = Array.from(unansweredCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([query, count]) => ({ query, count }));

    // Compute confidence-correctness correlation
    const confidenceCorrelation = computeCorrelation(
        queries.map(q => q.confidenceScore),
        queries.map(q => q.wasAnswered ? 1 : 0)
    );

    return {
        startDate,
        endDate,
        totalQueries: queries.length,
        answeredQueries: answered.length,
        unansweredQueries: unanswered.length,
        answerRate: answered.length / queries.length,
        highConfidenceCount: highConf.length,
        mediumConfidenceCount: medConf.length,
        lowConfidenceCount: lowConf.length,
        avgConfidenceScore: mean(queries.map(q => q.confidenceScore)),
        guardrailTriggerRate: guardrailTriggered.length / queries.length,
        avgLatencyMs: mean(latencies),
        p50LatencyMs: percentile(latencies, 50),
        p95LatencyMs: percentile(latencies, 95),
        avgChunksRetrieved: mean(queries.map(q => q.chunksRetrieved)),
        avgSimilarity: mean(queries.map(q => q.avgSimilarity)),
        confidenceCorrelation,
        topUnansweredQueries: topUnanswered,
        queriesByCategory: {},
    };
}

function createEmptySummary(startDate: string, endDate: string): AnalyticsSummary {
    return {
        startDate,
        endDate,
        totalQueries: 0,
        answeredQueries: 0,
        unansweredQueries: 0,
        answerRate: 0,
        highConfidenceCount: 0,
        mediumConfidenceCount: 0,
        lowConfidenceCount: 0,
        avgConfidenceScore: 0,
        guardrailTriggerRate: 0,
        avgLatencyMs: 0,
        p50LatencyMs: 0,
        p95LatencyMs: 0,
        avgChunksRetrieved: 0,
        avgSimilarity: 0,
        confidenceCorrelation: 0,
        topUnansweredQueries: [],
        queriesByCategory: {},
    };
}

function mean(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
}

function percentile(sorted: number[], p: number): number {
    if (sorted.length === 0) return 0;
    const index = Math.ceil((p / 100) * sorted.length) - 1;
    return sorted[Math.max(0, index)];
}

function computeCorrelation(x: number[], y: number[]): number {
    const n = x.length;
    if (n < 2) return 0;

    const xMean = mean(x);
    const yMean = mean(y);

    let num = 0, denomX = 0, denomY = 0;
    for (let i = 0; i < n; i++) {
        const dx = x[i] - xMean;
        const dy = y[i] - yMean;
        num += dx * dy;
        denomX += dx * dx;
        denomY += dy * dy;
    }

    const denom = Math.sqrt(denomX * denomY);
    return denom > 0 ? num / denom : 0;
}
