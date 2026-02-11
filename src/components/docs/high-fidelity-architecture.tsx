"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    Globe,
    Palette,
    Feather,
    Database,
    Cpu,
    MessageSquare,
    Files,
    Flame,
    Terminal,
    Settings,
    Network,
    Layers,
    Shield,
    Zap,
    Play,
    Code,
    Activity,
    Lock
} from "lucide-react";

/**
 * Animated SVG Data Path with Sequential Pulse Support
 */
const DataPath = ({ className, d, color = "violet", duration = 3, active = true, reverse = false }: {
    className?: string;
    d: string;
    color?: "violet" | "blue" | "emerald" | "orange";
    duration?: number;
    active?: boolean;
    reverse?: boolean;
}) => {
    const glowColors = {
        violet: "#a78bfa",
        blue: "#60a5fa",
        emerald: "#34d399",
        orange: "#fb923c"
    };

    return (
        <svg className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} style={{ overflow: 'visible' }}>
            <path
                d={d}
                fill="none"
                stroke={active ? `${glowColors[color]}44` : "rgba(255,255,255,0.05)"}
                strokeWidth="1"
                strokeDasharray="4 4"
            />
            {active && (
                <motion.path
                    d={d}
                    fill="none"
                    stroke={glowColors[color]}
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0.1, pathOffset: reverse ? 1 : -0.1, opacity: 0 }}
                    animate={{
                        pathOffset: reverse ? -0.1 : 1,
                        opacity: [0, 1, 1, 0]
                    }}
                    transition={{
                        duration,
                        repeat: Infinity,
                        ease: "linear",
                        times: [0, 0.1, 0.9, 1]
                    }}
                    style={{ filter: `drop-shadow(0 0 4px ${glowColors[color]})` }}
                />
            )}
        </svg>
    );
};

/**
 * High-Intensity Cinematic Tracer for Simulation
 */
const SimulationTracer = ({ d, color = "violet", reverse = false }: {
    d: string;
    color?: "violet" | "blue" | "emerald" | "orange";
    reverse?: boolean;
}) => {
    const glowColors = {
        violet: "#a78bfa",
        blue: "#60a5fa",
        emerald: "#34d399",
        orange: "#fb923c"
    };

    return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-[100]" style={{ overflow: 'visible' }}>
            {/* Main high-intensity beam */}
            <motion.path
                d={d}
                fill="none"
                stroke={glowColors[color]}
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0.2, pathOffset: reverse ? 1.2 : -0.2, opacity: 0 }}
                animate={{
                    pathOffset: reverse ? -0.2 : 1.2,
                    opacity: [0, 1, 1, 0]
                }}
                transition={{
                    duration: 1.2,
                    ease: "easeInOut",
                    times: [0, 0.2, 0.8, 1]
                }}
                style={{
                    filter: `blur(1px) drop-shadow(0 0 12px ${glowColors[color]})`,
                    mixBlendMode: "screen"
                }}
            />
            {/* Particle head */}
            <motion.circle
                r="3"
                fill="white"
                style={{ filter: `drop-shadow(0 0 8px ${glowColors[color]})`, mixBlendMode: "plus-lighter" }}
            >
                <animateMotion
                    dur="1.2s"
                    repeatCount="none"
                    path={d}
                    keyPoints={reverse ? "1;0" : "0;1"}
                    keyTimes="0;1"
                    calcMode="spline"
                    keySplines="0.4 0 0.2 1"
                />
            </motion.circle>
        </svg>
    );
};

