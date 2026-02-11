/**
 * Ablation Study - Metrics Module
 * 
 * Computes evaluation metrics for RAG system performance:
 * - Faithfulness: Are claims grounded in context?
 * - Answer Relevance: Does the answer address the question?
 * - Retrieval Precision: Are retrieved chunks relevant?
 * - Hallucination Rate: Percentage of fabricated content
 * - Latency: Response time measurements
 */

import { DocumentChunk } from "@/lib/embeddings";
import { ConfidenceMetrics } from "@/lib/confidence";

export interface AblationMetrics {
    faithfulness: number;         // 0-1: proportion of claims grounded in context
    answerRelevance: number;      // 0-1: semantic similarity to expected answer
    retrievalPrecision: number;   // 0-1: proportion of relevant chunks in top-K
    hallucinationRate: number;    // 0-1: proportion of fabricated content
    noAnswerRate: number;         // 0-1: appropriate "I don't know" responses
    latencyMs: number;            // Response time in milliseconds
    firstTokenLatencyMs: number;  // Time to first token
}

export interface TestCase {
    id: string;
    question: string;
    documentId: string;
    groundTruthAnswer: string;
    relevantChunkIds: string[];
    category: "factual" | "comparative" | "analytical" | "numerical" | "out_of_scope";
    difficulty: "easy" | "medium" | "hard";
}

export interface AblationConfig {
    temperature: number;
    chunkSize: number;
    chunkOverlap: number;
    topK: number;
    similarityThreshold: number;
}

export interface ExperimentResult {
    config: AblationConfig;
    metrics: AblationMetrics;
    individualResults: SingleTestResult[];
    timestamp: string;
}

export interface SingleTestResult {
    testCaseId: string;
    question: string;
    generatedAnswer: string;
    groundTruthAnswer: string;
    retrievedChunkIds: string[];
    expectedChunkIds: string[];
    confidence: ConfidenceMetrics | null;
    latencyMs: number;
    isCorrect: boolean;
    isHallucination: boolean;
}

/**
 * Compute faithfulness score
 * Measures how well the generated answer is grounded in the retrieved context
 */
export function computeFaithfulness(
    generatedAnswer: string,
    retrievedChunks: DocumentChunk[]
): number {
    if (!generatedAnswer.trim() || retrievedChunks.length === 0) {
        return 0;
    }

    // Extract key claims from the answer (sentences/phrases)
    const claims = extractClaims(generatedAnswer);
    if (claims.length === 0) return 1; // No claims = vacuously faithful

    // Combine all chunk text
    const contextText = retrievedChunks.map(c => c.text.toLowerCase()).join(" ");

    // Check how many claims can be found in context
    let groundedClaims = 0;
    for (const claim of claims) {
        // Simple word overlap check (can be enhanced with semantic similarity)
        const claimWords = claim.toLowerCase().split(/\s+/).filter(w => w.length > 3);
        const matchedWords = claimWords.filter(word => contextText.includes(word));
        const overlapRatio = matchedWords.length / Math.max(claimWords.length, 1);

        if (overlapRatio >= 0.5) {
            groundedClaims++;
        }
    }

    return groundedClaims / claims.length;
}

/**
 * Compute answer relevance score
 * Measures semantic similarity between generated answer and ground truth
 */
export function computeAnswerRelevance(
    generatedAnswer: string,
    groundTruthAnswer: string
): number {
    if (!generatedAnswer.trim() || !groundTruthAnswer.trim()) {
        return 0;
    }

    // Simple word-based Jaccard similarity (can be enhanced with embeddings)
    const genWords = new Set(
        generatedAnswer.toLowerCase()
            .replace(/[^\w\s]/g, "")
            .split(/\s+/)
            .filter(w => w.length > 2)
    );

    const truthWords = new Set(
        groundTruthAnswer.toLowerCase()
            .replace(/[^\w\s]/g, "")
            .split(/\s+/)
            .filter(w => w.length > 2)
    );

    const intersection = new Set([...genWords].filter(x => truthWords.has(x)));
    const union = new Set([...genWords, ...truthWords]);

    return union.size > 0 ? intersection.size / union.size : 0;
}

/**
 * Compute retrieval precision
 * Measures what proportion of retrieved chunks are actually relevant
 */
export function computeRetrievalPrecision(
    retrievedChunkIds: string[],
    relevantChunkIds: string[]
): number {
    if (retrievedChunkIds.length === 0) return 0;

    const relevantSet = new Set(relevantChunkIds);
    const correctlyRetrieved = retrievedChunkIds.filter(id => relevantSet.has(id));

    return correctlyRetrieved.length / retrievedChunkIds.length;
}

