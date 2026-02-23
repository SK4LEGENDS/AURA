"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    BarChart3,
    TrendingUp,
    Clock,
    CheckCircle,
    XCircle,
    RefreshCw,
    MessageSquare,
    Lightbulb,
    X,
    ChevronRight,
    Shield,
    AlertTriangle,
    Database,
    Activity,
    FileText,
    Zap
} from "lucide-react";
import { AnalyticsSummary, QueryAnalytics } from "@/types/analytics";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n-context";

interface UserInsightsProps {
    userId: string;
    isOpen: boolean;
    onClose: () => void;
}

/**
 * Comprehensive Analytics Dashboard
 */
export function UserInsightsPanel({ userId, isOpen, onClose }: UserInsightsProps) {
    const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
    const [recentQueries, setRecentQueries] = useState<QueryAnalytics[]>([]);
    const [loading, setLoading] = useState(true);
    const { t } = useI18n();

    const fetchData = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ userId, limit: "100" });
            const response = await fetch(`/api/analytics?${params}`);
            const data = await response.json();

            if (data.success) {
                setSummary(data.summary);
                setRecentQueries(data.queries || []);
            }
        } catch (e) {
            console.error("Failed to fetch insights:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchData();
        }
    }, [isOpen, userId]);

    // Calculate derived metrics
    const trustScore = summary
        ? Math.round((summary.answerRate * 0.4 + summary.avgConfidenceScore * 0.4 + (1 - summary.guardrailTriggerRate) * 0.2) * 100)
        : 0;

    const evidencePresence = summary
        ? Math.round((summary.avgSimilarity || 0.5) * 100)
        : 0;

    const refusalRate = summary
        ? Math.round((1 - summary.answerRate) * 100)
        : 0;

    const riskyQuestions = recentQueries.filter(q =>
        q.confidenceLevel === "low" || q.guardrailTriggered || !q.wasAnswered
    );

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 z-40"
                        onClick={onClose}
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-2xl bg-zinc-900 border-l border-zinc-800 z-50 overflow-y-auto"
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 p-4 flex items-center justify-between z-10">
                            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-blue-400" />
                                Analytics Dashboard
                            </h2>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={fetchData}
                                    className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
                                >
                                    <RefreshCw className={cn("w-4 h-4 text-zinc-400", loading && "animate-spin")} />
                                </button>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
                                >
                                    <X className="w-5 h-5 text-zinc-400" />
                                </button>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center p-12">
                                <RefreshCw className="w-8 h-8 animate-spin text-zinc-400" />
                            </div>
                        ) : summary && summary.totalQueries > 0 ? (
                            <div className="p-4 space-y-4">

                                {/* Row 1: Trust Score */}
                                <TrustScoreCard score={trustScore} queryCount={summary.totalQueries} t={t} />

                                {/* Row 2: Confidence Distribution | Evidence Presence */}
                                <div className="grid grid-cols-2 gap-4">
                                    <ConfidenceDistributionCard summary={summary} t={t} />
                                    <EvidencePresenceCard score={evidencePresence} avgSimilarity={summary.avgSimilarity} t={t} />
                                </div>

                                {/* Row 3: Avg Confidence Over Time */}
                                <ConfidenceTimelineCard queries={recentQueries} t={t} />

                                {/* Row 4: Retrieval Score | Consistency */}
                                <div className="grid grid-cols-2 gap-4">
                                    <MetricCard
                                        icon={Database}
                                        title={t("insights.retrieval")}
                                        value={`${Math.round((summary.avgSimilarity || 0.5) * 100)}%`}
                                        subtitle={`${t("insights.chunks").replace("{count}", summary.avgChunksRetrieved.toFixed(1))}`}
                                        color="blue"
                                    />
                                    <MetricCard
                                        icon={Activity}
                                        title={t("insights.consistency")}
                                        value={`${Math.round(summary.confidenceCorrelation * 100)}%`}
                                        subtitle={t("insights.correlation")}
                                        color="orange"
                                    />
                                </div>

                                {/* Row 5: Coverage Histogram | Refusal Rate */}
                                <div className="grid grid-cols-2 gap-4">
                                    <CoverageHistogramCard queries={recentQueries} t={t} />
                                    <MetricCard
                                        icon={XCircle}
                                        title={t("insights.refusal")}
                                        value={`${refusalRate}%`}
                                        subtitle={t("insights.unanswered").replace("{count}", summary.unansweredQueries.toString())}
                                        color={refusalRate > 30 ? "red" : refusalRate > 15 ? "yellow" : "green"}
                                    />
                                </div>

                                {/* Row 6: Risky Questions Table */}
                                <RiskyQuestionsTable questions={riskyQuestions} t={t} />

                                {/* Row 7: Ingestion & System Health */}
                                <SystemHealthCard summary={summary} t={t} />

                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-12 text-center">
                                <MessageSquare className="w-12 h-12 text-zinc-600 mb-4" />
                                <p className="text-zinc-400 text-lg">{t("insights.noData")}</p>
                                <p className="text-zinc-500 text-sm mt-1">{t("insights.startAsking")}</p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// Trust Score Card
function TrustScoreCard({ score, queryCount, t }: { score: number; queryCount: number; t: any }) {
    const getScoreColor = (s: number) => {
        if (s >= 80) return { bg: "bg-emerald-500", text: "text-emerald-400", label: t("insights.excellent") };
        if (s >= 60) return { bg: "bg-blue-500", text: "text-blue-400", label: t("insights.good") };
        if (s >= 40) return { bg: "bg-amber-500", text: "text-amber-400", label: t("insights.fair") };
        return { bg: "bg-red-500", text: "text-red-400", label: t("insights.needsImprovement") };
    };

    const color = getScoreColor(score);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-xl bg-linear-to-br from-zinc-800/80 to-zinc-900 border border-zinc-700"
        >
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Shield className={cn("w-5 h-5", color.text)} />
                        <span className="text-sm font-medium text-zinc-400">{t("insights.trustScore")}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className={cn("text-4xl font-bold", color.text)}>{score}%</span>
                        <span className="text-sm text-zinc-500">{color.label}</span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">{t("insights.basedOn").replace("{count}", queryCount.toString())}</p>
                </div>
                <div className="relative w-24 h-24">
                    <svg className="w-24 h-24 transform -rotate-90">
                        <circle cx="48" cy="48" r="40" className="fill-none stroke-zinc-700" strokeWidth="8" />
                        <circle
                            cx="48" cy="48" r="40"
                            className={cn("fill-none", color.bg.replace('bg-', 'stroke-'))}
                            strokeWidth="8"
                            strokeDasharray={`${score * 2.51} 251`}
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Shield className={cn("w-8 h-8", color.text)} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// Confidence Distribution Card
function ConfidenceDistributionCard({ summary, t }: { summary: AnalyticsSummary; t: any }) {
    const total = summary.totalQueries;
    const data = [
        { label: t("insights.high"), count: summary.highConfidenceCount, color: "bg-emerald-500" },
        { label: t("insights.medium"), count: summary.mediumConfidenceCount, color: "bg-amber-500" },
        { label: t("insights.low"), count: summary.lowConfidenceCount, color: "bg-red-500" },
    ];

    return (
        <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700">
            <h3 className="text-sm font-medium text-white mb-3">{t("insights.confidence")}</h3>
            <div className="space-y-2">
                {data.map(({ label, count, color }) => (
                    <div key={label} className="flex items-center gap-2">
                        <span className="text-xs text-zinc-400 w-12">{label}</span>
                        <div className="flex-1 h-3 bg-zinc-700 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(count / total) * 100}%` }}
                                transition={{ duration: 0.5 }}
                                className={cn("h-full rounded-full", color)}
                            />
                        </div>
                        <span className="text-xs text-zinc-500 w-8 text-right">{count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Evidence Presence Card
function EvidencePresenceCard({ score, avgSimilarity, t }: { score: number; avgSimilarity: number; t: any }) {
    return (
        <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700">
            <h3 className="text-sm font-medium text-white mb-3">{t("insights.evidence")}</h3>
            <div className="flex items-center justify-center h-20">
                <div className="text-center">
                    <span className="text-3xl font-bold text-blue-400">{score}%</span>
                    <p className="text-xs text-zinc-500 mt-1">{t("insights.similarity").replace("{score}", (avgSimilarity * 100).toFixed(1))}</p>
                </div>
            </div>
            <div className="h-2 bg-zinc-700 rounded-full mt-2 overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    className="h-full bg-blue-500 rounded-full"
                />
            </div>
        </div>
    );
}

// Confidence Timeline Card
function ConfidenceTimelineCard({ queries, t }: { queries: QueryAnalytics[]; t: any }) {
    const last10 = queries.slice(0, 10).reverse();
    const maxScore = 1;

    return (
        <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700">
            <h3 className="text-sm font-medium text-white mb-3">{t("insights.timeline")}</h3>
            <div className="h-24 flex items-end gap-1">
                {last10.length > 0 ? last10.map((q, idx) => {
                    const height = (q.confidenceScore / maxScore) * 100;
                    const color = q.confidenceLevel === "high" ? "bg-emerald-500"
                        : q.confidenceLevel === "medium" ? "bg-amber-500"
                            : "bg-red-500";
                    return (
                        <motion.div
                            key={idx}
                            initial={{ height: 0 }}
                            animate={{ height: `${height}%` }}
                            transition={{ delay: idx * 0.05 }}
                            className={cn("flex-1 rounded-t", color)}
                            title={`${(q.confidenceScore * 100).toFixed(0)}%`}
                        />
                    );
                }) : (
                    <div className="w-full text-center text-zinc-500 text-xs">{t("insights.noData")}</div>
                )}
            </div>
            <div className="flex justify-between text-xs text-zinc-500 mt-2">
                <span>{t("insights.older")}</span>
                <span>{t("insights.recent")}</span>
            </div>
        </div>
    );
}

// Coverage Histogram Card
function CoverageHistogramCard({ queries, t }: { queries: QueryAnalytics[]; t: any }) {
    const buckets = [0, 0, 0, 0, 0]; // 0-20, 20-40, 40-60, 60-80, 80-100
    queries.forEach(q => {
        const idx = Math.min(4, Math.floor(q.confidenceScore * 5));
        buckets[idx]++;
    });
    const max = Math.max(...buckets, 1);

    return (
        <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700">
            <h3 className="text-sm font-medium text-white mb-3">{t("insights.coverage")}</h3>
            <div className="h-16 flex items-end gap-1">
                {buckets.map((count, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ height: 0 }}
                        animate={{ height: `${(count / max) * 100}%` }}
                        className="flex-1 bg-brand-primary rounded-t min-h-[2px]"
                    />
                ))}
            </div>
            <div className="flex justify-between text-xs text-zinc-500 mt-1">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
            </div>
        </div>
    );
}

// Metric Card
function MetricCard({
    icon: Icon,
    title,
    value,
    subtitle,
    color
}: {
    icon: any;
    title: string;
    value: string;
    subtitle: string;
    color: string;
}) {
    const colors: Record<string, string> = {
        blue: "text-blue-400",
        green: "text-emerald-400",
        yellow: "text-amber-400",
        orange: "text-brand-primary",
        red: "text-red-400",
    };

    return (
        <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700">
            <div className="flex items-center gap-2 mb-2">
                <Icon className={cn("w-4 h-4", colors[color])} />
                <span className="text-sm font-medium text-zinc-400">{title}</span>
            </div>
            <div className={cn("text-2xl font-bold", colors[color])}>{value}</div>
            <p className="text-xs text-zinc-500 mt-1">{subtitle}</p>
        </div>
    );
}

// Risky Questions Table
function RiskyQuestionsTable({ questions, t }: { questions: QueryAnalytics[]; t: any }) {
    if (questions.length === 0) {
        return (
            <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700">
                <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-medium text-white">⚠️ {t("insights.risky")}</h3>
                </div>
                <p className="text-sm text-zinc-500 text-center py-4">{t("insights.noRisky")}</p>
            </div>
        );
    }

    return (
        <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700">
            <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-medium text-white">⚠️ {t("insights.risky")} ({questions.length})</h3>
            </div>
            <div className="max-h-48 overflow-y-auto space-y-2">
                {questions.slice(0, 5).map((q, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-zinc-900/50 border border-zinc-700">
                        <p className="text-xs text-zinc-300 line-clamp-1">"{q.query}"</p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={cn(
                                "text-xs px-1.5 py-0.5 rounded",
                                q.guardrailTriggered ? "bg-red-500/20 text-red-400" :
                                    q.confidenceLevel === "low" ? "bg-amber-500/20 text-amber-400" :
                                        "bg-zinc-700 text-zinc-400"
                            )}>
                                {q.guardrailTriggered ? t("insights.guardrail") : t(`insights.${q.confidenceLevel}`)}
                            </span>
                            <span className="text-xs text-zinc-500">
                                {(q.confidenceScore * 100).toFixed(0)}% confidence
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// System Health Card
function SystemHealthCard({ summary, t }: { summary: AnalyticsSummary; t: any }) {
    return (
        <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700">
            <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-green-400" />
                <h3 className="text-sm font-medium text-white">{t("insights.systemHealth")}</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                    <div className="text-xl font-bold text-green-400">{summary.avgLatencyMs.toFixed(0)}ms</div>
                    <p className="text-xs text-zinc-500">{t("insights.latency")}</p>
                </div>
                <div className="text-center">
                    <div className="text-xl font-bold text-blue-400">{summary.p95LatencyMs.toFixed(0)}ms</div>
                    <p className="text-xs text-zinc-500">{t("insights.p95")}</p>
                </div>
                <div className="text-center">
                    <div className="text-xl font-bold text-brand-primary">{summary.avgChunksRetrieved.toFixed(1)}</div>
                    <p className="text-xs text-zinc-500">{t("insights.chunks").split('/')[1]}</p>
                </div>
            </div>
        </div>
    );
}

/**
 * Button to open insights panel
 */
export function InsightsButton({ onClick }: { onClick: () => void }) {
    const { t } = useI18n();
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors",
                "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white",
                "text-sm font-medium"
            )}
        >
            <BarChart3 className="w-4 h-4" />
            <span>{t("sidebar.yourInsights")}</span>
        </button>
    );
}
