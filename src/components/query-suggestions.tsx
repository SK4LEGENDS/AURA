"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, X, ArrowRight } from "lucide-react";
import { analyzeQuery, needsReformulation, QueryAnalysis } from "@/lib/query-analyzer";
import { cn } from "@/lib/utils";

interface QuerySuggestionsProps {
    query: string;
    onSuggestionClick: (suggestion: string) => void;
    onDismiss: () => void;
}

/**
 * Shows query reformulation suggestions when input is ambiguous
 */
export function QuerySuggestions({ query, onSuggestionClick, onDismiss }: QuerySuggestionsProps) {
    const [analysis, setAnalysis] = useState<QueryAnalysis | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (query.length < 5) {
            setIsVisible(false);
            return;
        }

        // Debounce analysis
        const timer = setTimeout(() => {
            const result = analyzeQuery(query);
            setAnalysis(result);
            setIsVisible(needsReformulation(result) && result.suggestedReformulations.length > 0);
        }, 500);

        return () => clearTimeout(timer);
    }, [query]);

    if (!isVisible || !analysis) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: 10, height: 0 }}
                className="mb-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20"
            >
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 text-amber-400">
                        <Lightbulb className="w-4 h-4" />
                        <span className="text-xs font-medium">
                            {analysis.ambiguityReason || "Try a more specific question"}
                        </span>
                    </div>
                    <button
                        onClick={() => {
                            setIsVisible(false);
                            onDismiss();
                        }}
                        className="text-amber-400/60 hover:text-amber-400"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="mt-2 space-y-1.5">
                    {analysis.suggestedReformulations.map((suggestion, idx) => (
                        <button
                            key={idx}
                            onClick={() => onSuggestionClick(suggestion)}
                            className={cn(
                                "w-full text-left px-3 py-2 rounded-md text-xs",
                                "bg-zinc-800 hover:bg-zinc-700 transition-colors",
                                "text-zinc-300 hover:text-white",
                                "flex items-center justify-between gap-2"
                            )}
                        >
                            <span>"{suggestion}"</span>
                            <ArrowRight className="w-3 h-3 opacity-50" />
                        </button>
                    ))}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

/**
 * Inline hint that appears below the input
 */
export function QueryHint({ query }: { query: string }) {
    const [hint, setHint] = useState<string | null>(null);

    useEffect(() => {
        if (query.length < 3) {
            setHint(null);
            return;
        }

        const timer = setTimeout(() => {
            const analysis = analyzeQuery(query);
            if (analysis.isAmbiguous && analysis.ambiguityReason) {
                setHint(analysis.ambiguityReason);
            } else {
                setHint(null);
            }
        }, 800);

        return () => clearTimeout(timer);
    }, [query]);

    if (!hint) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-amber-400/70 mt-1 flex items-center gap-1"
        >
            <Lightbulb className="w-3 h-3" />
            {hint}
        </motion.div>
    );
}
