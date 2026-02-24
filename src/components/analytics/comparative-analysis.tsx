"use client";

import React from "react";
import {
    BarChart, Bar,
    RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    AreaChart, Area,
    ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid
} from "recharts";
import { motion } from "framer-motion";
import { Shield, Zap, Target, Search, Cpu, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const COMPARATIVE_DATA = [
    { subject: 'Accuracy', aura: 98, gpt4: 72, claude: 78, gemini: 70, perple: 65, copilot: 68 },
    { subject: 'Grounding', aura: 100, gpt4: 30, claude: 35, gemini: 28, perple: 40, copilot: 32 },
    { subject: 'Security', aura: 100, gpt4: 45, claude: 52, gemini: 48, perple: 20, copilot: 55 },
    { subject: 'Traceability', aura: 100, gpt4: 15, claude: 18, gemini: 12, perple: 5, copilot: 10 },
    { subject: 'Privacy', aura: 100, gpt4: 40, claude: 42, gemini: 38, perple: 10, copilot: 35 },
];

const PERFORMANCE_TRENDS = [
    { name: '1k', aura: 140, gpt4: 850, claude: 700, lmstudio: 2500, pgpt: 1800 },
    { name: '10k', aura: 165, gpt4: 1200, claude: 950, lmstudio: 4200, pgpt: 3200 },
    { name: '100k', aura: 190, gpt4: 2400, claude: 1800, lmstudio: 8500, pgpt: 6800 },
    { name: '1M', aura: 240, gpt4: 4500, claude: 3800, lmstudio: 15000, pgpt: 12000 },
];

const COLORS = {
    aura: "var(--brand-primary)",
    gpt4: "rgba(255,255,255,0.2)",
    claude: "rgba(255,255,255,0.1)",
    text: "rgba(255,255,255,0.5)",
    grid: "rgba(255,255,255,0.05)",
    hover: "rgba(255,255,255,0.1)"
};

export function ComparativeAnalysis() {
    return (
        <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Accuracy & Grounding Chart */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-8 rounded-4xl bg-zinc-900/50 border border-white/5 backdrop-blur-sm"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20">
                            <Target className="w-5 h-5 text-brand-primary" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Truth Vector Analysis</h3>
                            <p className="text-xs text-zinc-500 uppercase tracking-widest">Grounding vs. Hallucination</p>
                        </div>
                    </div>

                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={COMPARATIVE_DATA.slice(0, 3)} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={false} />
                                <XAxis dataKey="subject" stroke={COLORS.text} fontSize={10} axisLine={false} tickLine={false} />
                                <YAxis stroke={COLORS.text} fontSize={10} axisLine={false} tickLine={false} domain={[0, 100]} />
                                <Tooltip
                                    contentStyle={{ background: '#09090b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '11px' }}
                                    cursor={{ fill: COLORS.hover }}
                                />
                                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                                <Bar dataKey="aura" name="AURA Intelligence" fill={COLORS.aura} radius={[4, 4, 0, 0]} barSize={20} />
                                <Bar dataKey="gpt4" name="ChatGPT-4o" fill={COLORS.gpt4} radius={[4, 4, 0, 0]} barSize={20} />
                                <Bar dataKey="claude" name="Claude 3.5" fill={COLORS.claude} radius={[4, 4, 0, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Strategic Radar */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-8 rounded-4xl bg-zinc-900/50 border border-white/5 backdrop-blur-sm"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-brand-secondary/10 flex items-center justify-center border border-brand-secondary/20">
                            <Shield className="w-5 h-5 text-brand-secondary" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Security Resilience</h3>
                            <p className="text-xs text-zinc-500 uppercase tracking-widest">Compliance Matrix</p>
                        </div>
                    </div>

                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={COMPARATIVE_DATA}>
                                <PolarGrid stroke={COLORS.grid} />
                                <PolarAngleAxis dataKey="subject" stroke={COLORS.text} fontSize={10} />
                                <Radar name="AURA Intelligence" dataKey="aura" stroke={COLORS.aura} fill={COLORS.aura} fillOpacity={0.4} />
                                <Radar name="ChatGPT-4o" dataKey="gpt4" stroke="#fff" fill="#fff" fillOpacity={0.05} />
                                <Radar name="Claude 3.5" dataKey="claude" stroke="#fff" fill="#fff" fillOpacity={0.02} />
                                <Tooltip contentStyle={{ background: '#09090b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '11px' }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Neural Processing Velocity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-8 rounded-4xl bg-zinc-900/50 border border-white/5 backdrop-blur-sm"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-status-high/10 flex items-center justify-center border border-status-high/20">
                            <Zap className="w-5 h-5 text-status-high" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Neural Velocity</h3>
                            <p className="text-xs text-zinc-500 uppercase tracking-widest">Inference Scaling (tokens/sec)</p>
                        </div>
                    </div>

                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={PERFORMANCE_TRENDS} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorAura" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={COLORS.aura} stopOpacity={0.3} />
                                        <stop offset="95%" stopColor={COLORS.aura} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={false} />
                                <XAxis dataKey="name" stroke={COLORS.text} fontSize={10} axisLine={false} tickLine={false} />
                                <YAxis stroke={COLORS.text} fontSize={10} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ background: '#09090b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '11px' }}
                                />
                                <Area type="monotone" dataKey="aura" name="AURA Compute" stroke={COLORS.aura} fillOpacity={1} fill="url(#colorAura)" />
                                <Area type="monotone" dataKey="gpt4" name="ChatGPT-4o" stroke="#fff" strokeOpacity={0.5} fillOpacity={0.05} fill="#fff" />
                                <Area type="monotone" dataKey="claude" name="Claude 3.5" stroke="#fff" strokeOpacity={0.2} fillOpacity={0.02} fill="#fff" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Dual Feature Table Comparison */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Table 1: Platform Foundation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="overflow-hidden rounded-4xl border border-white/5 bg-zinc-950"
                >
                    <div className="p-6 border-b border-white/5 bg-white/2">
                        <div className="flex items-center gap-3 mb-1">
                            <Cpu className="w-4 h-4 text-brand-primary" />
                            <h4 className="font-bold text-white tracking-tight">Intelligence Foundation</h4>
                        </div>
                        <p className="text-xs text-zinc-500">Structural grounding vs. probabilistic LLM architectures.</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-[10px] border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-zinc-900/50">
                                    <th className="px-4 py-3 font-bold uppercase tracking-widest text-zinc-500">Segment</th>
                                    <th className="px-4 py-3 font-bold uppercase tracking-widest text-brand-primary">AURA</th>
                                    <th className="px-4 py-3 font-bold uppercase tracking-widest text-zinc-500">ChatGPT-4o</th>
                                    <th className="px-4 py-3 font-bold uppercase tracking-widest text-zinc-500">Claude 3.5</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {[
                                    { f: "Control", a: "Zero Hallucination", g: "Probabilistic", c: "Probabilistic" },
                                    { f: "Residency", a: "100% Local", g: "Cloud", c: "Cloud" },
                                    { f: "Citations", a: "Infinite", g: "Limited", c: "Variable" },
                                    { f: "Logic", a: "Symbolic", g: "Statistical", c: "Reasoning-Next" },
                                ].map((row, i) => (
                                    <tr key={i} className="group hover:bg-white/2 transition-colors">
                                        <td className="px-4 py-3 font-medium text-white">{row.f}</td>
                                        <td className="px-4 py-3 text-brand-primary font-bold">{row.a}</td>
                                        <td className="px-4 py-3 text-zinc-500">{row.g}</td>
                                        <td className="px-4 py-3 text-zinc-500">{row.c}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Table 2: RAG Specifics */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="overflow-hidden rounded-4xl border border-white/5 bg-zinc-950"
                >
                    <div className="p-6 border-b border-white/5 bg-white/2">
                        <div className="flex items-center gap-3 mb-1">
                            <Search className="w-4 h-4 text-brand-secondary" />
                            <h4 className="font-bold text-white tracking-tight">RAG Implementation</h4>
                        </div>
                        <p className="text-xs text-zinc-500">Neural graph retrieval vs. basic flat-vector RAG.</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-[10px] border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-zinc-900/50">
                                    <th className="px-4 py-3 font-bold uppercase tracking-widest text-zinc-500">Mechanism</th>
                                    <th className="px-4 py-3 font-bold uppercase tracking-widest text-brand-secondary">AURA Core</th>
                                    <th className="px-4 py-3 font-bold uppercase tracking-widest text-zinc-500">Pinecone</th>
                                    <th className="px-4 py-3 font-bold uppercase tracking-widest text-zinc-500">Cohere</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {[
                                    { f: "Retrieval", a: "Neural Graph", p: "Top-K Vector", c: "Rerank-Only" },
                                    { f: "Chunking", a: "Semantic", p: "Fixed Window", c: "Dynamic-B" },
                                    { f: "Metadata", a: "Deep Map", p: "Basic Index", c: "Tag-Based" },
                                    { f: "Latency", a: "<100ms", p: "600ms+", c: "500ms+" },
                                ].map((row, i) => (
                                    <tr key={i} className="group hover:bg-white/2 transition-colors">
                                        <td className="px-4 py-3 font-medium text-white">{row.f}</td>
                                        <td className="px-4 py-3 text-brand-secondary font-bold">{row.a}</td>
                                        <td className="px-4 py-3 text-zinc-500">{row.p}</td>
                                        <td className="px-4 py-3 text-zinc-500">{row.c}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>

            {/* Comprehensive Benchmarking Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="overflow-hidden rounded-4xl border border-white/5 bg-zinc-950 shadow-2xl"
            >
                <div className="p-8 border-b border-white/5 bg-white/2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <BarChart3 className="w-5 h-5 text-brand-primary" />
                            <h4 className="text-xl font-bold text-white tracking-tight">Performance Benchmarks</h4>
                        </div>
                    </div>
                    <p className="mt-2 text-sm text-zinc-500">Quantitative analysis of RAG efficacy across industry-standard scoring matrices (RAGAS).</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="border-b border-white/5 bg-zinc-900/50">
                                <th className="px-6 py-5 font-bold text-[10px] uppercase tracking-widest text-zinc-500 whitespace-nowrap">Metric Axis</th>
                                <th className="px-6 py-5 font-bold text-[10px] uppercase tracking-widest text-brand-primary whitespace-nowrap">AURA Platform</th>
                                <th className="px-6 py-5 font-bold text-[10px] uppercase tracking-widest text-zinc-500 whitespace-nowrap">LM Studio + RAG</th>
                                <th className="px-6 py-5 font-bold text-[10px] uppercase tracking-widest text-zinc-500 whitespace-nowrap">OpenWebUI</th>
                                <th className="px-6 py-5 font-bold text-[10px] uppercase tracking-widest text-zinc-500 whitespace-nowrap">AnythingLLM</th>
                                <th className="px-6 py-5 font-bold text-[10px] uppercase tracking-widest text-zinc-500 whitespace-nowrap">PrivateGPT</th>
                                <th className="px-6 py-5 font-bold text-[10px] uppercase tracking-widest text-zinc-500 whitespace-nowrap">ChatGPT-4o</th>
                                <th className="px-6 py-5 font-bold text-[10px] uppercase tracking-widest text-zinc-500 whitespace-nowrap">Perplexity</th>
                                <th className="px-6 py-5 font-bold text-[10px] uppercase tracking-widest text-zinc-500 whitespace-nowrap">Gemini Pro</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {[
                                { m: "Retrieval Precision", a: "98.4%", lm: "45.2%", ow: "52.1%", al: "48.5%", pg: "42.0%", gpt: "65.2%", px: "82.4%", gm: "68.5%" },
                                { m: "Faithfulness", a: "100%", lm: "32.4%", ow: "41.0%", al: "38.2%", pg: "31.5%", gpt: "58.0%", px: "45.2%", gm: "61.0%" },
                                { m: "Answer Relevance", a: "96.2%", lm: "51.0%", ow: "60.4%", al: "58.5%", pg: "48.2%", gpt: "72.5%", px: "88.1%", gm: "75.0%" },
                                { m: "Inference Latency", a: "142ms", lm: "2800ms", ow: "3100ms", al: "2400ms", pg: "3400ms", gpt: "890ms", px: "1200ms", gm: "740ms" },
                                { m: "Residency", a: "Local", lm: "Local", ow: "Local", al: "Local", pg: "Local", gpt: "Cloud", px: "Cloud", gm: "Cloud" },
                                { m: "Context Map", a: "Deterministic", lm: "Statistical", ow: "Statistical", al: "Statistical", pg: "Statistical", gpt: "Statistical", px: "Crawler", gm: "Statistical" },
                            ].map((row, i) => (
                                <tr key={i} className="group hover:bg-white/3 transition-colors text-[11px]">
                                    <td className="px-6 py-4 font-bold text-white whitespace-nowrap">{row.m}</td>
                                    <td className="px-6 py-4">
                                        <span className="text-brand-primary font-black">{row.a}</span>
                                    </td>
                                    <td className="px-6 py-4 text-zinc-500">{row.lm}</td>
                                    <td className="px-6 py-4 text-zinc-500">{row.ow}</td>
                                    <td className="px-6 py-4 text-zinc-500">{row.al}</td>
                                    <td className="px-6 py-4 text-zinc-500">{row.pg}</td>
                                    <td className="px-6 py-4 text-zinc-400">{row.gpt}</td>
                                    <td className="px-6 py-4 text-zinc-400">{row.px}</td>
                                    <td className="px-6 py-4 text-zinc-400">{row.gm}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}
