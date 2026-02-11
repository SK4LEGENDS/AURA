"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    ShieldCheck,
    Layers,
    PieChart,
    Download,
    Smartphone,
    Table,
    Zap,
    Search,
    Lock
} from "lucide-react";
import { cn } from "@/lib/utils";

const BentoCard = ({
    className,
    title,
    description,
    icon,
    children,
    index
}: {
    className?: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    children?: React.ReactNode;
    index: number;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className={cn(
            "group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/50 p-8 backdrop-blur-xl transition-all hover:border-white/20 hover:bg-zinc-900",
            className
        )}
    >
        <div className="relative z-10 flex h-full flex-col">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10 transition-all group-hover:bg-purple-500/10 group-hover:ring-purple-500/20">
                {icon}
            </div>
            <div>
                <h3 className="mb-2 text-xl font-bold text-white group-hover:text-purple-400 transition-colors uppercase tracking-tight">
                    {title}
                </h3>
                <p className="max-w-[280px] text-sm leading-relaxed text-zinc-400">
                    {description}
                </p>
            </div>

            <div className="mt-6 flex-grow">
                {children}
            </div>
        </div>

        {/* Background Gradients */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-purple-500/5 blur-[100px] transition-opacity group-hover:opacity-100" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-500/5 blur-[100px] transition-opacity group-hover:opacity-100" />
    </motion.div>
);

export function BentoFeatures() {
    return (
        <section className="py-24 bg-black">
            <div className="container mx-auto px-6">
                <div className="mb-16 max-w-2xl">
                    <h2 className="text-sm font-bold tracking-widest text-purple-500 uppercase mb-4">
                        Capabilities
                    </h2>
                    <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tighter">
                        Engineered for High-Stakes <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">Intelligence.</span>
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-3 gap-6 h-auto md:h-[900px]">
                    {/* 1. Large: Visualization Engine */}
                    <BentoCard
                        index={0}
                        className="md:col-span-2 md:row-span-1"
                        icon={<PieChart className="w-6 h-6 text-purple-400" />}
                        title="Level 4 Visual Resillience"
                        description="Ultra-robust chart rendering that survives malformed AI JSON. Supports 9+ interactive chart types."
                    >
                        <div className="absolute right-0 bottom-0 w-1/2 h-full hidden lg:flex items-center justify-center p-6 translate-y-4">
                            {/* Mini Mockup of charts */}
                            <div className="relative w-full aspect-square bg-white/5 rounded-2xl border border-white/10 p-4 transform rotate-6 hover:rotate-0 transition-transform duration-500">
                                <div className="space-y-3">
                                    <div className="h-2 w-1/2 bg-white/20 rounded-full" />
                                    <div className="flex items-end gap-1 h-24">
                                        <div className="w-1/4 h-[40%] bg-purple-500/40 rounded-t" />
                                        <div className="w-1/4 h-[70%] bg-blue-500/40 rounded-t" />
                                        <div className="w-1/4 h-[100%] bg-purple-500/60 rounded-t" />
                                        <div className="w-1/4 h-[60%] bg-blue-500/60 rounded-t" />
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="w-2 h-2 rounded-full bg-purple-400" />
                                        <div className="w-2 h-2 rounded-full bg-blue-400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </BentoCard>

                    {/* 2. Privacy Check */}
                    <BentoCard
                        index={1}
                        className="md:col-span-1 md:row-span-1"
                        icon={<Lock className="w-6 h-6 text-emerald-400" />}
                        title="Zero-Cloud Privacy"
                        description="Embeddings and inference stay local. Your private documents never leave your infrastructure."
                    >
                        <div className="mt-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 self-start">
                            <ShieldCheck className="w-3 h-3 text-emerald-400" />
                            <span className="text-[10px] font-bold text-emerald-400 uppercase">LOCAL OLLAMA SYNCED</span>
                        </div>
                    </BentoCard>

                    {/* 3. Source Grounded */}
                    <BentoCard
                        index={2}
                        className="md:col-span-1 md:row-span-1"
                        icon={<Search className="w-6 h-6 text-blue-400" />}
                        title="Semantic Traceability"
                        description="Zero hallucinations. Every answer is linked back to a high-fidelity source chunk with infinite scroll-to-view."
                    >
                        <div className="mt-4 relative h-32 overflow-hidden rounded-xl bg-black/20 border border-white/5 p-3">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded bg-blue-500/20 flex items-center justify-center text-[10px] text-blue-400 font-bold border border-blue-500/30">[1]</div>
                                    <div className="h-2 w-2/3 bg-white/10 rounded-full" />
                                </div>
                                <div className="pl-6 space-y-1.5 border-l border-blue-500/20">
                                    <div className="h-1.5 w-full bg-white/5 rounded-full" />
                                    <div className="h-1.5 w-4/5 bg-white/5 rounded-full" />
                                    <div className="h-1.5 w-full bg-blue-500/5 rounded-full" />
                                </div>
                            </div>
                            {/* Connection Line */}
                            <motion.div
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center"
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <span className="text-[10px] text-blue-400 font-mono italic">REF</span>
                            </motion.div>
                        </div>
                    </BentoCard>

                    {/* 4. Large (XLSX/Structured) */}
                    <BentoCard
                        index={3}
                        className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-zinc-900 to-indigo-900/20"
                        icon={<Table className="w-6 h-6 text-cyan-400" />}
                        title="Structured Data Mastery"
                        description="Specialized Excel & CSV processing that maintains header context across thousands of rows. Advanced row-level semantic preservation ensures no data loss during chunking."
                    >
                        <div className="mt-8 space-y-6">
                            {/* Step 1: Raw Data Layer */}
                            <div className="relative">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Raw Cells (CSV/XLSX)</span>
                                    <div className="flex gap-1">
                                        <div className="w-1 h-1 rounded-full bg-cyan-500 animate-pulse" />
                                        <div className="w-1 h-1 rounded-full bg-cyan-500 animate-pulse delay-75" />
                                        <div className="w-1 h-1 rounded-full bg-cyan-500 animate-pulse delay-150" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 gap-2 opacity-30">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="h-4 rounded bg-white/10 border border-white/5" />
                                    ))}
                                </div>
                            </div>

                            {/* Step 2: Transformation Engine */}
                            <div className="relative py-4">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
                                </div>
                                <div className="relative z-10 flex justify-center">
                                    <div className="bg-zinc-900 border border-cyan-500/30 px-4 py-1.5 rounded-full flex items-center gap-3 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                                        <Zap className="w-3 h-3 text-cyan-400 animate-pulse" />
                                        <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-tighter">Vectorizing with Header Context</span>
                                    </div>
                                </div>
                            </div>

                            {/* Step 3: Semantic Output Layer */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Contextual Vectors</span>
                                    <span className="text-[9px] text-cyan-500/60 font-mono">dim: 768</span>
                                </div>
                                <div className="bg-black/40 rounded-xl border border-white/5 p-3 font-mono text-[9px] text-cyan-500/80 space-y-2 relative overflow-hidden">
                                    <div className="flex gap-2 items-center">
                                        <div className="w-2 h-2 rounded bg-cyan-500/20 border border-cyan-500/40" />
                                        <div className="flex-1 h-1.5 bg-cyan-500/10 rounded-full relative overflow-hidden">
                                            <motion.div
                                                className="absolute inset-0 bg-cyan-500/30"
                                                animate={{ x: ["-100%", "100%"] }}
                                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                            />
                                        </div>
                                    </div>
                                    <div className="text-[8px] opacity-40 leading-none">
                                        [0.12, -0.45, 0.88, 0.23, -0.01, 0.67, ...]
                                    </div>
                                    <div className="text-[8px] opacity-40 leading-none">
                                        {"chunk_id: \"row_504\", context: \"Financials_2023\""}
                                    </div>
                                </div>
                            </div>

                            {/* Footer Status */}
                            <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    <span className="text-[8px] font-bold text-zinc-600 uppercase">Integrity Check Passed</span>
                                </div>
                                <span className="text-[8px] font-mono text-zinc-700">SHA-256: 0x4F...E8</span>
                            </div>
                        </div>
                    </BentoCard>

                    {/* 5. Mini Export */}
                    <BentoCard
                        index={4}
                        className="md:col-span-1 md:row-span-1"
                        icon={<Download className="w-6 h-6 text-pink-400" />}
                        title="Professional Exports"
                        description="One-click export to high-res PNG, SVG, or vector PDF."
                    >
                        <div className="mt-4 grid grid-cols-2 gap-2 pb-2">
                            {['PNG', 'SVG', 'PDF', 'XLSX'].map((fmt, i) => (
                                <div key={fmt} className="bg-black/40 border border-white/5 rounded-lg p-2 flex items-center gap-2 group/fmt">
                                    <div className={cn(
                                        "w-1.5 h-1.5 rounded-full",
                                        i === 2 ? "bg-pink-500 animate-pulse" : "bg-zinc-700"
                                    )} />
                                    <span className="text-[9px] font-mono text-zinc-500 group-hover/fmt:text-white transition-colors">{fmt}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-2 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]"
                                initial={{ width: "30%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 3, repeat: Infinity }}
                            />
                        </div>
                    </BentoCard>
                </div>
            </div>
        </section>
    );
}
