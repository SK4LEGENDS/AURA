"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    BarChart3,
    TrendingUp,
    AlertTriangle,
    Clock,
    CheckCircle,
    XCircle,
    HelpCircle,
    RefreshCw
} from "lucide-react";
import { AnalyticsSummary } from "@/types/analytics";
import { cn } from "@/lib/utils";

interface AnalyticsDashboardProps {
    userId?: string;
}

export function AnalyticsDashboard({ userId }: AnalyticsDashboardProps) {
    const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAnalytics = async () => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();
            if (userId) params.set("userId", userId);

            const response = await fetch(`/api/analytics?${params}`);
            const data = await response.json();

            if (data.success) {
                setSummary(data.summary);
            } else {
                setError(data.error || "Failed to load analytics");
            }
        } catch (e) {
            setError("Failed to fetch analytics");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, [userId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <RefreshCw className="w-6 h-6 animate-spin text-zinc-400" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
            </div>
        );
    }

    if (!summary) return null;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-ui-text-primary">Query Analytics</h2>
                <button
                    onClick={fetchAnalytics}
                    className="p-2 rounded-lg hover:bg-ui-surface transition-colors"
                >
                    <RefreshCw className="w-4 h-4 text-ui-text-secondary" />
                </button>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard
                    icon={BarChart3}
                    label="Total Queries"
                    value={summary.totalQueries}
                    color="action"
                />
                <MetricCard
                    icon={CheckCircle}
                    label="Answer Rate"
                    value={`${(summary.answerRate * 100).toFixed(0)}%`}
                    color="high"
                />
                <MetricCard
                    icon={TrendingUp}
                    label="Avg Confidence"
                    value={`${(summary.avgConfidenceScore * 100).toFixed(0)}%`}
                    color="medium"
                />
                <MetricCard
                    icon={Clock}
                    label="Avg Latency"
                    value={`${summary.avgLatencyMs.toFixed(0)}ms`}
                    color="identity"
                />
            </div>

            <div className="p-4 rounded-lg bg-ui-surface/50 border border-ui-border">
                <h3 className="text-sm font-medium text-ui-text-primary mb-3">Confidence Distribution</h3>
                <div className="space-y-2">
                    <ConfidenceBar
                        label="High"
                        count={summary.highConfidenceCount}
                        total={summary.totalQueries}
                        color="high"
                    />
                    <ConfidenceBar
                        label="Medium"
                        count={summary.mediumConfidenceCount}
                        total={summary.totalQueries}
                        color="medium"
                    />
                    <ConfidenceBar
                        label="Low"
                        count={summary.lowConfidenceCount}
                        total={summary.totalQueries}
                        color="low"
                    />
                </div>
            </div>

            {/* Guardrail Stats */}
            {summary.guardrailTriggerRate > 0 && (
                <div className="p-4 rounded-lg bg-status-medium/10 border border-status-medium/20">
                    <div className="flex items-center gap-2 text-status-medium">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm font-medium">
                            Guardrail triggered on {(summary.guardrailTriggerRate * 100).toFixed(0)}% of queries
                        </span>
                    </div>
                </div>
            )}

            {/* Unanswered Queries */}
            {summary.topUnansweredQueries.length > 0 && (
                <div className="p-4 rounded-lg bg-ui-surface/50 border border-ui-border">
                    <h3 className="text-sm font-medium text-ui-text-primary mb-3 flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-status-low" />
                        Knowledge Gaps (Unanswered)
                    </h3>
                    <ul className="space-y-2">
                        {summary.topUnansweredQueries.slice(0, 5).map((item, idx) => (
                            <li key={idx} className="text-xs text-zinc-400 flex justify-between">
                                <span className="truncate max-w-[80%]">"{item.query}"</span>
                                <span className="text-zinc-500">×{item.count}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

function MetricCard({
    icon: Icon,
    label,
    value,
    color
}: {
    icon: any;
    label: string;
    value: string | number;
    color: string;
}) {
    const colorClasses: Record<string, string> = {
        action: "bg-brand-secondary/20 text-brand-secondary border-brand-secondary/30",
        high: "bg-status-high/20 text-status-high border-status-high/30",
        medium: "bg-status-medium/20 text-status-medium border-status-medium/30",
        identity: "bg-brand-primary/20 text-brand-primary border-brand-primary/30",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "p-4 rounded-lg border",
                colorClasses[color] || colorClasses.blue
            )}
        >
            <Icon className="w-5 h-5 mb-2" />
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-xs opacity-70">{label}</div>
        </motion.div>
    );
}

function ConfidenceBar({
    label,
    count,
    total,
    color
}: {
    label: string;
    count: number;
    total: number;
    color: string;
}) {
    const percentage = total > 0 ? (count / total) * 100 : 0;

    const colorClasses: Record<string, string> = {
        high: "bg-status-high",
        medium: "bg-status-medium",
        low: "bg-status-low",
    };

    return (
        <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-400 w-16">{label}</span>
            <div className="flex-1 h-2 bg-zinc-700 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5 }}
                    className={cn("h-full rounded-full", colorClasses[color])}
                />
            </div>
            <span className="text-xs text-zinc-500 w-12 text-right">
                {count} ({percentage.toFixed(0)}%)
            </span>
        </div>
    );
}
