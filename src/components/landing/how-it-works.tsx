"use client";

import { motion } from "framer-motion";
import { FileUp, Database, Search, MessageSquare, ArrowRight } from "lucide-react";

const steps = [
    { icon: <FileUp />, label: "Upload", desc: "PDFs, Docs, Encryption" },
    { icon: <Database />, label: "Vectorization", desc: "Chunking & Embeddings" },
    { icon: <Search />, label: "Retrieval", desc: "Semantic Search" },
    { icon: <MessageSquare />, label: "Visualize", desc: "Interactive Charts" },
];

export function HowItWorks() {
    return (
        <section className="py-24 bg-zinc-950 border-y border-white/5">
            <div className="container mx-auto px-6">
                <div className="text-center mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold mb-6"
                    >
                        Inside the Engine
                    </motion.h2>
                    <p className="text-zinc-400">High-performance RAG pipeline designed for accuracy.</p>
                </div>

                <div className="relative">
                    {/* Connecting Line */}
                    <div className="hidden md:block absolute top-[28px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-purple-500/0 via-purple-500/50 to-purple-500/0 z-0" />

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="flex flex-col items-center text-center"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-purple-500/30 flex items-center justify-center text-white mb-6 shadow-lg shadow-purple-900/20 z-10 relative">
                                    {step.icon}
                                    {index < steps.length - 1 && (
                                        <div className="md:hidden absolute -bottom-10 left-1/2 -translate-x-1/2 text-zinc-700">
                                            <ArrowRight className="rotate-90" />
                                        </div>
                                    )}
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{step.label}</h3>
                                <p className="text-zinc-500 text-sm">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
