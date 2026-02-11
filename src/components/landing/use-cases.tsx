"use client";

import { motion } from "framer-motion";
import { Scale, Microscope, LayoutTemplate, Network } from "lucide-react";

const cases = [
    {
        icon: <Microscope className="w-6 h-6" />,
        title: "R&D Teams",
        desc: "Accelerate literature review. Query across thousands of technical papers to find novel connections.",
        bg: "bg-blue-500/10",
        text: "text-blue-400",
    },
    {
        icon: <Scale className="w-6 h-6" />,
        title: "Legal Counsel",
        desc: "Review contracts and compliance documents. Instantly locate liability clauses and risky terms.",
        bg: "bg-yellow-500/10",
        text: "text-yellow-400",
    },
    {
        icon: <LayoutTemplate className="w-6 h-6" />,
        title: "Product Management",
        desc: "Synthesize user feedback and PRDs. Generate feature specs based on historical data.",
        bg: "bg-purple-500/10",
        text: "text-purple-400",
    },
    {
        icon: <Network className="w-6 h-6" />,
        title: "Internal Knowledge",
        desc: "A unified search for your company wiki, HR policies, and onboarding materials.",
        bg: "bg-green-500/10",
        text: "text-green-400",
    },
];

export function UseCases() {
    return (
        <section className="py-24 bg-black">
            <div className="container mx-auto px-6">
                <div className="mb-16">
                    <h2 className="text-3xl font-bold mb-4">Real-World Applications</h2>
                    <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cases.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="group relative p-8 rounded-3xl bg-zinc-900 border border-white/5 overflow-hidden hover:bg-zinc-800/50 transition-all"
                        >
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.bg.replace('/10', '/5')} blur-3xl rounded-full -mr-16 -mt-16`} />

                            <div className={`relative z-10 w-12 h-12 rounded-2xl ${item.bg} ${item.text} flex items-center justify-center mb-6`}>
                                {item.icon}
                            </div>

                            <h3 className="text-xl font-bold mb-3 relative z-10">{item.title}</h3>
                            <p className="text-zinc-400 leading-relaxed relative z-10 group-hover:text-zinc-300 transition-colors">
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
