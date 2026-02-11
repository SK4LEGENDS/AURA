"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const comparisonData = [
    { feature: "Data Privacy", aura: "Isolated & Encrypted", generic: "Data used for training" },
    { feature: "Source Grounding", aura: "100% Verifiable Citations", generic: "Black-box Hallucinations" },
    { feature: "Deployment", aura: "Local / On-Prem / Cloud", generic: "Cloud Only" },
    { feature: "File Support", aura: "PDF, Docx, Excel, URLs", generic: "Limited Text Input" },
];

export function ComparisonSection() {
    return (
        <section className="py-24 bg-black relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px]" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold mb-6"
                    >
                        Why Aura?
                    </motion.h2>
                    <p className="text-zinc-400 max-w-2xl mx-auto">
                        See how Aura stacks up against generic AI chat tools.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden border border-white/10 bg-zinc-900/50 backdrop-blur-sm">
                    <div className="grid grid-cols-3 p-6 border-b border-white/10 bg-white/5">
                        <div className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Feature</div>
                        <div className="text-lg font-bold text-white text-center">Aura</div>
                        <div className="text-lg font-bold text-zinc-500 text-center">Generic AI</div>
                    </div>

                    {comparisonData.map((row, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="grid grid-cols-3 p-6 border-b border-white/5 hover:bg-white/5 transition-colors items-center"
                        >
                            <div className="font-semibold text-zinc-300">{row.feature}</div>
                            <div className="text-center flex items-center justify-center gap-2 text-purple-400 font-medium bg-purple-500/10 py-1 px-3 rounded-full mx-auto w-fit">
                                <Check className="w-4 h-4" />
                                {row.aura}
                            </div>
                            <div className="text-center flex items-center justify-center gap-2 text-zinc-500">
                                {row.generic.includes("Cloud") || row.generic.includes("Training") || row.generic.includes("Hallucinations") ? <X className="w-4 h-4 text-red-900" /> : null}
                                {row.generic}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
