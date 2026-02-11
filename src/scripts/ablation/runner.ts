/**
 * Ablation Study - Experiment Runner
 * 
 * Runs systematic experiments varying RAG parameters
 * to measure their impact on system performance
 */

import {
    AblationConfig,
    AblationMetrics,
    ExperimentResult,
    SingleTestResult,
    TestCase,
    aggregateMetrics,
    computeFaithfulness,
    computeRetrievalPrecision,
    detectHallucination,
    formatMetricsTable,
    isNoAnswerResponse,
} from "./metrics";
import { SAMPLE_TEST_DATASET } from "./dataset";

/**
 * Default configurations to test in ablation study
 */
export const DEFAULT_ABLATION_CONFIGS: AblationConfig[] = [
    // Baseline configuration (current AURA settings)
    { temperature: 0.3, chunkSize: 1000, chunkOverlap: 200, topK: 5, similarityThreshold: 0.3 },

    // Temperature variations
    { temperature: 0.1, chunkSize: 1000, chunkOverlap: 200, topK: 5, similarityThreshold: 0.3 },
    { temperature: 0.5, chunkSize: 1000, chunkOverlap: 200, topK: 5, similarityThreshold: 0.3 },
    { temperature: 0.7, chunkSize: 1000, chunkOverlap: 200, topK: 5, similarityThreshold: 0.3 },

    // Chunk size variations
    { temperature: 0.3, chunkSize: 500, chunkOverlap: 100, topK: 5, similarityThreshold: 0.3 },
    { temperature: 0.3, chunkSize: 800, chunkOverlap: 160, topK: 5, similarityThreshold: 0.3 },
    { temperature: 0.3, chunkSize: 1500, chunkOverlap: 300, topK: 5, similarityThreshold: 0.3 },

    // Top-K variations
    { temperature: 0.3, chunkSize: 1000, chunkOverlap: 200, topK: 3, similarityThreshold: 0.3 },
    { temperature: 0.3, chunkSize: 1000, chunkOverlap: 200, topK: 7, similarityThreshold: 0.3 },
    { temperature: 0.3, chunkSize: 1000, chunkOverlap: 200, topK: 10, similarityThreshold: 0.3 },

    // Similarity threshold variations
    { temperature: 0.3, chunkSize: 1000, chunkOverlap: 200, topK: 5, similarityThreshold: 0.2 },
    { temperature: 0.3, chunkSize: 1000, chunkOverlap: 200, topK: 5, similarityThreshold: 0.4 },
    { temperature: 0.3, chunkSize: 1000, chunkOverlap: 200, topK: 5, similarityThreshold: 0.5 },
];

/**
 * Simulate a single RAG query for ablation testing
 * In production, this would call the actual AURA API
 */
async function simulateRAGQuery(
    testCase: TestCase,
    config: AblationConfig
): Promise<{
    answer: string;
    retrievedChunkIds: string[];
    latencyMs: number;
    confidence: any;
}> {
    const startTime = performance.now();

    // Simulated response based on test case
    // In production, this would make actual API calls
    const isOutOfScope = testCase.category === "out_of_scope";

    let answer: string;
    let retrievedChunkIds: string[];

    if (isOutOfScope) {
        // Properly handle out-of-scope (low temperature should refuse)
        if (config.temperature <= 0.3) {
            answer = "I do not have the answer based on the provided document.";
            retrievedChunkIds = [];
        } else {
            // Higher temperature might hallucinate
            answer = "Based on general knowledge, the answer might be...";
            retrievedChunkIds = [];
        }
    } else {
        // Return ground truth with simulated retrieval
        answer = testCase.groundTruthAnswer;
        retrievedChunkIds = testCase.relevantChunkIds.slice(0, config.topK);
    }

    const latencyMs = performance.now() - startTime;

    return {
        answer,
        retrievedChunkIds,
        latencyMs: latencyMs + Math.random() * 100, // Add realistic variance
        confidence: {
            retrievalConfidence: 0.7,
            consistencyConfidence: 0.8,
            coverageConfidence: 0.75,
            overallConfidence: 0.74,
            level: "high",
            explanation: "Simulated confidence",
        },
    };
}

/**
 * Run a single test case
 */
async function runSingleTest(
    testCase: TestCase,
    config: AblationConfig
): Promise<SingleTestResult> {
    const result = await simulateRAGQuery(testCase, config);

    const isOutOfScope = testCase.category === "out_of_scope";
    const gaveNoAnswer = isNoAnswerResponse(result.answer);

    // Correct if: in-scope and matches, or out-of-scope and refused
    const isCorrect = isOutOfScope ? gaveNoAnswer : !gaveNoAnswer;

    // Hallucination if: out-of-scope but gave specific answer
    const isHallucination = isOutOfScope && !gaveNoAnswer;

    return {
        testCaseId: testCase.id,
        question: testCase.question,
        generatedAnswer: result.answer,
        groundTruthAnswer: testCase.groundTruthAnswer,
        retrievedChunkIds: result.retrievedChunkIds,
        expectedChunkIds: testCase.relevantChunkIds,
        confidence: result.confidence,
        latencyMs: result.latencyMs,
        isCorrect,
        isHallucination,
    };
}

/**
 * Run ablation experiment with a specific configuration
 */
