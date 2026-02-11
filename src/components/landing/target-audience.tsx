"use client";

import { motion } from "framer-motion";
import { Code, Scale, Database, Building2 } from "lucide-react";

const personas = [
    {
        icon: <Code className="w-8 h-8 text-blue-400" />,
        title: "Developers",
        description: "Integrate RAG capabilities with a few lines of code. Type-safe SDKs and comprehensive documentation.",
    },
    {
        icon: <Database className="w-8 h-8 text-purple-400" />,
        title: "Research Teams",
        description: "Process thousands of papers instantly. Extract citations, summaries, and cross-references automatically.",
    },
    {
        icon: <Scale className="w-8 h-8 text-yellow-400" />,
        title: "Legal & Compliance",
        description: "Audit-ready logs and strict data isolation. Ensure sensitive documents never leave your secure environment.",
    },
    {
        icon: <Building2 className="w-8 h-8 text-green-400" />,
        title: "Enterprises",
        description: "Role-based access control (RBAC), SSO integration, and on-premise deployment options.",
    },
];

export function TargetAudience() {
    return (
        <section className="py-24 bg-zinc-950">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500"
                    >
                        Who Aura Is Built For
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-zinc-400 max-w-2xl mx-auto text-lg"
                    >
                        Tailored for professionals who demand precision, security, and scalability.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {personas.map((persona, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-white/10 transition-colors"
                        >
                            <div className="mb-4 bg-zinc-800/50 w-14 h-14 rounded-xl flex items-center justify-center">
                                {persona.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{persona.title}</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed">{persona.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
