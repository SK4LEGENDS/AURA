/**
 * Adaptive Chunking Module
 * 
 * Content-aware chunking that preserves semantic units:
 * - Tables are kept as single chunks
 * - Lists are kept together
 * - Headers create natural chunk boundaries
 * - Code blocks stay intact
 */

import { detectStructure, StructureBlock, shouldKeepTogether, getMinChunkSize } from "./structure-detector";

export interface ChunkConfig {
    targetSize: number;        // Target chunk size in characters
    maxSize: number;           // Maximum chunk size
    minSize: number;           // Minimum chunk size
    overlap: number;           // Overlap between chunks
    preserveStructure: boolean; // Whether to respect structure boundaries
}

export const DEFAULT_CHUNK_CONFIG: ChunkConfig = {
    targetSize: 1000,
    maxSize: 2000,
    minSize: 200,
    overlap: 100,
    preserveStructure: true,
};

export interface AdaptiveChunk {
    text: string;
    startIndex: number;
    endIndex: number;
    structureType: string;
    chunkIndex: number;
}

/**
 * Split text into adaptive chunks that respect document structure
 */
export function adaptiveChunk(
    text: string,
    config: ChunkConfig = DEFAULT_CHUNK_CONFIG
): AdaptiveChunk[] {
    if (!config.preserveStructure) {
        // Fall back to simple fixed-size chunking
        return fixedSizeChunk(text, config);
    }

    const structures = detectStructure(text);
    const chunks: AdaptiveChunk[] = [];
    let chunkIndex = 0;
    let currentChunk = "";
    let currentStart = 0;
    let currentType = "mixed";

    for (const block of structures) {
        // If block must stay together (table, code, list)
        if (shouldKeepTogether(block)) {
            // Flush current chunk if exists
            if (currentChunk.trim()) {
                chunks.push({
                    text: currentChunk.trim(),
                    startIndex: currentStart,
                    endIndex: block.startIndex,
                    structureType: currentType,
                    chunkIndex: chunkIndex++,
                });
                currentChunk = "";
            }

            // Add block as its own chunk
            chunks.push({
                text: block.content,
                startIndex: block.startIndex,
                endIndex: block.endIndex,
                structureType: block.type,
                chunkIndex: chunkIndex++,
            });
            currentStart = block.endIndex;
            currentType = "mixed";
            continue;
        }

        // For headers, consider starting a new chunk
        if (block.type === "header") {
            // If current chunk is large enough, flush it
            if (currentChunk.length >= config.minSize) {
                chunks.push({
                    text: currentChunk.trim(),
                    startIndex: currentStart,
                    endIndex: block.startIndex,
                    structureType: currentType,
                    chunkIndex: chunkIndex++,
                });
                currentChunk = "";
                currentStart = block.startIndex;
            }
            currentChunk += `\n\n## ${block.content}\n\n`;
            currentType = "section";
            continue;
        }

        // Regular content - accumulate
        const potentialChunk = currentChunk + block.content + "\n\n";

        // If adding this would exceed max size, flush first
        if (potentialChunk.length > config.maxSize && currentChunk.length >= config.minSize) {
            chunks.push({
                text: currentChunk.trim(),
                startIndex: currentStart,
                endIndex: block.startIndex,
                structureType: currentType,
                chunkIndex: chunkIndex++,
            });
            currentChunk = block.content + "\n\n";
            currentStart = block.startIndex;
        } else {
            currentChunk = potentialChunk;
        }

        // If we've reached target size, consider splitting
        if (currentChunk.length >= config.targetSize) {
            // Look for a good split point (sentence boundary)
            const splitPoint = findSplitPoint(currentChunk, config.targetSize);
            if (splitPoint > config.minSize) {
                const part1 = currentChunk.substring(0, splitPoint);
                const part2 = currentChunk.substring(splitPoint);

                chunks.push({
                    text: part1.trim(),
                    startIndex: currentStart,
                    endIndex: currentStart + splitPoint,
                    structureType: currentType,
                    chunkIndex: chunkIndex++,
                });

                // Add overlap
                const overlapStart = Math.max(0, splitPoint - config.overlap);
                currentChunk = currentChunk.substring(overlapStart);
                currentStart = currentStart + overlapStart;
            }
        }
    }

    // Flush remaining content
    if (currentChunk.trim()) {
        chunks.push({
            text: currentChunk.trim(),
            startIndex: currentStart,
            endIndex: text.length,
            structureType: currentType,
            chunkIndex: chunkIndex++,
        });
    }

    return chunks;
}

/**
 * Find a good split point (sentence boundary) near target position
 */
function findSplitPoint(text: string, target: number): number {
    // Look for sentence endings near the target
    const searchStart = Math.max(0, target - 200);
    const searchEnd = Math.min(text.length, target + 200);
    const searchRange = text.substring(searchStart, searchEnd);

    // Find sentence boundaries
    const sentenceEnders = ['. ', '! ', '? ', '.\n', '!\n', '?\n'];
    let bestSplit = -1;
    let bestDistance = Infinity;

    for (const ender of sentenceEnders) {
        let pos = 0;
        while ((pos = searchRange.indexOf(ender, pos)) !== -1) {
            const absolutePos = searchStart + pos + ender.length;
            const distance = Math.abs(absolutePos - target);
            if (distance < bestDistance) {
                bestDistance = distance;
                bestSplit = absolutePos;
            }
            pos++;
        }
    }

    return bestSplit > 0 ? bestSplit : target;
}

/**
 * Simple fixed-size chunking (fallback)
 */
function fixedSizeChunk(text: string, config: ChunkConfig): AdaptiveChunk[] {
    const chunks: AdaptiveChunk[] = [];
    let start = 0;
    let chunkIndex = 0;

    while (start < text.length) {
        const end = Math.min(start + config.targetSize, text.length);
        const splitPoint = end < text.length ? findSplitPoint(text.substring(0, end), config.targetSize) : end;

        chunks.push({
            text: text.substring(start, splitPoint).trim(),
            startIndex: start,
            endIndex: splitPoint,
            structureType: "paragraph",
            chunkIndex: chunkIndex++,
        });

        start = splitPoint - config.overlap;
        if (start >= text.length - config.minSize) {
            break;
        }
    }

    return chunks;
}

/**
 * Get chunking statistics
 */
export function getChunkStats(chunks: AdaptiveChunk[]): {
    count: number;
    avgSize: number;
    minSize: number;
    maxSize: number;
    structureBreakdown: Record<string, number>;
} {
    if (chunks.length === 0) {
        return { count: 0, avgSize: 0, minSize: 0, maxSize: 0, structureBreakdown: {} };
    }

    const sizes = chunks.map(c => c.text.length);
    const structureBreakdown: Record<string, number> = {};

    for (const chunk of chunks) {
        structureBreakdown[chunk.structureType] = (structureBreakdown[chunk.structureType] || 0) + 1;
    }

    return {
        count: chunks.length,
        avgSize: Math.round(sizes.reduce((a, b) => a + b, 0) / sizes.length),
        minSize: Math.min(...sizes),
        maxSize: Math.max(...sizes),
        structureBreakdown,
    };
}
