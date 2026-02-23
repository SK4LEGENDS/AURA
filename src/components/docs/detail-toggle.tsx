"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Code2 } from "lucide-react";

interface DetailToggleProps {
    title?: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

export function DetailToggle({
    title = "Technical Deep Dive",
    children,
    defaultOpen = false
}: DetailToggleProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border border-white/5 bg-white/5 rounded-2xl overflow-hidden transition-all hover:border-white/10">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-6 py-4 flex items-center justify-between text-left group"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-primary/10 rounded-lg group-hover:bg-brand-primary/20 transition-colors">
                        <Code2 className="w-4 h-4 text-brand-primary" />
                    </div>
                    <span className="font-bold text-sm text-zinc-300 group-hover:text-white transition-colors uppercase tracking-widest">
                        {title}
                    </span>
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <ChevronDown className="w-5 h-5 text-zinc-500" />
                </motion.div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                    >
                        <div className="px-6 pb-6 pt-2 border-t border-white/5">
                            <div className="text-sm text-zinc-400 leading-relaxed font-mono bg-black/40 p-4 rounded-xl border border-white/5">
                                {children}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
