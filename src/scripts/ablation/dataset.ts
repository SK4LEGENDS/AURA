/**
 * Ablation Study - Dataset Module
 * 
 * Manages test datasets for ablation experiments
 */

import { TestCase } from "./metrics";

/**
 * Sample test dataset structure
 * This would be populated with real test cases
 */
export const SAMPLE_TEST_DATASET: TestCase[] = [
    // Factual questions (should have direct answers in context)
    {
        id: "factual_001",
        question: "What was the total revenue in Q3?",
        documentId: "financial_report_2024.pdf",
        groundTruthAnswer: "The total revenue in Q3 was $4.2 million.",
        relevantChunkIds: ["chunk_45", "chunk_46"],
        category: "factual",
        difficulty: "easy",
    },
    {
        id: "factual_002",
        question: "Who is the CEO of the company?",
        documentId: "company_overview.pdf",
        groundTruthAnswer: "John Smith is the CEO of the company.",
        relevantChunkIds: ["chunk_12"],
        category: "factual",
        difficulty: "easy",
    },

    // Comparative questions
    {
        id: "comparative_001",
        question: "How does Q3 revenue compare to Q2?",
        documentId: "financial_report_2024.pdf",
        groundTruthAnswer: "Q3 revenue ($4.2M) was 15% higher than Q2 revenue ($3.65M).",
        relevantChunkIds: ["chunk_45", "chunk_32"],
        category: "comparative",
        difficulty: "medium",
    },

    // Analytical questions
    {
        id: "analytical_001",
        question: "What are the main factors contributing to revenue growth?",
        documentId: "financial_report_2024.pdf",
        groundTruthAnswer: "The main factors are increased market share, new product launches, and expanded distribution.",
        relevantChunkIds: ["chunk_48", "chunk_49", "chunk_50"],
        category: "analytical",
        difficulty: "hard",
    },

    // Numerical questions
    {
        id: "numerical_001",
        question: "What is the year-over-year growth rate?",
        documentId: "financial_report_2024.pdf",
        groundTruthAnswer: "The year-over-year growth rate is 23%.",
        relevantChunkIds: ["chunk_52"],
        category: "numerical",
        difficulty: "easy",
    },

    // Out of scope questions (should return "I don't know")
    {
        id: "oos_001",
        question: "What is the weather forecast for tomorrow?",
        documentId: "financial_report_2024.pdf",
        groundTruthAnswer: "I do not have the answer",
        relevantChunkIds: [],
        category: "out_of_scope",
        difficulty: "easy",
    },
    {
        id: "oos_002",
        question: "What is the company's policy on remote work?",
        documentId: "financial_report_2024.pdf",
        groundTruthAnswer: "I do not have the answer",
        relevantChunkIds: [],
        category: "out_of_scope",
        difficulty: "easy",
    },
];

/**
 * Load test dataset from JSON file
 */
export async function loadTestDataset(path: string): Promise<TestCase[]> {
    try {
        const fs = await import("fs/promises");
        const content = await fs.readFile(path, "utf-8");
        return JSON.parse(content) as TestCase[];
    } catch (error) {
        console.error("Error loading test dataset:", error);
        return [];
    }
}

/**
 * Save test dataset to JSON file
 */
export async function saveTestDataset(path: string, dataset: TestCase[]): Promise<void> {
    const fs = await import("fs/promises");
    await fs.writeFile(path, JSON.stringify(dataset, null, 2));
}

/**
 * Filter test cases by category
 */
export function filterByCategory(
    dataset: TestCase[],
    category: TestCase["category"]
): TestCase[] {
    return dataset.filter(tc => tc.category === category);
}

/**
 * Filter test cases by difficulty
 */
export function filterByDifficulty(
    dataset: TestCase[],
    difficulty: TestCase["difficulty"]
): TestCase[] {
    return dataset.filter(tc => tc.difficulty === difficulty);
}

/**
 * Get category statistics
 */
export function getCategoryStats(dataset: TestCase[]): Record<string, number> {
    const stats: Record<string, number> = {};
    for (const tc of dataset) {
        stats[tc.category] = (stats[tc.category] || 0) + 1;
    }
    return stats;
}

/**
 * Validate test case structure
 */
export function validateTestCase(tc: TestCase): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!tc.id) errors.push("Missing id");
    if (!tc.question) errors.push("Missing question");
    if (!tc.documentId) errors.push("Missing documentId");
    if (!tc.groundTruthAnswer) errors.push("Missing groundTruthAnswer");
    if (!Array.isArray(tc.relevantChunkIds)) errors.push("relevantChunkIds must be an array");
    if (!["factual", "comparative", "analytical", "numerical", "out_of_scope"].includes(tc.category)) {
        errors.push("Invalid category");
    }
    if (!["easy", "medium", "hard"].includes(tc.difficulty)) {
        errors.push("Invalid difficulty");
    }

    return { valid: errors.length === 0, errors };
}