/**
 * Compute retrieval recall
 * Measures what proportion of relevant chunks were retrieved
 */
export function computeRetrievalRecall(
    retrievedChunkIds: string[],
    relevantChunkIds: string[]
): number {
    if (relevantChunkIds.length === 0) return 1; // No relevant = vacuously complete

    const retrievedSet = new Set(retrievedChunkIds);
    const correctlyRetrieved = relevantChunkIds.filter(id => retrievedSet.has(id));

    return correctlyRetrieved.length / relevantChunkIds.length;
}

/**
 * Detect if response indicates "no answer" appropriately
 */
export function isNoAnswerResponse(response: string): boolean {
    const lowerResponse = response.toLowerCase().trim();
    const noAnswerPhrases = [
        "i do not have the answer",
        "i don't have the answer",
        "i cannot answer",
        "i can't answer",
        "not in the context",
        "no information",
        "context does not contain",
        "cannot find",
        "not mentioned",
        "not found in the document",
    ];
    return noAnswerPhrases.some(phrase => lowerResponse.includes(phrase));
}

/**
 * Detect potential hallucination
 * A response is hallucinated if it provides specific claims not in context
 * for questions that should have context-based answers
 */
export function detectHallucination(
    generatedAnswer: string,
    retrievedChunks: DocumentChunk[],
    isOutOfScope: boolean
): boolean {
    // If out of scope and gives "no answer", not hallucinating
    if (isOutOfScope && isNoAnswerResponse(generatedAnswer)) {
        return false;
    }

    // If out of scope but gives a specific answer, that's hallucination
    if (isOutOfScope && !isNoAnswerResponse(generatedAnswer)) {
        // Check if answer contains specific claims (numbers, names, dates)
        const hasSpecificClaims = /\d+|January|February|March|April|May|June|July|August|September|October|November|December|\$|%/.test(generatedAnswer);
        return hasSpecificClaims;
    }

    // For in-scope questions, check if answer has low faithfulness
    const faithfulness = computeFaithfulness(generatedAnswer, retrievedChunks);
    return faithfulness < 0.3; // Low grounding = likely hallucination
}

/**
 * Extract claims (sentences) from text
 */
function extractClaims(text: string): string[] {
    // Split by sentence boundaries
    const sentences = text
        .split(/[.!?]+/)
        .map(s => s.trim())
        .filter(s => s.length > 10); // Filter out very short fragments

    return sentences;
}

/**
 * Aggregate metrics from multiple test results
 */
export function aggregateMetrics(results: SingleTestResult[]): Omit<AblationMetrics, "latencyMs" | "firstTokenLatencyMs"> {
    if (results.length === 0) {
        return {
            faithfulness: 0,
            answerRelevance: 0,
            retrievalPrecision: 0,
            hallucinationRate: 0,
            noAnswerRate: 0,
        };
    }

    let totalFaithfulness = 0;
    let totalRelevance = 0;
    let totalPrecision = 0;
    let hallucinationCount = 0;
    let noAnswerCount = 0;

    for (const result of results) {
        // Faithfulness approximation from isCorrect
        totalFaithfulness += result.isCorrect ? 1 : 0;

        // Relevance (would need ground truth comparison)
        totalRelevance += result.isCorrect ? 1 : 0.5;

        // Precision
        const precision = computeRetrievalPrecision(
            result.retrievedChunkIds,
            result.expectedChunkIds
        );
        totalPrecision += precision;

        // Hallucination
        if (result.isHallucination) hallucinationCount++;

        // No answer
        if (isNoAnswerResponse(result.generatedAnswer)) noAnswerCount++;
    }

    return {
        faithfulness: totalFaithfulness / results.length,
        answerRelevance: totalRelevance / results.length,
        retrievalPrecision: totalPrecision / results.length,
        hallucinationRate: hallucinationCount / results.length,
        noAnswerRate: noAnswerCount / results.length,
    };
}

/**
 * Format metrics for display
 */
export function formatMetricsTable(metrics: AblationMetrics): string {
    return `
| Metric               | Value   |
|---------------------|---------|
| Faithfulness        | ${(metrics.faithfulness * 100).toFixed(1)}% |
| Answer Relevance    | ${(metrics.answerRelevance * 100).toFixed(1)}% |
| Retrieval Precision | ${(metrics.retrievalPrecision * 100).toFixed(1)}% |
| Hallucination Rate  | ${(metrics.hallucinationRate * 100).toFixed(1)}% |
| No-Answer Rate      | ${(metrics.noAnswerRate * 100).toFixed(1)}% |
| Avg Latency         | ${metrics.latencyMs.toFixed(0)}ms |
| First Token Latency | ${metrics.firstTokenLatencyMs.toFixed(0)}ms |
`.trim();
}
