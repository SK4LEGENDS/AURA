/**
 * Structure Detector Module
 * 
 * Analyzes document content to identify structural elements like:
 * - Tables
 * - Lists (ordered/unordered)
 * - Headers/Sections
 * - Code blocks
 * - Paragraphs
 */

export type StructureType =
    | "header"
    | "paragraph"
    | "table"
    | "list"
    | "code"
    | "quote"
    | "unknown";

export interface StructureBlock {
    type: StructureType;
    content: string;
    startIndex: number;
    endIndex: number;
    level?: number;        // For headers (h1, h2, etc.)
    metadata?: Record<string, any>;
}

/**
 * Detect structural elements in text content
 */
export function detectStructure(text: string): StructureBlock[] {
    const blocks: StructureBlock[] = [];
    const lines = text.split('\n');
    let currentIndex = 0;
    let currentBlock: Partial<StructureBlock> | null = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmedLine = line.trim();
        const lineStart = currentIndex;
        const lineEnd = currentIndex + line.length;

        // Detect headers (Markdown style)
        const headerMatch = trimmedLine.match(/^(#{1,6})\s+(.+)/);
        if (headerMatch) {
            if (currentBlock) {
                blocks.push(finalizeBlock(currentBlock));
            }
            blocks.push({
                type: "header",
                content: headerMatch[2],
                startIndex: lineStart,
                endIndex: lineEnd,
                level: headerMatch[1].length,
            });
            currentBlock = null;
            currentIndex = lineEnd + 1;
            continue;
        }

        // Detect tables (pipe-separated)
        if (trimmedLine.includes('|') && trimmedLine.split('|').length >= 3) {
            if (currentBlock && currentBlock.type !== "table") {
                blocks.push(finalizeBlock(currentBlock));
                currentBlock = null;
            }
            if (!currentBlock) {
                currentBlock = {
                    type: "table",
                    content: "",
                    startIndex: lineStart,
                };
            }
            currentBlock.content += line + '\n';
            currentBlock.endIndex = lineEnd;
            currentIndex = lineEnd + 1;
            continue;
        }

        // Detect lists (bullet or numbered)
        const listMatch = trimmedLine.match(/^[-*•]\s+|^\d+[.)]\s+/);
        if (listMatch) {
            if (currentBlock && currentBlock.type !== "list") {
                blocks.push(finalizeBlock(currentBlock));
                currentBlock = null;
            }
            if (!currentBlock) {
                currentBlock = {
                    type: "list",
                    content: "",
                    startIndex: lineStart,
                };
            }
            currentBlock.content += line + '\n';
            currentBlock.endIndex = lineEnd;
            currentIndex = lineEnd + 1;
            continue;
        }

        // Detect code blocks
        if (trimmedLine.startsWith('```')) {
            if (currentBlock && currentBlock.type !== "code") {
                blocks.push(finalizeBlock(currentBlock));
                currentBlock = null;
            }
            if (!currentBlock) {
                currentBlock = {
                    type: "code",
                    content: "",
                    startIndex: lineStart,
                };
            } else if (currentBlock.type === "code") {
                currentBlock.content += line + '\n';
                currentBlock.endIndex = lineEnd;
                blocks.push(finalizeBlock(currentBlock));
                currentBlock = null;
            }
            currentIndex = lineEnd + 1;
            continue;
        }

        // Detect quotes
        if (trimmedLine.startsWith('>')) {
            if (currentBlock && currentBlock.type !== "quote") {
                blocks.push(finalizeBlock(currentBlock));
                currentBlock = null;
            }
            if (!currentBlock) {
                currentBlock = {
                    type: "quote",
                    content: "",
                    startIndex: lineStart,
                };
            }
            currentBlock.content += trimmedLine.substring(1).trim() + '\n';
            currentBlock.endIndex = lineEnd;
            currentIndex = lineEnd + 1;
            continue;
        }

        // Empty line - end current block
        if (trimmedLine === "") {
            if (currentBlock) {
                blocks.push(finalizeBlock(currentBlock));
                currentBlock = null;
            }
            currentIndex = lineEnd + 1;
            continue;
        }

        // Regular paragraph
        if (!currentBlock) {
            currentBlock = {
                type: "paragraph",
                content: "",
                startIndex: lineStart,
            };
        }
        if (currentBlock.type === "paragraph") {
            currentBlock.content += line + ' ';
            currentBlock.endIndex = lineEnd;
        } else {
            blocks.push(finalizeBlock(currentBlock));
            currentBlock = {
                type: "paragraph",
                content: line + ' ',
                startIndex: lineStart,
                endIndex: lineEnd,
            };
        }

        currentIndex = lineEnd + 1;
    }

    // Finalize last block
    if (currentBlock) {
        blocks.push(finalizeBlock(currentBlock));
    }

    return blocks;
}

function finalizeBlock(block: Partial<StructureBlock>): StructureBlock {
    return {
        type: block.type || "unknown",
        content: (block.content || "").trim(),
        startIndex: block.startIndex || 0,
        endIndex: block.endIndex || 0,
        level: block.level,
        metadata: block.metadata,
    };
}

/**
 * Check if a block should be kept together (not split during chunking)
 */
export function shouldKeepTogether(block: StructureBlock): boolean {
    return block.type === "table" ||
        block.type === "code" ||
        block.type === "list";
}

/**
 * Get recommended minimum chunk size based on structure type
 */
export function getMinChunkSize(type: StructureType): number {
    switch (type) {
        case "table": return 2000;  // Tables should be larger to stay complete
        case "code": return 1500;
        case "list": return 800;
        case "header": return 100;
        case "quote": return 300;
        default: return 500;
    }
}
