/**
 * Confidence-Aware RAG (CA-RAG) Module
 * 
 * Computes interpretable confidence scores for RAG responses based on:
 * - Retrieval confidence: How well chunks match the query
 * - Consistency confidence: How consistent the retrieved chunks are
 * - Coverage confidence: How well query terms appear in context
 * - Response analysis: Whether the answer indicates uncertainty (GUARDRAIL)
 * 
 * IMPORTANT: Response-aware adjustment ensures that answers indicating
 * missing information are ALWAYS marked as LOW confidence, regardless
 * of retrieval metrics.
 */

import { DocumentChunk } from "./embeddings";

export interface ConfidenceMetrics {
    retrievalConfidence: number;    // Based on mean similarity of retrieved chunks
    consistencyConfidence: number;  // Based on variance in similarity scores (lower = more consistent)
    coverageConfidence: number;     // Based on query terms appearing in retrieved chunks
    overallConfidence: number;      // Weighted composite score
    level: "high" | "medium" | "low";
    explanation: string;
    guardrailTriggered?: boolean;   // True if confidence was forced low due to response content
}

export interface ConfidenceWeights {
    retrieval: number;
    consistency: number;
    coverage: number;
}

const DEFAULT_WEIGHTS: ConfidenceWeights = {
    retrieval: 0.5,
    consistency: 0.3,
    coverage: 0.2,
};

/**
 * Phrases that indicate the LLM couldn't find the answer in the document.
 * If the response contains any of these, confidence MUST be forced to LOW.
 */
const UNCERTAINTY_PHRASES = [
    // Direct "don't have" variations - THE MOST COMMON PATTERN
    "i don't have that information",
    "i do not have that information",
    "i don't have this information",
    "i do not have this information",
    "don't have the information",
    "do not have the information",
    "i don't have the answer",
    "i do not have the answer",
    "don't have that data",
    "do not have that data",

    // Cannot find/access variations
    "i cannot find",
    "i can't find",
    "cannot provide",
    "can't provide",
    "unable to find",
    "unable to provide",
    "unable to determine",
    "unable to locate",

    // Not in document variations
    "not mentioned in the document",
    "not mentioned in the context",
    "not mentioned in the text",
    "not specified in the document",
    "not specified in the context",
    "not provided in the document",
    "not available in the document",
    "not found in the document",
    "not included in the document",
    "not stated in the document",
    "not covered in the document",
    "not present in the document",
    "not contained in the document",

    // Document doesn't contain variations
    "the document does not specify",
    "the document does not provide",
    "the document does not contain",
    "the document does not mention",
    "the document does not include",
    "the document doesn't specify",
    "the document doesn't provide",
    "the document doesn't contain",
    "the document doesn't mention",
    "the document doesn't include",
    "the context does not",
    "the context doesn't",

    // Generic "no information" patterns
    "this information is not",
    "that information is not",
    "no specific information",
    "no information about",
    "no information on",
    "no information regarding",
    "no mention of",
    "no data on",
    "no data about",
    "no details about",
    "no details on",
    "no specific details",
    "no exact",
    "no precise",

    // Cannot determine variations
    "cannot be determined",
    "can't be determined",
    "cannot determine",
    "can't determine",
    "not possible to determine",

    // Hedging / external source needed
    "would require external",
    "would need additional",
    "would need access to",
    "based on general knowledge",
    "outside the scope of",
    "beyond the scope of",
    "not within the scope",
    "not within the provided",

    // Explicit uncertainty
    "i'm not sure",
    "i am not sure",
    "i'm uncertain",
    "i am uncertain",
    "it's unclear",
    "it is unclear",
    "there is no clear",
    "there's no clear",
    "doesn't specify",
    "does not specify",
    "doesn't provide",
    "does not provide",

    // Negative existence statements
    "there is no",
    "there are no",
    "there isn't",
    "there aren't",
];

/**
 * Check if a response indicates uncertainty or missing information
 */
export function detectUncertaintyInResponse(response: string): {
    isUncertain: boolean;
    matchedPhrase: string | null;
} {
    const lowerResponse = response.toLowerCase();

    for (const phrase of UNCERTAINTY_PHRASES) {
        if (lowerResponse.includes(phrase)) {
            return { isUncertain: true, matchedPhrase: phrase };
        }
    }

    return { isUncertain: false, matchedPhrase: null };
}

/**
 * Adjust confidence based on response content (GUARDRAIL)
 * 
 * This is the critical function that prevents high-confidence scores
 * on answers that actually indicate the document doesn't contain
 * the requested information.
 * 
 * RULE: If the response indicates uncertainty, force confidence to LOW
 */
export function adjustConfidenceFromResponse(
    metrics: ConfidenceMetrics,
    response: string
): ConfidenceMetrics {
    const { isUncertain, matchedPhrase } = detectUncertaintyInResponse(response);

    if (isUncertain) {
        // GUARDRAIL TRIGGERED: Force confidence to LOW
        return {
            ...metrics,
            overallConfidence: Math.min(metrics.overallConfidence, 0.35), // Cap at 35%
            level: "low",
            explanation: `Answer indicates missing information ("${matchedPhrase?.substring(0, 30)}..."). Confidence forced to LOW.`,
            guardrailTriggered: true,
        };
    }

    return {
        ...metrics,
        guardrailTriggered: false,
    };
}

/**
 * Compute confidence metrics for a RAG response (retrieval-based only)
 * 
 * NOTE: This computes raw confidence from retrieval. For final confidence,
 * you should also call adjustConfidenceFromResponse() with the LLM output.
 */
