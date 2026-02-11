"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageReference } from "@/types/chat";
import { splitTextWithCitations, TextSegment } from "@/lib/citation-parser";
import { cn } from "@/lib/utils";
import { ExternalLink, FileText } from "lucide-react";

interface CitationHighlightProps {
    text: string;
    references: MessageReference[];
    onCitationClick?: (citationIndex: number, reference: MessageReference) => void;
}

/**
 * Renders text with clickable inline citations
 * Citations like [1], [2] are highlighted and show source on hover/click
 */
export function CitationHighlight({ text, references, onCitationClick }: CitationHighlightProps) {
    const [activePopover, setActivePopover] = useState<number | null>(null);
    const segments = splitTextWithCitations(text);

    const getReference = (citationIndex: number): MessageReference | null => {
        // Citations are 1-based, array is 0-based
        const index = citationIndex - 1;
        if (index >= 0 && index < references.length) {
            return references[index];
        }
        return null;
    };

    return (
        <span className="citation-text">
            {segments.map((segment, idx) => {
                if (segment.type === 'text') {
                    return <span key={idx}>{segment.content}</span>;
                }

                // Citation segment
                const citationIndex = segment.citationIndex!;
                const reference = getReference(citationIndex);
                const isActive = activePopover === citationIndex;

                return (
                    <span key={idx} className="relative inline-block">
                        <button
                            className={cn(
                                "inline-flex items-center justify-center px-1 py-0.5 mx-0.5 text-xs font-semibold rounded transition-all",
                                "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30",
                                "border border-blue-500/30",
                                isActive && "ring-2 ring-blue-400 ring-offset-1 ring-offset-transparent"
                            )}
                            onClick={() => {
                                setActivePopover(isActive ? null : citationIndex);
                                if (reference && onCitationClick) {
                                    onCitationClick(citationIndex, reference);
                                }
                            }}
                            onMouseEnter={() => setActivePopover(citationIndex)}
                            onMouseLeave={() => setActivePopover(null)}
                        >
                            {segment.content}
                        </button>

                        {/* Popover showing source snippet */}
                        <AnimatePresence>
                            {isActive && reference && (
                                <motion.div
                                    initial={{ opacity: 0, y: 5, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    className={cn(
                                        "absolute z-[100] w-72 p-3 rounded-lg shadow-xl",
                                        "bg-zinc-800 border border-zinc-700",
                                        "left-0 bottom-full mb-2"
                                    )}
                                    onMouseEnter={() => setActivePopover(citationIndex)}
                                    onMouseLeave={() => setActivePopover(null)}
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <FileText className="w-4 h-4 text-blue-400" />
                                        <span className="text-xs font-semibold text-white">
                                            Source [{citationIndex}]
                                        </span>
                                        {reference.similarity && (
                                            <span className="ml-auto text-xs text-zinc-400">
                                                {(reference.similarity * 100).toFixed(0)}% match
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-zinc-300 leading-relaxed line-clamp-4">
                                        "{reference.snippet}"
                                    </p>

                                    {/* Arrow pointing down */}
                                    <div className="absolute left-4 bottom-0 translate-y-full w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-zinc-700"></div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </span>
                );
            })}
        </span>
    );
}

/**
 * Simple version that just highlights citations without popovers
 */
export function CitationHighlightSimple({ text }: { text: string }) {
    const segments = splitTextWithCitations(text);

    return (
        <span>
            {segments.map((segment, idx) => {
                if (segment.type === 'text') {
                    return <span key={idx}>{segment.content}</span>;
                }

                return (
                    <span
                        key={idx}
                        className="inline-flex items-center justify-center px-1 py-0.5 mx-0.5 text-xs font-semibold rounded bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    >
                        {segment.content}
                    </span>
                );
            })}
        </span>
    );
}
