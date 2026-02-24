"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, BarChart3, TrendingUp, Shield, Activity, Globe, Database, Zap, Cpu } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/landing/footer";
import { ComparativeAnalysis } from "@/components/analytics/comparative-analysis";
import { AccuracyAnalysis } from "@/components/analytics/accuracy-analysis";
import { HallucinationAnalysis } from "@/components/analytics/hallucination-analysis";
import { LatencyAnalysis } from "@/components/analytics/latency-analysis";
import { AblationStudy } from "@/components/analytics/ablation-study";

type AnalysisTab = "comparative" | "accuracy" | "hallucination" | "latency" | "ablation";

export default function AnalyticsPage() {
    const { t } = useI18n();
    const [activeTab, setActiveTab] = React.useState<AnalysisTab>("comparative");

    const tabs: { id: AnalysisTab; label: string; icon: any }[] = [
        { id: "comparative", label: "Comparative", icon: BarChart3 },
        { id: "accuracy", label: "Accuracy", icon: Activity },
        { id: "hallucination", label: "Hallucinations", icon: Shield },
        { id: "latency", label: "Latency", icon: Zap },
        { id: "ablation", label: "Ablation", icon: Database },
    ];

    return (
        <main className="min-h-screen bg-black text-white selection:bg-brand-primary/30">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-[140px] -translate-y-1/2" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-brand-secondary/5 rounded-full blur-[140px] translate-y-1/2" />
            </div>

            {/* Navigation Header */}
            <nav className="relative z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
                <div className="w-full px-6 md:px-12 h-20 flex items-center justify-between">
                    <Link href="/" className="group flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        <span className="text-sm font-medium tracking-wide uppercase">{t("common.backToHome")}</span>
                    </Link>

                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-status-high animate-pulse" />
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">System Operational</span>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-24 pb-12">
                <div className="w-full px-6 md:px-12 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-4xl"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 mb-6">
                            <Activity className="w-4 h-4 text-brand-primary" />
                            <span className="text-xs font-bold text-brand-primary uppercase tracking-wide">Live Enterprise Telemetry</span>
                        </div>
                        <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-6 leading-[0.9]">
                            Strategic <span className="text-brand-primary">Intelligence</span><br />
                            Command Centre
                        </h1>
                        <p className="text-xl text-zinc-400 font-light leading-relaxed max-w-2xl">
                            AURA provides 100% source-grounded answers across your private infrastructure.
                            Monitor real-time performance metrics and comparative intelligence efficacy.
                        </p>
                    </motion.div>

                    {/* Tabs Navigation */}
                    <div className="mt-20 flex flex-wrap gap-2 p-1.5 rounded-2xl bg-zinc-900/50 border border-white/5 backdrop-blur-md w-fit">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                                        isActive
                                            ? "bg-white text-black shadow-lg"
                                            : "text-zinc-500 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    <Icon className={cn("w-4 h-4", isActive ? "text-black" : "text-zinc-600")} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Main Intelligence Content */}
            <section className="pb-64">
                <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                    <div className="space-y-12">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="space-y-6"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                                <div>
                                    <h2 className="text-3xl font-bold tracking-tight mb-1">
                                        {tabs.find(t => t.id === activeTab)?.label} Analysis
                                    </h2>
                                    <p className="text-sm text-zinc-500 uppercase tracking-widest leading-loose">
                                        {activeTab === 'comparative' ? 'Benchmarking Productivity & Precision' : 'Deep-Dive Efficacy Metrics'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-950 border border-white/5 text-[10px] font-bold text-zinc-500 uppercase">
                                        <Globe className="w-3 h-3" />
                                        Active Regions: 12
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-950 border border-white/5 text-[10px] font-bold text-zinc-500 uppercase">
                                        <Database className="w-3 h-3" />
                                        Data Sync: 100%
                                    </div>
                                </div>
                            </div>

                            {activeTab === "comparative" && <ComparativeAnalysis />}
                            {activeTab === "accuracy" && <AccuracyAnalysis />}
                            {activeTab === "hallucination" && <HallucinationAnalysis />}
                            {activeTab === "latency" && <LatencyAnalysis />}
                            {activeTab === "ablation" && <AblationStudy />}
                        </motion.div>

                        {/* Additional High-Level Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-white/5">
                            <MetricFeature
                                icon={Cpu}
                                label="Processing Logic"
                                value="Vector RAG v4"
                                desc="Proprietary chunking architecture."
                            />
                            <MetricFeature
                                icon={Shield}
                                label="Data Security"
                                value="AES-256 E2EE"
                                desc="Bank-grade local encryption."
                            />
                            <MetricFeature
                                icon={Zap}
                                label="Context Velocity"
                                value="12.4 GB/s"
                                desc="Peak ingestion throughput."
                            />
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

function MetricFeature({ icon: Icon, label, value, desc }: { icon: any, label: string, value: string, desc: string }) {
    return (
        <div className="p-6 rounded-3xl bg-zinc-900/50 border border-white/5 group hover:border-brand-primary/30 transition-colors">
            <Icon className="w-5 h-5 text-zinc-500 mb-4 group-hover:text-brand-primary transition-colors" />
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{label}</div>
            <div className="text-lg font-bold text-white mb-2">{value}</div>
            <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
        </div>
    )
}
