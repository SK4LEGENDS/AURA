"use client";

import React from "react";
import {
    RadarChart, Radar, PolarGrid,
    PolarAngleAxis, PolarRadiusAxis,
    ResponsiveContainer, Tooltip, Legend,
    PieChart, Pie, Cell
} from "recharts";
import { ShieldAlert, Zap, Search, ShieldCheck } from "lucide-react";

const HALLUCINATION_DATA = [
    { subject: 'Faithfulness', aura: 100, common: 62 },
    { subject: 'Grounding', aura: 99, common: 45 },
    { subject: 'Truthfulness', aura: 100, common: 58 },
    { subject: 'Consistency', aura: 98, common: 70 },
    { subject: 'Inference', aura: 100, common: 50 },
];

const SOURCE_DISTRIBUTION = [
    { name: 'Direct PDF', value: 45, color: '#f59e0b' },
    { name: 'XLSX Structure', value: 30, color: '#10b981' },
    { name: 'DOCX Context', value: 15, color: '#3b82f6' },
    { name: 'OCR Metadata', value: 10, color: '#8b5cf6' },
];

export function HallucinationAnalysis() {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Reliability Radar */}
                <div className="p-8 rounded-4xl bg-zinc-900/50 border border-white/5 backdrop-blur-sm">
                    <div className="flex items-center gap-4 mb-8">
                        <ShieldAlert className="w-6 h-6 text-brand-secondary" />
                        <div>
                            <h3 className="text-lg font-bold text-white uppercase tracking-tight">Hallucination Resistance</h3>
                            <p className="text-xs text-zinc-500 font-mono tracking-tighter">Deterministic vs Probabilistic (Faithfulness)</p>
                        </div>
                    </div>
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={HALLUCINATION_DATA}>
                                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                                <PolarAngleAxis dataKey="subject" stroke="rgba(255,255,255,0.5)" fontSize={10} />
                                <Radar name="AURA (Deterministic Engine)" dataKey="aura" stroke="var(--brand-secondary)" fill="var(--brand-secondary)" fillOpacity={0.4} />
                                <Radar name="GPT-4o Baseline (Std RAG)" dataKey="common" stroke="rgba(255,255,255,0.2)" fill="rgba(255,255,255,0.1)" fillOpacity={0.1} />
                                <Tooltip contentStyle={{ background: '#09090b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                                <Legend />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Source Grounding */}
                <div className="p-8 rounded-4xl bg-zinc-900/50 border border-white/5 backdrop-blur-sm">
                    <div className="flex items-center gap-4 mb-8">
                        <Search className="w-6 h-6 text-brand-primary" />
                        <div>
                            <h3 className="text-lg font-bold text-white uppercase tracking-tight">Source Grounding Matrix</h3>
                            <p className="text-xs text-zinc-500 font-mono tracking-tighter">Origin verification across private docs</p>
                        </div>
                    </div>
                    <div className="h-[400px] w-full flex items-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={SOURCE_DISTRIBUTION}
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {SOURCE_DISTRIBUTION.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ background: '#09090b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="space-y-4">
                            {SOURCE_DISTRIBUTION.map((entry) => (
                                <div key={entry.name} className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                                    <div className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">{entry.name}</div>
                                    <div className="text-xs font-bold text-white">{entry.value}%</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Zero Hallucination Badge */}
            <div className="p-12 rounded-4xl bg-linear-to-r from-brand-secondary/20 to-brand-primary/20 border border-white/10 flex flex-col items-center text-center">
                <ShieldCheck className="w-12 h-12 text-brand-secondary mb-6 animate-pulse" />
                <h3 className="text-3xl font-bold text-white mb-4 italic font-playfair tracking-tight">Guaranteed Deterministic Engine</h3>
                <p className="text-zinc-400 max-w-2xl leading-relaxed">
                    AURA's symbolic reasoning layer ensures 100% citation coverage. If a relevant chunk is missed during retrieval,
                    the model admits ignorance rather than inventing context—a core safety pillar for enterprise intelligence.
                </p>
            </div>
        </div>
    );
}
