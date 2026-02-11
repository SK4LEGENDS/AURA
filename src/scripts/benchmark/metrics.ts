/**
 * AURA Performance Benchmark Suite
 * 
 * Standardized benchmarking framework to compare AURA against cloud RAG solutions.
 * Measures: accuracy, latency, hallucination rate, confidence calibration.
 */

export interface BenchmarkQuery {
    id: string;
    question: string;
    groundTruth: string;
    category: "factual" | "numerical" | "comparative" | "analytical";
    difficulty: "easy" | "medium" | "hard";
    expectedInDocument: boolean;
}

export interface BenchmarkDocument {
    id: string;
    name: string;
    content: string;
    queries: BenchmarkQuery[];
}

export interface BenchmarkResult {
    queryId: string;
    question: string;
    groundTruth: string;
    modelAnswer: string;

    // Accuracy metrics
    isCorrect: boolean;
    partialScore: number;     // 0-1 for partial matches
    isHallucination: boolean;

    // Performance metrics
    latencyMs: number;
    firstTokenMs: number;
    tokensGenerated: number;

    // Confidence metrics
    confidenceLevel: string;
    confidenceScore: number;
    guardrailTriggered: boolean;

    // Metadata
    chunksRetrieved: number;
    topSimilarity: number;
    citationsGenerated: number;
}

export interface BenchmarkSummary {
    // Overall stats
    totalQueries: number;
    correctAnswers: number;
    accuracy: number;
    hallucinationRate: number;

    // Confidence calibration
    highConfidenceAccuracy: number;    // Accuracy when confidence=high
    lowConfidenceAccuracy: number;     // Accuracy when confidence=low
    confidenceCorrelation: number;     // How well confidence predicts correctness

    // Performance
    avgLatencyMs: number;
    p50LatencyMs: number;
    p95LatencyMs: number;
    avgFirstTokenMs: number;

    // Breakdown by category
    accuracyByCategory: Record<string, number>;
    accuracyByDifficulty: Record<string, number>;

    // Comparison data (to be filled with cloud comparison)
    systemName: string;
    timestamp: string;
}

/**
 * Compute benchmark summary from individual results
 */
export function computeBenchmarkSummary(
    results: BenchmarkResult[],
    systemName: string
): BenchmarkSummary {
    if (results.length === 0) {
        return createEmptySummary(systemName);
    }

    const correct = results.filter(r => r.isCorrect);
    const hallucinations = results.filter(r => r.isHallucination);

    const highConf = results.filter(r => r.confidenceLevel === "high");
    const lowConf = results.filter(r => r.confidenceLevel === "low");

    const latencies = results.map(r => r.latencyMs).sort((a, b) => a - b);

    // Accuracy by category
    const categories = ["factual", "numerical", "comparative", "analytical"];
    const accuracyByCategory: Record<string, number> = {};
    for (const cat of categories) {
        const catResults = results.filter(r => r.question.toLowerCase().includes(cat));
        accuracyByCategory[cat] = catResults.length > 0
            ? catResults.filter(r => r.isCorrect).length / catResults.length
            : 0;
    }

    // Accuracy by difficulty (estimated from confidence)
    const accuracyByDifficulty: Record<string, number> = {
        easy: highConf.filter(r => r.isCorrect).length / (highConf.length || 1),
        medium: results.filter(r => r.confidenceLevel === "medium" && r.isCorrect).length /
            (results.filter(r => r.confidenceLevel === "medium").length || 1),
        hard: lowConf.filter(r => r.isCorrect).length / (lowConf.length || 1),
    };

    // Confidence calibration: correlation between confidence and correctness
    const confCorr = computeConfidenceCorrelation(results);

    return {
        totalQueries: results.length,
        correctAnswers: correct.length,
        accuracy: correct.length / results.length,
        hallucinationRate: hallucinations.length / results.length,
        highConfidenceAccuracy: highConf.filter(r => r.isCorrect).length / (highConf.length || 1),
        lowConfidenceAccuracy: lowConf.filter(r => r.isCorrect).length / (lowConf.length || 1),
        confidenceCorrelation: confCorr,
        avgLatencyMs: mean(latencies),
        p50LatencyMs: percentile(latencies, 50),
        p95LatencyMs: percentile(latencies, 95),
        avgFirstTokenMs: mean(results.map(r => r.firstTokenMs)),
        accuracyByCategory,
        accuracyByDifficulty,
        systemName,
        timestamp: new Date().toISOString(),
    };
}

function computeConfidenceCorrelation(results: BenchmarkResult[]): number {
    // Simple correlation: do high confidence answers tend to be correct?
    const n = results.length;
    if (n < 2) return 0;

    const x = results.map(r => r.confidenceScore);
    const y = results.map(r => r.isCorrect ? 1 : 0);

    const xMean = mean(x);
    const yMean = mean(y);

    let numerator = 0;
    let denomX = 0;
    let denomY = 0;

    for (let i = 0; i < n; i++) {
        const dx = x[i] - xMean;
        const dy = y[i] - yMean;
        numerator += dx * dy;
        denomX += dx * dx;
        denomY += dy * dy;
    }

    const denom = Math.sqrt(denomX * denomY);
    return denom > 0 ? numerator / denom : 0;
}

function createEmptySummary(systemName: string): BenchmarkSummary {
    return {
        totalQueries: 0,
        correctAnswers: 0,
        accuracy: 0,
        hallucinationRate: 0,
        highConfidenceAccuracy: 0,
        lowConfidenceAccuracy: 0,
        confidenceCorrelation: 0,
        avgLatencyMs: 0,
        p50LatencyMs: 0,
        p95LatencyMs: 0,
        avgFirstTokenMs: 0,
        accuracyByCategory: {},
        accuracyByDifficulty: {},
        systemName,
        timestamp: new Date().toISOString(),
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

/**
 * Sample benchmark dataset
 */
export const SAMPLE_BENCHMARK_QUERIES: BenchmarkQuery[] = [
    {
        id: "q1",
        question: "What is the total revenue mentioned in the document?",
        groundTruth: "",  // To be filled based on document
        category: "numerical",
        difficulty: "easy",
        expectedInDocument: true,
    },
    {
        id: "q2",
        question: "Who is the CEO of the company?",
        groundTruth: "",
        category: "factual",
        difficulty: "easy",
        expectedInDocument: true,
    },
    {
        id: "q3",
        question: "Compare the Q1 and Q2 performance metrics.",
        groundTruth: "",
        category: "comparative",
        difficulty: "medium",
        expectedInDocument: true,
    },
    {
        id: "q4",
        question: "What was the company's stock price on January 15th, 2024?",
        groundTruth: "Not in document",
        category: "numerical",
        difficulty: "hard",
        expectedInDocument: false,  // Trick question to test hallucination
    },
    {
        id: "q5",
        question: "Why did the company change its strategy?",
        groundTruth: "",
        category: "analytical",
        difficulty: "hard",
        expectedInDocument: true,
    },
];
