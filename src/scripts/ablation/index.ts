/**
 * AURA Ablation Study Module
 * 
 * This module provides tools for systematically evaluating
 * RAG system performance across different configurations.
 * 
 * Usage:
 *   npx ts-node src/scripts/ablation/runner.ts
 * 
 * Or import programmatically:
 *   import { runFullAblationStudy, generateReport } from "@/scripts/ablation";
 */

export * from "./metrics";
export * from "./dataset";
export * from "./runner";
