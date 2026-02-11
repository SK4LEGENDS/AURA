"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, FileText, BarChart3, Info, Copy, ThumbsUp, ThumbsDown, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function RealitySlider() {
    const [sliderPos, setSliderPos] = useState(50);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);

    const handleMove = (clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        setSliderPos((x / rect.width) * 100);
    };

    const onMouseDown = () => { isDragging.current = true; };
    const onMouseUp = () => { isDragging.current = false; };
    const onMouseMove = (e: React.MouseEvent) => { if (isDragging.current) handleMove(e.clientX); };
    const onTouchMove = (e: React.TouchEvent) => { if (isDragging.current) handleMove(e.touches[0].clientX); };

    useEffect(() => {
        window.addEventListener("mouseup", onMouseUp);
        window.addEventListener("touchend", onMouseUp);
        return () => {
            window.removeEventListener("mouseup", onMouseUp);
            window.removeEventListener("touchend", onMouseUp);
        };
    }, []);

    const Citation = ({ children }: { children: React.ReactNode }) => (
        <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-500/20 text-blue-400 rounded text-[10px] font-bold border border-blue-500/30 mx-1 transition-transform cursor-pointer hover:scale-110">
            {children}
        </span>
    );

    return (
        <section className="py-24 bg-black overflow-hidden select-none">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tighter">
                        Hallucination vs. <span className="text-emerald-400">Reality</span>
                    </h2>
                    <p className="text-zinc-400 max-w-2xl mx-auto">
                        Drag the slider to see how Aura's source-grounded intelligence compares to standard black-box AI models.
                    </p>
                </div>

                <div
                    ref={containerRef}
                    className="relative max-w-5xl mx-auto aspect-[16/9] md:aspect-[21/9] rounded-3xl border border-white/10 overflow-hidden cursor-ew-resize"
                    onMouseDown={onMouseDown}
                    onMouseMove={onMouseMove}
                    onTouchStart={onMouseDown}
                    onTouchMove={onTouchMove}
                >
                    {/* Left Side: Generic AI */}
                    <div className="absolute inset-0 bg-zinc-950 p-8 md:p-12 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-6 text-red-500/50">
                            <AlertCircle className="w-6 h-6" />
                            <span className="font-bold uppercase tracking-widest text-xs">Generic LLM (Offline)</span>
                        </div>
                        <div className="max-w-xl">
                            <h3 className="text-xl md:text-2xl font-bold text-zinc-500 mb-4 italic">
                                "How does Aura handle multi-agent orchestration?"
                            </h3>
                            <p className="text-lg md:text-xl text-zinc-600 leading-relaxed font-serif">
                                "Aura uses a basic sequential chain. It's likely built on the <span className="bg-red-500/10 px-1 text-red-400\">Sequential-GPT v1 API</span>. Multi-agent parallel execution isn't supported in local environments..."
                            </p>
                        </div>

                        {/* Fake "Loading" UI */}
                        <div className="mt-8 flex gap-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-2 w-16 bg-zinc-900 rounded-full" />
                            ))}
                        </div>
                    </div>

                    {/* Right Side: AURA (Clipped) */}
                    <div
                        className="absolute inset-0 bg-zinc-900 p-8 md:p-12 flex flex-col justify-center translate-z-0 pointer-events-none"
                        style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
                    >
                        {/* Background glow for AURA side */}
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-purple-500/10 opacity-30" />

                        <div className="relative z-10 w-full h-full flex flex-col justify-center">
                            <div className="flex items-center gap-3 mb-6 text-emerald-400">
                                <CheckCircle2 className="w-6 h-6" />
                                <span className="font-bold uppercase tracking-widest text-xs">AURA Intelligence (Verified)</span>
                            </div>

                            <div className="max-w-3xl">
                                <h3 className="text-lg md:text-xl font-bold text-white mb-4">
                                    "How does Aura handle multi-agent orchestration?"
                                </h3>
                                <p className="text-base md:text-lg text-zinc-200 leading-relaxed">
                                    Based on the orchestration manifest in chunk <Citation>7</Citation>: Aura implements a decentralized swarm architecture. The Supervisor Agent <Citation>1</Citation> decomposes tasks into atomic units, while the Worker Agents <Citation>2</Citation> execute in parallel with state synchronization <Citation>3</Citation>. Real-time conflict resolution is handled via the Consensus Layer (see chunks 7,9).
                                </p>
                            </div>

                            {/* Actions and Badge Layer */}
                            <div className="mt-6 space-y-4">
                                <div className="flex items-center gap-4 text-zinc-500">
                                    <Copy className="w-4 h-4 hover:text-white transition-colors cursor-pointer" />
                                    <ThumbsUp className="w-4 h-4 hover:text-white transition-colors cursor-pointer" />
                                    <ThumbsDown className="w-4 h-4 hover:text-white transition-colors cursor-pointer" />
                                </div>
                                <div className="h-px w-full bg-white/5" />
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-tight">High Confidence</span>
                                        <Info className="w-3 h-3 text-emerald-500/50" />
                                    </div>

                                    <div />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Slider Line & Handle */}
                    <div
                        className="absolute top-0 bottom-0 w-px bg-white/30 z-20 pointer-events-none"
                        style={{ left: `${sliderPos}%` }}
                    >
                        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.5)] cursor-ew-resize">
                            <div className="flex gap-1">
                                <div className="w-0.5 h-4 bg-black/20 rounded-full" />
                                <div className="w-0.5 h-4 bg-black/20 rounded-full" />
                            </div>
                        </div>

                        {/* Floating Labels */}
                        <div className="absolute top-8 -translate-x-full pr-4 text-[10px] font-black uppercase tracking-widest text-white/50 whitespace-nowrap">Hallucination</div>
                        <div className="absolute top-8 pl-4 text-[10px] font-black uppercase tracking-widest text-emerald-400 whitespace-nowrap">Reality</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
