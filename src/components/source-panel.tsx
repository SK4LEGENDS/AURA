"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MessageReference } from "@/types/chat";
import { X, FileText, ExternalLink, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface SourcePanelProps {
    isOpen: boolean;
    onClose: () => void;
    references: MessageReference[];
    activeIndex: number | null;
    onSourceClick?: (index: number) => void;
}

/**
 * Panel that displays source documents/chunks used in the response
 */
export function SourcePanel({ isOpen, onClose, references, activeIndex, onSourceClick }: SourcePanelProps) {
    const scrollRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        if (activeIndex !== null && scrollRefs.current[activeIndex]) {
            scrollRefs.current[activeIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [activeIndex]);

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-96 border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col h-full shadow-2xl z-20"
        >
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-500" />
                    <h2 className="font-semibold text-lg dark:text-white">Source Evidence</h2>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                >
                    <X className="w-5 h-5 dark:text-zinc-400" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {references.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-zinc-500 p-8">
                        <Info className="w-12 h-12 mb-4 opacity-20" />
                        <p>No cited sources for this response.</p>
                    </div>
                ) : (
                    references.map((ref, idx) => {
                        const isHighlighted = activeIndex === idx + 1;
                        return (
                            <div
                                key={idx}
                                ref={(el) => { scrollRefs.current[idx + 1] = el; }}
                                className={cn(
                                    "p-4 rounded-xl border transition-all duration-300",
                                    isHighlighted
                                        ? "bg-blue-50 border-blue-200 ring-2 ring-blue-500/20 dark:bg-blue-500/10 dark:border-blue-500/30"
                                        : "bg-zinc-50 border-zinc-200 hover:border-zinc-300 dark:bg-zinc-800/50 dark:border-zinc-700 dark:hover:border-zinc-600"
                                )}
                                onClick={() => onSourceClick?.(idx + 1)}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <div className={cn(
                                        "w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold border",
                                        isHighlighted
                                            ? "bg-blue-500 text-white border-blue-600"
                                            : "bg-zinc-200 text-zinc-600 border-zinc-300 dark:bg-zinc-700 dark:text-zinc-300 dark:border-zinc-600"
                                    )}>
                                        {idx + 1}
                                    </div>
                                    <span className="text-xs font-medium dark:text-zinc-300 truncate">
                                        {ref.source}
                                    </span>
                                    {ref.similarity && (
                                        <span className="ml-auto text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded">
                                            {(ref.similarity * 100).toFixed(0)}% Match
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed italic">
                                    "{ref.snippet}"
                                </p>
                                <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-700 flex justify-end">
                                    <button className="text-xs text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1">
                                        Open Original <ExternalLink className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                <p className="text-[10px] text-zinc-500 text-center">
                    Citations are automatically generated based on retrieved semantic chunks from the knowledge base.
                </p>
            </div>
        </motion.div>
    );
}
