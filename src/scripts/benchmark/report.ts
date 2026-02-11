/**
 * Benchmark Report Generator
 * 
 * Generates comparison reports between AURA and cloud RAG solutions.
 */

import { BenchmarkSummary } from "./metrics";

export interface ComparisonReport {
    title: string;
    generatedAt: string;
    systems: BenchmarkSummary[];
    winner: {
        accuracy: string;
        latency: string;
        calibration: string;
        overall: string;
    };
    analysis: string;
}

/**
 * Generate comparison report between systems
 */
export function generateComparisonReport(
    summaries: BenchmarkSummary[]
): ComparisonReport {
    if (summaries.length === 0) {
        throw new Error("No benchmark summaries provided");
    }

    // Determine winners
    const byAccuracy = [...summaries].sort((a, b) => b.accuracy - a.accuracy);
    const byLatency = [...summaries].sort((a, b) => a.avgLatencyMs - b.avgLatencyMs);
    const byCalibration = [...summaries].sort((a, b) => b.confidenceCorrelation - a.confidenceCorrelation);

    // Overall score: weighted combination
    const scores = summaries.map(s => ({
        name: s.systemName,
        score: s.accuracy * 0.4 +
            (1 - Math.min(s.avgLatencyMs / 10000, 1)) * 0.3 +
            s.confidenceCorrelation * 0.2 +
            (1 - s.hallucinationRate) * 0.1,
    }));
    scores.sort((a, b) => b.score - a.score);

    const analysis = generateAnalysis(summaries);

    return {
        title: "AURA Performance Benchmark Report",
        generatedAt: new Date().toISOString(),
        systems: summaries,
        winner: {
            accuracy: byAccuracy[0].systemName,
            latency: byLatency[0].systemName,
            calibration: byCalibration[0].systemName,
            overall: scores[0].name,
        },
        analysis,
    };
}

function generateAnalysis(summaries: BenchmarkSummary[]): string {
    if (summaries.length < 2) {
        return "Single system benchmark completed. Add comparison systems for full analysis.";
    }

    const aura = summaries.find(s => s.systemName.toLowerCase().includes("aura"));
    const cloud = summaries.find(s => !s.systemName.toLowerCase().includes("aura"));

    if (!aura || !cloud) {
        return "Unable to generate comparison analysis.";
    }

    const accDiff = ((aura.accuracy - cloud.accuracy) * 100).toFixed(1);
    const latDiff = ((cloud.avgLatencyMs - aura.avgLatencyMs) / cloud.avgLatencyMs * 100).toFixed(0);
    const hallDiff = ((cloud.hallucinationRate - aura.hallucinationRate) * 100).toFixed(1);

    let analysis = `## Key Findings\n\n`;
    analysis += `**Accuracy**: AURA achieves ${(aura.accuracy * 100).toFixed(1)}% accuracy `;
    analysis += parseFloat(accDiff) > 0
        ? `(${accDiff}pp higher than ${cloud.systemName})\n`
        : `(${Math.abs(parseFloat(accDiff))}pp lower than ${cloud.systemName})\n`;

    analysis += `**Latency**: AURA averages ${aura.avgLatencyMs.toFixed(0)}ms `;
    analysis += parseFloat(latDiff) > 0
        ? `(${latDiff}% faster than ${cloud.systemName})\n`
        : `(${Math.abs(parseFloat(latDiff))}% slower than ${cloud.systemName})\n`;

    analysis += `**Hallucination Rate**: AURA at ${(aura.hallucinationRate * 100).toFixed(1)}% `;
    analysis += parseFloat(hallDiff) > 0
        ? `(${hallDiff}pp lower hallucination rate)\n`
        : `(${Math.abs(parseFloat(hallDiff))}pp higher hallucination rate)\n`;

    analysis += `\n**Confidence Calibration**: AURA's confidence correlation is ${aura.confidenceCorrelation.toFixed(2)} `;
    analysis += aura.confidenceCorrelation > cloud.confidenceCorrelation
        ? `(better calibrated than ${cloud.systemName})\n`
        : `(needs improvement vs ${cloud.systemName})\n`;

    analysis += `\n## Conclusion\n\n`;
    analysis += `AURA demonstrates ${aura.accuracy > 0.8 ? 'strong' : 'competitive'} performance `;
    analysis += `while maintaining full data privacy through local inference. `;
    analysis += `The ${aura.confidenceCorrelation > 0.5 ? 'well-calibrated' : 'developing'} confidence scoring `;
    analysis += `provides transparent uncertainty quantification.`;

    return analysis;
}

/**
 * Format report as markdown
 */
export function formatReportAsMarkdown(report: ComparisonReport): string {
    let md = `# ${report.title}\n\n`;
    md += `*Generated: ${new Date(report.generatedAt).toLocaleString()}*\n\n`;

    md += `## System Comparison\n\n`;
    md += `| Metric | ${report.systems.map(s => s.systemName).join(' | ')} |\n`;
    md += `|--------|${report.systems.map(() => '------').join('|')}|\n`;
    md += `| Accuracy | ${report.systems.map(s => `${(s.accuracy * 100).toFixed(1)}%`).join(' | ')} |\n`;
    md += `| Hallucination Rate | ${report.systems.map(s => `${(s.hallucinationRate * 100).toFixed(1)}%`).join(' | ')} |\n`;
    md += `| Avg Latency | ${report.systems.map(s => `${s.avgLatencyMs.toFixed(0)}ms`).join(' | ')} |\n`;
    md += `| P95 Latency | ${report.systems.map(s => `${s.p95LatencyMs.toFixed(0)}ms`).join(' | ')} |\n`;
    md += `| Confidence Correlation | ${report.systems.map(s => s.confidenceCorrelation.toFixed(2)).join(' | ')} |\n\n`;

    md += `## Winners\n\n`;
    md += `- **Best Accuracy**: ${report.winner.accuracy}\n`;
    md += `- **Best Latency**: ${report.winner.latency}\n`;
    md += `- **Best Calibration**: ${report.winner.calibration}\n`;
    md += `- **🏆 Overall Winner**: ${report.winner.overall}\n\n`;

    md += report.analysis;

    return md;
}

/**
 * Export index
 */
export * from "./metrics";
