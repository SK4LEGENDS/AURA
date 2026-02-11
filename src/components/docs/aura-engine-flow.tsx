"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, Cpu, Database, Zap } from "lucide-react";

export function AuraEngineFlow() {
    const stages = [
        { title: "Document Analysis", icon: Search, color: "text-blue-400", desc: "Raw file ingestion and structural parsing of unstructured data." },
        { title: "Contextual Encoding", icon: Cpu, color: "text-violet-400", desc: "Chunking logic and multi-dimensional vector metadata generation." },
        { title: "Semantic Retrieval", icon: Database, color: "text-emerald-400", desc: "Proprietary RAG pipeline identifying high-similarity proof snippets." },
        { title: "Resilient Generation", icon: Zap, color: "text-amber-400", desc: "Source-grounded synthesis with extreme hallucination guardrails." },
    ];

    return (
        <div className="relative">
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500/0 via-violet-500/20 to-violet-500/0 -translate-y-1/2" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                {stages.map((stage, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-zinc-900 border border-white/5 p-6 rounded-2xl relative group"
                    >
                        <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 ring-1 ring-white/10 group-hover:ring-white/20 transition-all`}>
                            <stage.icon className={`w-6 h-6 ${stage.color}`} />
                        </div>
                        <h4 className="text-white font-bold mb-2">{stage.title}</h4>
                        <p className="text-xs text-zinc-400 leading-relaxed">{stage.desc}</p>

                        {/* Connection node */}
                        <div className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full bg-zinc-950 border border-white/10 z-20">
                            <div className="absolute inset-1 rounded-full bg-violet-500/20 animate-pulse" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
