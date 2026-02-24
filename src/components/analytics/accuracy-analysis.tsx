"use client";

import React from "react";
import {
    LineChart, Line,
    XAxis, YAxis,
    CartesianGrid, Tooltip,
    ResponsiveContainer, Legend,
    BarChart, Bar
} from "recharts";
import { motion } from "framer-motion";
import { Target, CheckCircle2, AlertCircle } from "lucide-react";

const CONFIDENCE_DISTRIBUTION = [
    { score: '0-20', count: 2 },
    { score: '20-40', count: 5 },
    { score: '40-60', count: 12 },
    { score: '60-80', count: 28 },
    { score: '80-100', count: 53 },
];

const ACCURACY_TRENDS = [
    { period: 'Jan', retrieval: 92, relevance: 88, overall: 90 },
    { period: 'Feb', retrieval: 94, relevance: 91, overall: 92 },
    { period: 'Mar', retrieval: 97, relevance: 95, overall: 96 },
    { period: 'Apr', retrieval: 98, relevance: 98, overall: 98 },
];

export function AccuracyAnalysis() {
    return (
        <div className="space-y-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <AccuracyMetric
                    icon={<Target className="text-brand-primary" />}
                    label="Retrieval Precision"
                    value="98.4%"
                    sub="Context Relevancy Score"
                />
                <AccuracyMetric
                    icon={<CheckCircle2 className="text-emerald-400" />}
                    label="Answer Relevancy"
                    value="96.2%"
                    sub="Query Alignment Score"
                />
                <AccuracyMetric
                    icon={<AlertCircle className="text-brand-secondary" />}
                    label="Symbolic Logic"
                    value="100%"
                    sub="Deterministic Mapping"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 rounded-4xl bg-zinc-900/50 border border-white/5 backdrop-blur-sm">
                    <h3 className="text-lg font-bold text-white mb-6">Optimization Curve</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={ACCURACY_TRENDS}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="period" stroke="rgba(255,255,255,0.5)" fontSize={10} axisLine={false} tickLine={false} />
                                <YAxis stroke="rgba(255,255,255,0.5)" fontSize={10} axisLine={false} tickLine={false} domain={[80, 100]} />
                                <Tooltip
                                    contentStyle={{ background: '#09090b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="retrieval" stroke="var(--brand-primary)" strokeWidth={3} dot={{ fill: 'var(--brand-primary)' }} name="Retrieval" />
                                <Line type="monotone" dataKey="relevance" stroke="var(--brand-secondary)" strokeWidth={3} dot={{ fill: 'var(--brand-secondary)' }} name="Relevance" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="p-8 rounded-4xl bg-zinc-900/50 border border-white/5 backdrop-blur-sm">
                    <h3 className="text-lg font-bold text-white mb-6">Retrieval Distribution</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={CONFIDENCE_DISTRIBUTION}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="score" stroke="rgba(255,255,255,0.5)" fontSize={10} axisLine={false} tickLine={false} label={{ value: 'Confidence Score %', position: 'insideBottom', offset: -5, fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} />
                                <YAxis stroke="rgba(255,255,255,0.5)" fontSize={10} axisLine={false} tickLine={false} label={{ value: 'Query Count', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} />
                                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: '#09090b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                                <Bar dataKey="count" name="Queries" fill="var(--brand-primary)" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AccuracyMetric({ icon, label, value, sub }: { icon: React.ReactNode, label: string, value: string, sub: string }) {
    return (
        <div className="p-6 rounded-3xl bg-zinc-950 border border-white/5">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    {icon}
                </div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{label}</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1 tracking-tight">{value}</div>
            <p className="text-xs text-zinc-500">{sub}</p>
        </div>
    );
}
