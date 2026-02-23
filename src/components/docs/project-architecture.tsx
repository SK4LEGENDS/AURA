"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    Layout,
    Terminal,
    Cpu,
    Database,
    Search,
    Zap,
    Shield,
    Globe,
    ExternalLink,
    Box,
    MessageSquare,
    Layers
} from "lucide-react";

export function ProjectArchitecture() {
    const layers = [
        {
            name: "Client Surface",
            color: "border-blue-500/30",
            glow: "bg-blue-500/10",
            icon: Layout,
            items: [
                { title: "Next.js 14", icon: Globe, color: "text-blue-400" },
                { title: "Framer Motion", icon: Zap, color: "text-cyan-400" },
                { title: "React Context", icon: Layers, color: "text-sky-400" }
            ]
        },
        {
            name: "Orchestration API",
            color: "border-brand-primary/30",
            glow: "bg-brand-primary/10",
            icon: Terminal,
            items: [
                { title: "Node.js Routes", icon: Box, color: "text-brand-primary" },
                { title: "Auth SDK", icon: Shield, color: "text-indigo-400" },
                { title: "Event Stream", icon: MessageSquare, color: "text-amber-400" }
            ]
        },
        {
            name: "Intelligence Core",
            color: "border-emerald-500/30",
            glow: "bg-emerald-500/10",
            icon: Cpu,
            items: [
                { title: "RAG Pipeline", icon: Search, color: "text-emerald-400" },
                { title: "Ollama Local AI", icon: Cpu, color: "text-teal-400" },
                { title: "Inference Engine", icon: Zap, color: "text-green-400" }
            ]
        },
        {
            name: "Persistence Tier",
            color: "border-orange-500/30",
            glow: "bg-orange-500/10",
            icon: Database,
            items: [
                { title: "Firestore", icon: Database, color: "text-orange-400" },
                { title: "Vector Store", icon: ExternalLink, color: "text-red-400" },
                { title: "File Storage", icon: Box, color: "text-amber-400" }
            ]
        }
    ];

    return (
        <div className="space-y-12 py-8">
            <div className="grid grid-cols-1 gap-8 relative">
                {/* Vertical connecting line */}
                <div className="absolute left-[31px] top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/20 via-brand-primary/20 via-emerald-500/20 to-orange-500/20 hidden md:block" />

                {layers.map((layer, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.15 }}
                        className="relative pl-0 md:pl-16"
                    >
                        {/* Layer Indicator */}
                        <div className="absolute left-0 top-0 hidden md:flex w-16 h-16 items-center justify-center">
                            <div className={`w-8 h-8 rounded-full ${layer.color} border bg-zinc-950 flex items-center justify-center z-20`}>
                                <div className={`w-2 h-2 rounded-full ${layer.glow.replace('bg-', 'bg-')} animate-pulse`} />
                            </div>
                        </div>

                        <div className={`p-6 rounded-2xl border ${layer.color} bg-black/40 backdrop-blur-md relative overflow-hidden group hover:bg-black/60 transition-all`}>
                            {/* Visual Glow */}
                            <div className={`absolute -right-20 -top-20 w-64 h-64 ${layer.glow} blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity`} />

                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl bg-white/5 border border-white/10`}>
                                        <layer.icon className={`w-6 h-6 text-white`} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white tracking-tight">{layer.name}</h3>
                                        <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Tier 0{idx + 1}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {layer.items.map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5 group/item hover:border-white/10 transition-colors">
                                        <item.icon className={`w-4 h-4 ${item.color}`} />
                                        <span className="text-sm font-medium text-zinc-300">{item.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Connection to next layer (arrow) */}
                        {idx < layers.length - 1 && (
                            <div className="flex justify-center md:justify-start md:pl-12 my-4">
                                <motion.div
                                    animate={{ y: [0, 5, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="text-zinc-700"
                                >
                                    <Zap className="w-4 h-4 text-brand-primary/40" />
                                </motion.div>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