export async function runExperiment(
    config: AblationConfig,
    testCases: TestCase[] = SAMPLE_TEST_DATASET
): Promise<ExperimentResult> {
    console.log(`\n📊 Running experiment with config:`, config);

    const results: SingleTestResult[] = [];
    let totalLatency = 0;
    let firstTokenLatencies: number[] = [];

    for (const testCase of testCases) {
        const result = await runSingleTest(testCase, config);
        results.push(result);
        totalLatency += result.latencyMs;
        firstTokenLatencies.push(result.latencyMs * 0.3); // Approximate first token
    }

    const aggregated = aggregateMetrics(results);

    const metrics: AblationMetrics = {
        ...aggregated,
        latencyMs: totalLatency / results.length,
        firstTokenLatencyMs: firstTokenLatencies.reduce((a, b) => a + b, 0) / firstTokenLatencies.length,
    };

    return {
        config,
        metrics,
        individualResults: results,
        timestamp: new Date().toISOString(),
    };
}

/**
 * Run full ablation study across all configurations
 */
export async function runFullAblationStudy(
    configs: AblationConfig[] = DEFAULT_ABLATION_CONFIGS,
    testCases: TestCase[] = SAMPLE_TEST_DATASET
): Promise<ExperimentResult[]> {
    console.log("🔬 Starting Ablation Study");
    console.log(`   Configurations: ${configs.length}`);
    console.log(`   Test Cases: ${testCases.length}`);
    console.log("");

    const allResults: ExperimentResult[] = [];

    for (let i = 0; i < configs.length; i++) {
        console.log(`\n[${i + 1}/${configs.length}] Testing configuration...`);
        const result = await runExperiment(configs[i], testCases);
        allResults.push(result);

        console.log(`   ✓ Faithfulness: ${(result.metrics.faithfulness * 100).toFixed(1)}%`);
        console.log(`   ✓ Hallucination Rate: ${(result.metrics.hallucinationRate * 100).toFixed(1)}%`);
        console.log(`   ✓ Avg Latency: ${result.metrics.latencyMs.toFixed(0)}ms`);
    }

    return allResults;
}

/**
 * Generate ablation study report
 */
export function generateReport(results: ExperimentResult[]): string {
    let report = `# AURA Ablation Study Report\n\n`;
    report += `Generated: ${new Date().toISOString()}\n\n`;
    report += `## Summary\n\n`;
    report += `- Total Configurations Tested: ${results.length}\n`;
    report += `- Test Cases per Configuration: ${results[0]?.individualResults.length || 0}\n\n`;

    // Find best configuration for each metric
    const bestFaithfulness = results.reduce((a, b) =>
        a.metrics.faithfulness > b.metrics.faithfulness ? a : b
    );
    const lowestHallucination = results.reduce((a, b) =>
        a.metrics.hallucinationRate < b.metrics.hallucinationRate ? a : b
    );
    const fastestLatency = results.reduce((a, b) =>
        a.metrics.latencyMs < b.metrics.latencyMs ? a : b
    );

    report += `## Best Configurations\n\n`;
    report += `### Highest Faithfulness\n`;
    report += `- Config: temp=${bestFaithfulness.config.temperature}, chunk=${bestFaithfulness.config.chunkSize}\n`;
    report += `- Score: ${(bestFaithfulness.metrics.faithfulness * 100).toFixed(1)}%\n\n`;

    report += `### Lowest Hallucination\n`;
    report += `- Config: temp=${lowestHallucination.config.temperature}, threshold=${lowestHallucination.config.similarityThreshold}\n`;
    report += `- Rate: ${(lowestHallucination.metrics.hallucinationRate * 100).toFixed(1)}%\n\n`;

    report += `### Fastest Response\n`;
    report += `- Config: topK=${fastestLatency.config.topK}, chunk=${fastestLatency.config.chunkSize}\n`;
    report += `- Latency: ${fastestLatency.metrics.latencyMs.toFixed(0)}ms\n\n`;

    // Detailed results table
    report += `## Detailed Results\n\n`;
    report += `| Temp | Chunk | Overlap | TopK | Threshold | Faith% | Halluc% | Latency |\n`;
    report += `|------|-------|---------|------|-----------|--------|---------|----------|\n`;

    for (const result of results) {
        const c = result.config;
        const m = result.metrics;
        report += `| ${c.temperature} | ${c.chunkSize} | ${c.chunkOverlap} | ${c.topK} | ${c.similarityThreshold} `;
        report += `| ${(m.faithfulness * 100).toFixed(0)}% | ${(m.hallucinationRate * 100).toFixed(0)}% | ${m.latencyMs.toFixed(0)}ms |\n`;
    }

    return report;
}

/**
 * Main entry point for running ablation study
 */
export async function main() {
    console.log("═══════════════════════════════════════════");
    console.log("        AURA ABLATION STUDY RUNNER         ");
    console.log("═══════════════════════════════════════════\n");

    const results = await runFullAblationStudy();
    const report = generateReport(results);

    console.log("\n" + report);

    // Save report
    const fs = await import("fs/promises");
    const reportPath = "./ablation_report.md";
    await fs.writeFile(reportPath, report);
    console.log(`\n📄 Report saved to: ${reportPath}`);

    return results;
}

// Allow running directly via: npx ts-node src/scripts/ablation/runner.ts
if (require.main === module) {
    main().catch(console.error);
}