export function computeConfidence(
    query: string,
    retrievedChunks: DocumentChunk[],
    weights: ConfidenceWeights = DEFAULT_WEIGHTS
): ConfidenceMetrics {
    // Handle edge case: no chunks retrieved
    if (retrievedChunks.length === 0) {
        return {
            retrievalConfidence: 0,
            consistencyConfidence: 0,
            coverageConfidence: 0,
            overallConfidence: 0,
            level: "low",
            explanation: "No relevant content found in the document.",
            guardrailTriggered: false,
        };
    }

    // 1. Retrieval Confidence: Mean of similarity scores
    const similarities = retrievedChunks.map(c => c.similarity ?? 0);
    const retrievalConfidence = mean(similarities);

    // 2. Consistency Confidence: Based on coefficient of variation (lower variance = higher confidence)
    const consistencyConfidence = computeConsistencyScore(similarities);

    // 3. Coverage Confidence: Query term overlap with retrieved chunks
    const coverageConfidence = computeCoverageScore(query, retrievedChunks);

    // Compute weighted overall score
    const overallConfidence =
        weights.retrieval * retrievalConfidence +
        weights.consistency * consistencyConfidence +
        weights.coverage * coverageConfidence;

    // Determine confidence level and explanation
    const { level, explanation } = interpretConfidence(
        overallConfidence,
        retrievalConfidence,
        consistencyConfidence,
        coverageConfidence
    );

    return {
        retrievalConfidence: round(retrievalConfidence, 3),
        consistencyConfidence: round(consistencyConfidence, 3),
        coverageConfidence: round(coverageConfidence, 3),
        overallConfidence: round(overallConfidence, 3),
        level,
        explanation,
        guardrailTriggered: false,
    };
}

/**
 * Compute consistency score based on similarity variance
 * Lower variance in similarities = higher consistency = more confidence
 */
function computeConsistencyScore(similarities: number[]): number {
    if (similarities.length <= 1) return 1; // Single chunk = perfectly consistent

    const avg = mean(similarities);
    if (avg === 0) return 0;

    // Coefficient of variation (std / mean)
    const variance = similarities.reduce((sum, s) => sum + Math.pow(s - avg, 2), 0) / similarities.length;
    const std = Math.sqrt(variance);
    const cv = std / avg;

    // Convert CV to confidence: lower CV = higher confidence
    // CV typically ranges from 0 to 1 for similarity scores
    // We clamp and invert: 1 - cv (bounded to [0, 1])
    return Math.max(0, Math.min(1, 1 - cv));
}

/**
 * Compute coverage score based on query term presence in chunks
 */
function computeCoverageScore(query: string, chunks: DocumentChunk[]): number {
    // Extract meaningful query terms (lowercase, no stopwords, min length 3)
    const stopwords = new Set([
        "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
        "have", "has", "had", "do", "does", "did", "will", "would", "could",
        "should", "may", "might", "must", "shall", "can", "need", "dare",
        "what", "which", "who", "whom", "whose", "where", "when", "why", "how",
        "this", "that", "these", "those", "it", "its", "and", "or", "but",
        "if", "then", "else", "for", "of", "to", "from", "in", "on", "at",
        "by", "with", "about", "into", "through", "during", "before", "after",
        "above", "below", "between", "under", "again", "further", "once",
    ]);

    const queryTerms = query
        .toLowerCase()
        .replace(/[^\w\s]/g, " ")
        .split(/\s+/)
        .filter(term => term.length >= 3 && !stopwords.has(term));

    if (queryTerms.length === 0) return 1; // No meaningful terms = assume full coverage

    // Combine all chunk text
    const combinedContext = chunks.map(c => c.text.toLowerCase()).join(" ");

    // Count how many query terms appear in context
    const foundTerms = queryTerms.filter(term => combinedContext.includes(term));

    return foundTerms.length / queryTerms.length;
}

/**
 * Interpret confidence score into human-readable level and explanation
 */
function interpretConfidence(
    overall: number,
    retrieval: number,
    consistency: number,
    coverage: number
): { level: "high" | "medium" | "low"; explanation: string } {
    // Determine level based on overall score
    let level: "high" | "medium" | "low";
    if (overall >= 0.7) {
        level = "high";
    } else if (overall >= 0.4) {
        level = "medium";
    } else {
        level = "low";
    }

    // Generate explanation based on individual metrics
    const explanationParts: string[] = [];

    if (retrieval >= 0.6) {
        explanationParts.push("Strong semantic match found");
    } else if (retrieval >= 0.4) {
        explanationParts.push("Moderate relevance detected");
    } else {
        explanationParts.push("Weak relevance to query");
    }

    if (consistency < 0.5) {
        explanationParts.push("retrieved content varies in relevance");
    }

    if (coverage < 0.5) {
        explanationParts.push("some query terms not found in context");
    }

    return {
        level,
        explanation: explanationParts.join("; ") + ".",
    };
}

// Utility functions
function mean(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
}

function round(value: number, decimals: number): number {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
}

/**
 * Format confidence for display in UI
 */
export function formatConfidenceForUI(metrics: ConfidenceMetrics): {
    badge: string;
    color: string;
    tooltip: string;
} {
    const levelConfig = {
        high: { badge: "High Confidence", color: "green" },
        medium: { badge: "Medium Confidence", color: "yellow" },
        low: { badge: "Low Confidence", color: "red" },
    };

    const config = levelConfig[metrics.level];

    let tooltip = `${metrics.explanation} (Score: ${(metrics.overallConfidence * 100).toFixed(0)}%)`;
    if (metrics.guardrailTriggered) {
        tooltip = `⚠️ ${tooltip}`;
    }

    return {
        badge: config.badge,
        color: config.color,
        tooltip,
    };
}

