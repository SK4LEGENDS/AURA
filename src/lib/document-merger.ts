/**
 * Document Merger Module
 * 
 * Handles multi-document RAG:
 * - Combines chunks from multiple sources
 * - Tracks source document provenance
 * - Detects conflicting information
 */

import { DocumentChunk } from "./embeddings";

export interface MultiDocumentSource {
    id: string;
    name: string;
    type: "upload" | "url";
    uploadedAt: string;
    chunkCount: number;
}

export interface MultiDocChunk extends DocumentChunk {
    sourceId: string;
    sourceName: string;
}

export interface ConflictInfo {
    detected: boolean;
    conflicts: Array<{
        topic: string;
        sourceA: { id: string; name: string; claim: string };
        sourceB: { id: string; name: string; claim: string };
    }>;
}

/**
 * Merge chunks from multiple document sources
 */
export function mergeDocumentChunks(
    sources: Map<string, DocumentChunk[]>,
    sourceMetadata: Map<string, MultiDocumentSource>
): MultiDocChunk[] {
    const merged: MultiDocChunk[] = [];
    let globalIndex = 0;

    for (const [sourceId, chunks] of sources) {
        const metadata = sourceMetadata.get(sourceId);
        const sourceName = metadata?.name || sourceId;

        for (const chunk of chunks) {
            merged.push({
                ...chunk,
                id: `${sourceId}_${chunk.chunkIndex}`,
                chunkIndex: globalIndex++,
                sourceId,
                sourceName,
            });
        }
    }

    return merged;
}

/**
 * Add source attribution to context for LLM
 */
export function buildMultiSourceContext(
    chunks: MultiDocChunk[],
    maxChunks: number = 10
): string {
    const selected = chunks.slice(0, maxChunks);

    return selected
        .map((chunk, idx) =>
            `[${idx + 1}] (Source: ${chunk.sourceName})\n${chunk.text}`
        )
        .join("\n\n");
}

/**
 * Group chunks by source document
 */
export function groupBySource(chunks: MultiDocChunk[]): Map<string, MultiDocChunk[]> {
    const groups = new Map<string, MultiDocChunk[]>();

    for (const chunk of chunks) {
        const existing = groups.get(chunk.sourceId) || [];
        existing.push(chunk);
        groups.set(chunk.sourceId, existing);
    }

    return groups;
}

/**
 * Detect potential conflicts between sources
 * Uses simple keyword overlap and semantic comparison
 */
export function detectConflicts(
    chunks: MultiDocChunk[],
    topicKeywords: string[]
): ConflictInfo {
    const conflicts: ConflictInfo["conflicts"] = [];
    const groupedBySource = groupBySource(chunks);
    const sources = Array.from(groupedBySource.keys());

    // Compare chunks from different sources
    for (let i = 0; i < sources.length; i++) {
        for (let j = i + 1; j < sources.length; j++) {
            const chunksA = groupedBySource.get(sources[i]) || [];
            const chunksB = groupedBySource.get(sources[j]) || [];

            // Check for conflicting numbers on same topic
            for (const chunkA of chunksA) {
                for (const chunkB of chunksB) {
                    const conflict = findConflictingClaims(chunkA, chunkB, topicKeywords);
                    if (conflict) {
                        conflicts.push(conflict);
                    }
                }
            }
        }
    }

    return {
        detected: conflicts.length > 0,
        conflicts: conflicts.slice(0, 5), // Limit to top 5 conflicts
    };
}

function findConflictingClaims(
    chunkA: MultiDocChunk,
    chunkB: MultiDocChunk,
    topicKeywords: string[]
): ConflictInfo["conflicts"][0] | null {
    // Check if both chunks mention the same topic
    const textA = chunkA.text.toLowerCase();
    const textB = chunkB.text.toLowerCase();

    const sharedTopics = topicKeywords.filter(
        keyword => textA.includes(keyword.toLowerCase()) && textB.includes(keyword.toLowerCase())
    );

    if (sharedTopics.length === 0) return null;

    // Extract numbers from both texts
    const numbersA = extractNumbers(chunkA.text);
    const numbersB = extractNumbers(chunkB.text);

    // Check for conflicting numbers on the same topic
    if (numbersA.length > 0 && numbersB.length > 0) {
        // Simple heuristic: if both have numbers and they're different by >10%, might be conflict
        for (const numA of numbersA) {
            for (const numB of numbersB) {
                if (numA > 0 && numB > 0 && Math.abs(numA - numB) / numA > 0.1) {
                    return {
                        topic: sharedTopics[0],
                        sourceA: {
                            id: chunkA.sourceId,
                            name: chunkA.sourceName,
                            claim: extractClaimAroundNumber(chunkA.text, numA),
                        },
                        sourceB: {
                            id: chunkB.sourceId,
                            name: chunkB.sourceName,
                            claim: extractClaimAroundNumber(chunkB.text, numB),
                        },
                    };
                }
            }
        }
    }

    return null;
}

function extractNumbers(text: string): number[] {
    const matches = text.match(/[\d,]+(?:\.\d+)?/g);
    if (!matches) return [];

    return matches
        .map(m => parseFloat(m.replace(/,/g, "")))
        .filter(n => !isNaN(n) && n > 0);
}

function extractClaimAroundNumber(text: string, num: number): string {
    const numStr = num.toString();
    const index = text.indexOf(numStr);
    if (index === -1) return text.substring(0, 100) + "...";

    const start = Math.max(0, index - 50);
    const end = Math.min(text.length, index + numStr.length + 50);
    return "..." + text.substring(start, end) + "...";
}

/**
 * Format conflict warning for display
 */
export function formatConflictWarning(conflict: ConflictInfo["conflicts"][0]): string {
    return `⚠️ Potential conflict on "${conflict.topic}":\n` +
        `- ${conflict.sourceA.name}: "${conflict.sourceA.claim}"\n` +
        `- ${conflict.sourceB.name}: "${conflict.sourceB.claim}"`;
}
