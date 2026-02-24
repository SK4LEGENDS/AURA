"use client";

import React from "react";
import {
    BarChart, Bar,
    XAxis, YAxis,
    CartesianGrid, Tooltip,
    ResponsiveContainer,
    AreaChart, Area
} from "recharts";
import { Zap, Clock, Cpu, Activity } from "lucide-react";

const PIPELINE_LATENCY = [
    { name: 'Embedding', aura: 45, cloud: 600 },
    { name: 'Retrieval', aura: 12, cloud: 450 },
    { name: 'Reranking', aura: 18, cloud: 300 },
    { name: 'Inference', aura: 80, cloud: 1200 },
];

const SCALING_PERFORMANCE = [
    { docs: '100', latency: 120 },
    { docs: '1k', latency: 145 },
    { docs: '10k', latency: 160 },
    { docs: '100k', latency: 190 },
    { docs: '1M', latency: 240 },
];

export function LatencyAnalysis() {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Pipeline Breakdown */}
                <div className="p-8 rounded-4xl bg-zinc-900/50 border border-white/5 backdrop-blur-sm">
                    <div className="flex items-center gap-4 mb-8">
                        <Clock className="w-6 h-6 text-yellow-400" />
                        <div>
                            <h3 className="text-lg font-bold text-white uppercase tracking-tight">Pipeline Velocity (ms)</h3>
                            <p className="text-xs text-zinc-500 font-mono tracking-tighter">Sub-second local processing vs Cloud RAG</p>
                        </div>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={PIPELINE_LATENCY} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                                <XAxis type="number" stroke="rgba(255,255,255,0.5)" fontSize={10} axisLine={false} tickLine={false} />
                                <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.5)" fontSize={10} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ background: '#09090b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                                <Bar dataKey="aura" name="AURA (Local)" fill="var(--brand-primary)" radius={[0, 4, 4, 0]} barSize={20} />
                                <Bar dataKey="cloud" name="Enterprise Cloud" fill="rgba(255,255,255,0.05)" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Sub-linear Scaling */}
                <div className="p-8 rounded-4xl bg-zinc-900/50 border border-white/5 backdrop-blur-sm">
                    <div className="flex items-center gap-4 mb-8">
                        <Zap className="w-6 h-6 text-brand-primary" />
                        <div>
                            <h3 className="text-lg font-bold text-white uppercase tracking-tight">Scalability Curve</h3>
                            <p className="text-xs text-zinc-500 font-mono tracking-tighter">Complexity-safe retrieval across 1M+ nodes</p>
                        </div>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={SCALING_PERFORMANCE}>
                                <defs>
                                    <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--brand-primary)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--brand-primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="docs" stroke="rgba(255,255,255,0.5)" fontSize={10} />
                                <YAxis stroke="rgba(255,255,255,0.5)" fontSize={10} />
                                <Tooltip contentStyle={{ background: '#09090b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                                <Area type="monotone" dataKey="latency" name="Total Latency (ms)" stroke="var(--brand-primary)" fillOpacity={1} fill="url(#colorLatency)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Compute Optimization */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <LatencyMetric label="Avg TTFT" value="142ms" sub="Time to First Token" icon={<Activity className="text-emerald-400" />} />
                <LatencyMetric label="Context Warp" value="0.02ms" sub="Node-to-Node Hop" icon={<Zap className="text-brand-primary" />} />
                <LatencyMetric label="Engine Wait" value="0ms" sub="Zero-blocking retrieval" icon={<Cpu className="text-brand-secondary" />} />
            </div>
        </div>
    );
}

function LatencyMetric({ label, value, sub, icon }: { label: string, value: string, sub: string, icon: React.ReactNode }) {
    return (
        <div className="p-8 rounded-4xl bg-zinc-950 border border-white/5 flex items-start gap-4">
            <div className="mt-1 w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                {icon}
            </div>
            <div>
                <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">{label}</div>
                <div className="text-2xl font-bold text-white mb-1">{value}</div>
                <div className="text-[10px] text-zinc-500 italic uppercase">{sub}</div>
            </div>
        </div>
    );
}
