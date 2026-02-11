/**
 * Citation Parser Module
 * 
 * Parses inline citations [1], [2] from LLM responses and maps them
 * to the corresponding reference chunks for highlighting.
 */

export interface ParsedCitation {
    index: number;           // The citation number (1-based)
    startPos: number;        // Start position in original text
    endPos: number;          // End position in original text
    text: string;            // The citation text (e.g., "[1]")
}

export interface CitationMapping {
    citations: ParsedCitation[];
    textWithoutCitations: string;
    citationToChunkMap: Map<number, string>; // Maps citation # to chunk ID
}

/**
 * Extract all citations from a response text
 * Matches patterns like [1], [2], [1][2], etc.
 */
export function extractCitations(text: string): ParsedCitation[] {
    const citations: ParsedCitation[] = [];
    const regex = /\[(\d+)\]/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
        citations.push({
            index: parseInt(match[1], 10),
            startPos: match.index,
            endPos: match.index + match[0].length,
            text: match[0],
        });
    }

    return citations;
}

/**
 * Parse response and create citation mapping
 */
export function parseCitations(
    responseText: string,
    chunkIds: string[]
): CitationMapping {
    const citations = extractCitations(responseText);

    // Create mapping from citation numbers to chunk IDs
    const citationToChunkMap = new Map<number, string>();
    for (const citation of citations) {
        // Citations are 1-based, array is 0-based
        const chunkIndex = citation.index - 1;
        if (chunkIndex >= 0 && chunkIndex < chunkIds.length) {
            citationToChunkMap.set(citation.index, chunkIds[chunkIndex]);
        }
    }

    // Remove citations from text for clean display (optional)
    const textWithoutCitations = responseText.replace(/\[\d+\]/g, '').replace(/\s+/g, ' ').trim();

    return {
        citations,
        textWithoutCitations,
        citationToChunkMap,
    };
}

/**
 * Get unique citation numbers from a response
 */
export function getUniqueCitationNumbers(text: string): number[] {
    const citations = extractCitations(text);
    const unique = [...new Set(citations.map(c => c.index))];
    return unique.sort((a, b) => a - b);
}

/**
 * Check if a response contains any citations
 */
export function hasCitations(text: string): boolean {
    return /\[\d+\]/.test(text);
}

/**
 * Split text into segments with citation metadata
 * Useful for rendering text with clickable citations
 */
export interface TextSegment {
    type: 'text' | 'citation';
    content: string;
    citationIndex?: number;
}

export function splitTextWithCitations(text: string): TextSegment[] {
    const segments: TextSegment[] = [];
    const regex = /\[(\d+)\]/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
        // Add text before citation
        if (match.index > lastIndex) {
            segments.push({
                type: 'text',
                content: text.substring(lastIndex, match.index),
            });
        }

        // Add citation
        segments.push({
            type: 'citation',
            content: match[0],
            citationIndex: parseInt(match[1], 10),
        });

        lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
        segments.push({
            type: 'text',
            content: text.substring(lastIndex),
        });
    }

    return segments;
}

/**
 * Format citation for display with superscript style
 */
export function formatCitationDisplay(citationIndex: number): string {
    return `[${citationIndex}]`;
}