export function HighFidelityArchitecture() {
    const [isTechnical, setIsTechnical] = useState(false);
    const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);
    const [simulating, setSimulating] = useState(false);
    const [simStep, setSimStep] = useState(0);

    const simulationLogs = [
        "",
        "USER_REQUEST_INIT",
        "CLIENT_HANDSHAKE",
        "ROUTING_&_AUTH",
        "LLM_INFERENCE",
        "CONTEXT_SYNC",
        "DATA_PERSISTED",
        "STREAMING_SUCCESS"
    ];

    const TraceLog = ({ step, color = "blue", position = "right" }: { step: number, color?: string, position?: "left" | "right" | "top" | "bottom" }) => {
        if (!simulating || simStep !== step) return null;

        const posClasses = {
            right: "left-full ml-4 top-1/2 -translate-y-1/2",
            left: "right-full mr-4 top-1/2 -translate-y-1/2",
            top: "bottom-full mb-4 left-1/2 -translate-x-1/2",
            bottom: "top-full mt-4 left-1/2 -translate-x-1/2"
        };

        const colorClasses: Record<string, string> = {
            violet: "bg-violet-500/10 border-violet-500/20 text-violet-300",
            blue: "bg-blue-500/10 border-blue-500/20 text-blue-300",
            emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-300",
            orange: "bg-orange-500/10 border-orange-500/20 text-orange-300"
        };

        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`absolute ${posClasses[position]} z-[100] px-3 py-1 rounded border backdrop-blur-md whitespace-nowrap shadow-2xl ${colorClasses[color]}`}
            >
                <div className="text-[8px] font-mono font-bold tracking-widest uppercase">
                    {simulationLogs[step]}
                </div>
            </motion.div>
        );
    };

    const runSimulation = () => {
        if (simulating) return;
        setSimulating(true);
        setSimStep(1);
    };

    useEffect(() => {
        if (simulating) {
            const timer = setTimeout(() => {
                if (simStep < 7) {
                    setSimStep(prev => prev + 1);
                } else {
                    setTimeout(() => {
                        setSimulating(false);
                        setSimStep(0);
                    }, 1500); // Wait at final step
                }
            }, 1200); // Cinematic pace
            return () => clearTimeout(timer);
        }
    }, [simulating, simStep]);

    const blocks = {
        frontend: {
            title: isTechnical ? "Next.js 14 Client" : "Frontend Interface",
            tech: "App Router • RSC • Lucide",
            path: "src/app/page.tsx",
            color: "violet"
        },
        core: {
            title: isTechnical ? "Node.js Runtime" : "System Core",
            tech: "Edge Functions • Middleware",
            path: "src/app/api/chat/route.ts",
            color: "blue"
        },
        ai: {
            title: isTechnical ? "Ollama Inference" : "AI Engine",
            tech: "Llama 3.2 • Nomic Embed",
            path: "local:11434/api/generate",
            color: "emerald"
        },
        storage: {
            title: isTechnical ? "Firestore Admin" : "Cloud Storage",
            tech: "Firebase Auth • NoSQL",
            path: "project:aura-db/firestore",
            color: "orange"
        }
    };

    // Helper to determine if a block should be dimmed
    const isDimmed = (blockId: string) => {
        if (!simulating) return false;
        if (blockId === 'frontend' && (simStep === 2 || simStep === 7)) return false;
        if (blockId === 'core' && (simStep === 3 || simStep === 5)) return false;
        if (blockId === 'ai' && simStep === 4) return false;
        if (blockId === 'storage' && simStep === 6) return false;
        return true;
    };

    return (
        <div className="w-full py-8 px-6 bg-zinc-950/20 rounded-[2rem] border border-white/5 relative overflow-hidden backdrop-blur-3xl">
            {/* Control Bar */}
            <div className="absolute top-4 right-4 flex items-center gap-4 z-50">
                <button
                    onClick={runSimulation}
                    disabled={simulating}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all text-[10px] font-bold uppercase tracking-widest ${simulating ? 'bg-violet-500/20 border-violet-500/40 text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.3)]' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
                >
                    <Play className={`w-3 h-3 ${simulating ? 'animate-pulse' : ''}`} />
                    {simulating ? `TRACE ACTIVE: STEP ${simStep}` : "Trace Request"}
                </button>
                <div className="h-4 w-px bg-white/10" />
                <button
                    onClick={() => setIsTechnical(!isTechnical)}
                    className="flex items-center gap-2 bg-white/5 border border-white/10 text-white px-3 py-1.5 rounded-full hover:bg-white/10 transition-all text-[10px] font-bold uppercase tracking-wider relative group"
                >
                    <Code className="w-3 h-3 group-hover:rotate-12 transition-transform" />
                    {isTechnical ? "Conceptual View" : "Technical View"}
                </button>
            </div>

            {/* Background ambient glows */}
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-violet-600/5 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full pointer-events-none" />

            {/* Simulation Overlay - Vignette and Dimming */}
            <AnimatePresence>
                {simulating && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/40 z-10 pointer-events-none backdrop-blur-[1px]"
                    />
                )}
            </AnimatePresence>

            <div className="max-w-5xl mx-auto relative z-20 flex flex-col items-center">

                {/* 1. User Section */}
                <div className={`flex flex-col items-center mb-6 relative transition-opacity duration-500 ${simulating && simStep !== 1 ? 'opacity-30' : 'opacity-100'}`}>
                    <TraceLog step={1} color="violet" position="right" />
                    <motion.div
                        animate={simStep === 1 ? { scale: [1, 1.3, 1], filter: "brightness(1.8)" } : {}}
                        className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-white shadow-xl relative overflow-hidden group"
                    >
                        <User className="w-6 h-6 relative z-10" />
                        {simStep === 1 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0 bg-violet-500/40"
                            />
                        )}
                    </motion.div>
                    <span className="text-white text-[10px] font-bold mt-2 tracking-tight">User Session</span>

                    {/* Path from User to Client Surface */}
                    <div className="absolute top-full left-1/2 w-px h-6 pointer-events-none">
                        <DataPath d="M 0 0 v 24" active={!simulating} color="violet" duration={1.5} />
                        {simStep === 1 && simulating && <SimulationTracer d="M 0 0 v 24" color="violet" />}
                    </div>
                </div>

                {/* 2. Frontend Layer */}
                <div className={`w-full max-w-lg mb-12 relative transition-opacity duration-500 ${isDimmed('frontend') ? 'opacity-20' : 'opacity-100'}`}>
                    <TraceLog step={2} color="violet" position="right" />
                    <TraceLog step={7} color="violet" position="right" />
                    <motion.div
                        onMouseEnter={() => setHoveredBlock('frontend')}
                        onMouseLeave={() => setHoveredBlock(null)}
                        animate={simStep === 2 ? {
                            scale: [1, 1.02, 1],
                            boxShadow: "0 0 30px rgba(139, 92, 246, 0.4)"
                        } : {}}
                        className={`bg-white/[0.03] border rounded-xl p-5 shadow-xl backdrop-blur-md relative overflow-hidden transition-all duration-300 ${hoveredBlock === 'frontend' ? 'border-violet-500/40 bg-violet-500/[0.05]' : 'border-white/10'}`}
                    >
                        {/* Status Pulse for Simulation */}
                        <AnimatePresence>
                            {simStep === 2 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-violet-500/[0.05] pointer-events-none"
                                />
                            )}
                        </AnimatePresence>

                        {/* Scanning line for Client activity */}
                        <motion.div
                            animate={{ left: ["-100%", "200%"] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="absolute top-0 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-violet-400/50 to-transparent z-0"
                        />

                        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2 relative z-10">
                            <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4 text-violet-400" />
                                <h3 className="text-[11px] font-bold text-white uppercase tracking-wider">{blocks.frontend.title}</h3>
                            </div>
                            <span className="text-[9px] text-zinc-500 font-mono">CLIENT SURFACE</span>
                        </div>

                        <div className="grid grid-cols-3 gap-4 relative z-10">
                            {[
                                { icon: Layers, label: isTechnical ? "Components" : "UI Hub" },
                                { icon: Palette, label: "Aura Theme" },
                                { icon: Feather, label: "Lucide" },
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center gap-1.5 p-2 rounded-lg bg-black/20 border border-white/5">
                                    <item.icon className="w-4 h-4 text-zinc-400" />
                                    <span className="text-[9px] font-medium text-zinc-300">{item.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Deep Dive */}
                        <AnimatePresence>
                            {hoveredBlock === 'frontend' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute inset-0 bg-zinc-950/90 flex flex-col items-center justify-center p-4 text-center z-20"
                                >
                                    <Activity className="w-5 h-5 text-violet-400 mb-2" />
                                    <div className="text-[10px] font-bold text-white uppercase">{blocks.frontend.tech}</div>
                                    <div className="text-[8px] text-zinc-500 font-mono mt-1 opacity-60 underline">{blocks.frontend.path}</div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Animated Paths to Core */}
                    <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[326px] h-16 pointer-events-none">
                        <DataPath d="M 0 0 v 64" active={!simulating} color="violet" duration={2} />
                        <DataPath d="M 326 0 v 64" active={!simulating} color="blue" duration={2.5} />

                        {((simStep === 2 || simStep === 7) && simulating) && (
                            <>
                                {simStep === 2 && (
                                    <>
                                        <SimulationTracer d="M 0 0 v 64" color="violet" />
                                        <SimulationTracer d="M 326 0 v 64" color="blue" />
                                    </>
                                )}
                                {simStep === 7 && (
                                    <>
                                        <SimulationTracer d="M 0 0 v 64" color="violet" reverse />
                                        <SimulationTracer d="M 326 0 v 64" color="blue" reverse />
                                    </>
                                )}
                            </>
                        )}

                        <div className="absolute top-8 left-0 -translate-x-1/2 text-[7px] text-zinc-400 font-mono uppercase tracking-widest bg-black/40 px-1 rounded-sm">Queries</div>
                        <div className="absolute top-8 right-0 translate-x-1/2 text-[7px] text-zinc-400 font-mono uppercase tracking-widest bg-black/40 px-1 rounded-sm">Uploads</div>
                    </div>
                </div>

                {/* 3. Core Processing Row */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full items-center relative mt-2 px-4 z-10">

                    {/* Local AI */}
                    <div className={`md:col-span-3 relative flex flex-col items-center transition-opacity duration-500 ${isDimmed('ai') ? 'opacity-20' : 'opacity-100'}`}>
                        <TraceLog step={4} color="emerald" position="top" />
                        <motion.div
                            onMouseEnter={() => setHoveredBlock('ai')}
                            onMouseLeave={() => setHoveredBlock(null)}
                            animate={simStep === 4 ? {
                                scale: [1, 1.05, 1],
                                boxShadow: "0 0 40px rgba(16, 185, 129, 0.4)"
                            } : {}}
                            className={`w-full bg-white/5 border p-5 rounded-2xl h-full flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${hoveredBlock === 'ai' ? 'border-emerald-500/40 bg-emerald-500/[0.05]' : 'border-white/10'}`}
                        >
                            <motion.div
                                animate={{ top: ["0%", "100%", "0%"] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                className="absolute left-0 right-0 h-px bg-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.5)] z-0"
                            />

                            <div className="mb-4 relative z-10">
                                <Cpu className="w-5 h-5 text-emerald-400 mb-2" />
                                <h4 className="text-[11px] font-bold text-white uppercase tracking-tighter">{blocks.ai.title}</h4>
                                <span className="text-[9px] text-zinc-500 uppercase tracking-widest">PRIVATE INFERENCE</span>
                            </div>
                            <div className="space-y-2 relative z-10">
                                <div className="p-2 rounded-lg bg-black/40 border border-white/5 text-center">
                                    <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-tighter">Nemic Embed</span>
                                </div>
                                <div className="p-2 rounded-lg bg-black/40 border border-white/5 text-center">
                                    <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-tighter">LLama 3.2</span>
                                </div>
                            </div>

                            {/* Deep Dive */}
                            <AnimatePresence>
                                {hoveredBlock === 'ai' && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 bg-zinc-950/95 flex flex-col items-center justify-center p-3 text-center z-20"
                                    >
                                        <div className="text-[9px] font-bold text-emerald-400 uppercase">{blocks.ai.tech}</div>
                                        <div className="text-[7px] text-zinc-600 font-mono mt-2 truncate max-w-full">{blocks.ai.path}</div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>

                    {/* System Core */}
                    <div className={`md:col-span-6 relative flex flex-col items-center transition-opacity duration-500 ${isDimmed('core') ? 'opacity-20' : 'opacity-100'}`}>
                        <TraceLog step={3} color="blue" position="top" />
                        <TraceLog step={5} color="blue" position="top" />
                        <motion.div
                            onMouseEnter={() => setHoveredBlock('core')}
                            onMouseLeave={() => setHoveredBlock(null)}
                            animate={(simStep === 3 || simStep === 5) ? {
                                scale: [1, 1.02, 1],
                                boxShadow: "0 0 50px rgba(59, 130, 246, 0.5)"
                            } : {
                                scale: [1, 1.002, 1]
                            }}
                            transition={simStep === 0 ? { duration: 4, repeat: Infinity, ease: "easeInOut" } : {}}
                            className={`w-full bg-zinc-900 border rounded-2xl p-6 shadow-2xl h-full relative overflow-hidden transition-all duration-300 ${hoveredBlock === 'core' ? 'border-blue-500/40' : 'border-white/10'}`}
                        >
                            {/* More Visible Terminal Background */}
                            <div className="absolute inset-0 opacity-[0.2] font-mono text-[7px] text-blue-400 p-2 overflow-hidden pointer-events-none">
                                {Array(12).fill(0).map((_, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0.3 }}
                                        animate={{ x: [-5, 5], opacity: [0.3, 0.6, 0.3] }}
                                        transition={{ duration: 0.8, delay: i * 0.1, repeat: Infinity, repeatType: "reverse" }}
                                    >
                                        {`> trace_log_0x${i}F${i}... RELAYED`}
                                    </motion.div>
                                ))}
                            </div>

                            <div className="flex items-center gap-2 mb-6 relative z-10">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                >
                                    <Settings className="w-5 h-5 text-blue-400" />
                                </motion.div>
                                <h3 className="text-sm font-bold text-white uppercase tracking-widest">{blocks.core.title}</h3>
                            </div>

                            <div className="grid grid-cols-2 gap-3 relative z-10">
                                {[
                                    { title: "API Defense", icon: Shield },
                                    { title: "Processor", icon: Files },
                                    { title: "Vector Hub", icon: Network },
                                    { title: "Cloud Sync", icon: Flame },
                                ].map((step, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer group relative overflow-hidden">
                                        {/* Internal Processing Pulse */}
                                        <motion.div
                                            animate={{
                                                left: ["-100%", "200%"],
                                                opacity: [0, 0.5, 0]
                                            }}
                                            transition={{
                                                duration: 2.5,
                                                delay: idx * 0.6,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                            className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent z-0"
                                        />
                                        <step.icon className={`w-4 h-4 transition-transform group-hover:scale-110 relative z-10 ${idx === 3 ? 'text-orange-400' : 'text-blue-400'}`} />
                                        <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-tighter relative z-10">{step.title}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Deep Dive */}
                            <AnimatePresence>
                                {hoveredBlock === 'core' && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 1.1 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.1 }}
                                        className="absolute inset-0 bg-blue-950/95 flex flex-col items-center justify-center p-6 text-center z-20"
                                    >
                                        <Zap className="w-6 h-6 text-blue-400 mb-3" />
                                        <div className="text-[11px] font-bold text-white uppercase">{blocks.core.tech}</div>
                                        <div className="text-[8px] text-blue-200/60 font-mono mt-2">{blocks.core.path}</div>
                                        <div className="mt-4 flex gap-4">
                                            <div className="text-center">
                                                <div className="text-blue-400 text-[10px] font-mono">14ms</div>
                                                <div className="text-[7px] text-zinc-500 uppercase">Latency</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-green-400 text-[10px] font-mono">99.9%</div>
                                                <div className="text-[7px] text-zinc-500 uppercase">Uptime</div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Animated Horizontal Paths - Bridges to AI and Storage */}
                        <div className="absolute top-1/2 -translate-y-1/2 -left-8 w-8 h-px flex items-center">
                            <DataPath d="M 0 0 h 32" active={!simulating} color="emerald" duration={1.5} reverse />
                            {simStep === 3 && simulating && <SimulationTracer d="M 0 0 h 32" color="emerald" reverse />}
                            {simStep === 4 && simulating && <SimulationTracer d="M 0 0 h 32" color="emerald" />}
                        </div>
                        <div className="absolute top-1/2 -translate-y-1/2 -right-8 w-8 h-px flex items-center">
                            <DataPath d="M 0 0 h 32" active={!simulating} color="orange" duration={2} />
                            {simStep === 5 && simulating && <SimulationTracer d="M 0 0 h 32" color="orange" />}
                        </div>
                    </div>

                    {/* Persistence */}
                    <div className={`md:col-span-3 relative flex flex-col items-center transition-opacity duration-500 ${isDimmed('storage') ? 'opacity-20' : 'opacity-100'}`}>
                        <TraceLog step={6} color="orange" position="top" />
                        <motion.div
                            onMouseEnter={() => setHoveredBlock('storage')}
                            onMouseLeave={() => setHoveredBlock(null)}
                            animate={simStep === 6 ? {
                                scale: [1, 1.1, 1],
                                boxShadow: "0 0 40px rgba(249, 115, 22, 0.5)"
                            } : {}}
                            className={`w-full bg-white/5 border p-5 rounded-2xl h-full flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${hoveredBlock === 'storage' ? 'border-orange-500/40 bg-orange-500/[0.05]' : 'border-white/10'}`}
                        >
                            {/* Visible Sync Radiant activity */}
                            <motion.div
                                animate={{
                                    opacity: [0.1, 0.4, 0.1],
                                    scale: [1, 1.2, 1]
                                }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.2),transparent)] z-0"
                            />

                            <div className="mb-4 relative z-10">
                                <motion.div
                                    animate={{ y: [0, -2, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <Database className="w-5 h-5 text-orange-400 mb-2" />
                                </motion.div>
                                <h4 className="text-[11px] font-bold text-white uppercase tracking-tighter">{blocks.storage.title}</h4>
                                <span className="text-[9px] text-zinc-500 uppercase tracking-widest">FIREBASE STACK</span>
                            </div>
                            <div className="space-y-2 relative z-10">
                                <div className="flex items-center gap-2 p-2 rounded-lg bg-black/40 border border-white/5 group-hover:border-orange-500/20 transition-all">
                                    <MessageSquare className="w-4 h-4 text-zinc-400" />
                                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">Chat State</span>
                                </div>
                                <div className="flex items-center gap-2 p-2 rounded-lg bg-black/40 border border-white/5 group-hover:border-orange-500/20 transition-all">
                                    <Lock className="w-4 h-4 text-zinc-400" />
                                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">Secure Auth</span>
                                </div>
                            </div>

                            {/* Deep Dive */}
                            <AnimatePresence>
                                {hoveredBlock === 'storage' && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 bg-orange-950/95 flex flex-col items-center justify-center p-3 text-center z-20"
                                    >
                                        <div className="text-[9px] font-bold text-white uppercase">{blocks.storage.tech}</div>
                                        <div className="text-[7px] text-orange-200/60 font-mono mt-2 truncate max-w-full">{blocks.storage.path}</div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </div>

                {/* Legend */}
                <div className={`mt-12 flex flex-wrap justify-center gap-6 z-10 transition-opacity duration-500 ${simulating ? 'opacity-20' : 'opacity-100'}`}>
                    {[
                        { label: "Websocket / Streams", color: "bg-blue-500" },
                        { label: "Ollama Inference", color: "bg-emerald-500" },
                        { label: "Firebase Sync", color: "bg-orange-500" },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/5">
                            <motion.div
                                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                                className={`w-1.5 h-1.5 rounded-full ${item.color}`}
                            />
                            <span className="text-[8px] text-zinc-500 font-mono uppercase tracking-widest">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
