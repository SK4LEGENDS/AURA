/**
 * Query Analyzer Module
 * 
 * Analyzes user queries to:
 * - Extract key entities and terms
 * - Detect query type (factual, comparative, analytical)
 * - Identify ambiguities
 * - Suggest reformulations
 */

export type QueryType =
    | "factual"       // Who, what, when, where
    | "comparative"   // Compare X vs Y
    | "analytical"    // Why, how, explain
    | "numerical"     // Specific numbers
    | "yes_no"        // Yes/no questions
    | "definition"    // Define, what is
    | "list"          // List, enumerate
    | "unknown";

export interface QueryAnalysis {
    originalQuery: string;
    queryType: QueryType;
    keyTerms: string[];
    entities: string[];
    isAmbiguous: boolean;
    ambiguityReason?: string;
    suggestedReformulations: string[];
    confidence: number;
}

/**
 * Analyze a user query
 */
export function analyzeQuery(query: string): QueryAnalysis {
    const lowerQuery = query.toLowerCase().trim();
    const words = lowerQuery.split(/\s+/);

    // Detect query type
    const queryType = detectQueryType(lowerQuery);

    // Extract key terms (excluding stop words)
    const keyTerms = extractKeyTerms(query);

    // Extract entities (capitalized words, numbers, dates)
    const entities = extractEntities(query);

    // Check for ambiguity
    const { isAmbiguous, reason } = checkAmbiguity(lowerQuery, keyTerms);

    // Generate suggestions
    const suggestions = generateSuggestions(query, queryType, keyTerms, isAmbiguous);

    return {
        originalQuery: query,
        queryType,
        keyTerms,
        entities,
        isAmbiguous,
        ambiguityReason: reason,
        suggestedReformulations: suggestions,
        confidence: isAmbiguous ? 0.5 : 0.85,
    };
}

function detectQueryType(query: string): QueryType {
    // Yes/No questions
    if (/^(is|are|was|were|do|does|did|can|could|will|would|should|has|have|had)\s/i.test(query)) {
        return "yes_no";
    }

    // Definition questions
    if (/^(what is|what are|define|definition of|meaning of)/i.test(query)) {
        return "definition";
    }

    // Comparative questions
    if (/compare|versus|vs\.?|difference between|better than|worse than|more than|less than/i.test(query)) {
        return "comparative";
    }

    // List questions
    if (/^(list|enumerate|name all|what are the|give me all)/i.test(query)) {
        return "list";
    }

    // Numerical questions
    if (/how much|how many|total|count|sum|average|percentage|%|\$|number of/i.test(query)) {
        return "numerical";
    }

    // Analytical questions
    if (/^(why|how|explain|describe|analyze)/i.test(query)) {
        return "analytical";
    }

    // Factual questions
    if (/^(who|what|when|where|which)/i.test(query)) {
        return "factual";
    }

    return "unknown";
}

function extractKeyTerms(query: string): string[] {
    const stopWords = new Set([
        "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
        "have", "has", "had", "do", "does", "did", "will", "would", "could",
        "should", "may", "might", "must", "shall", "can", "need",
        "what", "which", "who", "whom", "whose", "where", "when", "why", "how",
        "this", "that", "these", "those", "it", "its", "and", "or", "but",
        "if", "then", "else", "for", "of", "to", "from", "in", "on", "at",
        "by", "with", "about", "me", "my", "your", "their", "our",
        "please", "thanks", "thank", "you", "i", "we", "they", "he", "she",
    ]);

    const words = query
        .toLowerCase()
        .replace(/[^\w\s]/g, " ")
        .split(/\s+/)
        .filter(word => word.length >= 3 && !stopWords.has(word));

    // Deduplicate while preserving order
    return [...new Set(words)];
}

function extractEntities(query: string): string[] {
    const entities: string[] = [];

    // Extract capitalized words (potential proper nouns)
    const capitalizedMatches = query.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*/g);
    if (capitalizedMatches) {
        entities.push(...capitalizedMatches);
    }

    // Extract numbers
    const numberMatches = query.match(/\$?\d+(?:,\d{3})*(?:\.\d+)?%?/g);
    if (numberMatches) {
        entities.push(...numberMatches);
    }

    // Extract dates
    const dateMatches = query.match(/\d{4}|\d{1,2}\/\d{1,2}(?:\/\d{2,4})?|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2}(?:,?\s+\d{4})?/gi);
    if (dateMatches) {
        entities.push(...dateMatches);
    }

    return [...new Set(entities)];
}

function checkAmbiguity(query: string, keyTerms: string[]): { isAmbiguous: boolean; reason?: string } {
    // Too few key terms
    if (keyTerms.length < 2) {
        return { isAmbiguous: true, reason: "Query may be too vague - consider adding more specific terms" };
    }

    // Pronouns without context
    if (/\b(it|they|this|that|those|these)\b/.test(query) && keyTerms.length < 3) {
        return { isAmbiguous: true, reason: "Query contains pronouns without clear referents" };
    }

    // Very short query
    if (query.split(/\s+/).length < 3) {
        return { isAmbiguous: true, reason: "Query is very short - consider elaborating" };
    }

    // Ambiguous time references
    if (/\b(recent|latest|current|last|next)\b/.test(query) && !/\d{4}/.test(query)) {
        return { isAmbiguous: true, reason: "Time reference is ambiguous - consider specifying a date or year" };
    }

    return { isAmbiguous: false };
}

function generateSuggestions(
    query: string,
    queryType: QueryType,
    keyTerms: string[],
    isAmbiguous: boolean
): string[] {
    const suggestions: string[] = [];

    if (!isAmbiguous) {
        return suggestions;
    }

    // Add specificity suggestions based on query type
    if (queryType === "numerical") {
        suggestions.push(`What was the exact ${keyTerms.slice(0, 2).join(" ")} in [specific year]?`);
    }

    if (queryType === "comparative") {
        suggestions.push(`How does ${keyTerms[0] || "X"} compare to ${keyTerms[1] || "Y"} in terms of [specific metric]?`);
    }

    if (queryType === "factual" && keyTerms.length > 0) {
        suggestions.push(`What is the ${keyTerms[0]} in the document?`);
        suggestions.push(`Where is ${keyTerms[0]} mentioned in the document?`);
    }

    if (queryType === "analytical") {
        suggestions.push(`Why did ${keyTerms.slice(0, 2).join(" ")} happen?`);
        suggestions.push(`How does ${keyTerms[0] || "this"} work according to the document?`);
    }

    // Generic improvements
    if (suggestions.length === 0) {
        suggestions.push(`Can you provide more details about ${keyTerms[0] || "your question"}?`);
    }

    return suggestions.slice(0, 3);
}

/**
 * Quick check if query might need reformulation
 */
export function needsReformulation(analysis: QueryAnalysis): boolean {
    return analysis.isAmbiguous || analysis.confidence < 0.6;
}
