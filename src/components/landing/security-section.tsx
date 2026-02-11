"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Lock, Server, FileKey } from "lucide-react";

const features = [
    {
        icon: <Lock className="w-6 h-6 text-emerald-400" />,
        title: "End-to-End Encryption",
        desc: "Your documents are encrypted at rest with AES-256 and in transit via TLS 1.3.",
    },
    {
        icon: <Server className="w-6 h-6 text-blue-400" />,
        title: "Local Deployment",
        desc: "Run Aura entirely on-premise. Your data never needs to touch the public cloud.",
    },
    {
        icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
        title: "Triple-Lock Data Integrity",
        desc: "Advanced recovery engine prevents malformed AI responses and ensures 100% data accuracy.",
    },
    {
        icon: <FileKey className="w-6 h-6 text-rose-400" />,
        title: "Session Isolation",
        desc: "Strict logical separation between user sessions prevents cross-contamination of context.",
    },
];

export function SecuritySection() {
    return (
        <section className="py-24 bg-zinc-950 relative">
            <div className="container mx-auto px-6">
                <div className="mb-16 md:text-center max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6"
                    >
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">Enterprise Grade Security</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold mb-6 text-white"
                    >
                        Security is not an afterlife. <br />
                        It's our DNA.
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                    {features.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="flex gap-5 p-6 rounded-2xl bg-zinc-900 border border-white/5 hover:border-emerald-500/20 transition-all group"
                        >
                            <div className="shrink-0 p-3 bg-zinc-950 rounded-lg border border-white/10 group-hover:border-emerald-500/30 transition-colors">
                                {item.icon}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                                <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
