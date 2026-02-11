"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Activity,
    CheckCircle2,
    XCircle,
    RefreshCcw,
    AlertTriangle,
    Terminal,
    ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DiagResult {
    ollamaConnected: boolean;
    models: {
        llama32: boolean;
        nomic: boolean;
    };
    error: string | null;
}

export function Troubleshooter() {
    const [status, setStatus] = useState<'idle' | 'checking' | 'done'>('idle');
    const [result, setResult] = useState<DiagResult | null>(null);

    const runDiagnostics = async () => {
        setStatus('checking');
        try {
            const res = await fetch('/api/diagnostics/ollama');
            const data = await res.json();
            setResult(data);
        } catch (err) {
            setResult({
                ollamaConnected: false,
                models: { llama32: false, nomic: false },
                error: "FETCH_FAILED"
            });
        }
        setTimeout(() => setStatus('done'), 1000); // UI breathing room
    };

    return (
        <div className="bg-zinc-900/50 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-white mb-1">Ollama Troubleshooter</h3>
                    <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Local Infrastructure Diagnostic</p>
                </div>
                <button
                    onClick={runDiagnostics}
                    disabled={status === 'checking'}
                    className={cn(
                        "flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all",
                        status === 'checking'
                            ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                            : "bg-white text-black hover:scale-105 active:scale-95"
                    )}
                >
                    {status === 'checking' ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
                    {status === 'checking' ? "Diagnosing..." : "Run System Check"}
                </button>
            </div>

            <div className="p-8 space-y-6">
                <AnimatePresence mode="wait">
                    {status === 'idle' && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="text-center py-12"
                        >
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                                <Terminal className="w-8 h-8 text-zinc-600" />
                            </div>
                            <p className="text-zinc-400 text-sm max-w-xs mx-auto leading-relaxed">
                                Click the button above to verify if your local AI environment is correctly configured.
                            </p>
                        </motion.div>
                    )}

                    {status === 'checking' && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="space-y-4 py-8"
                        >
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-4 bg-white/5 rounded animate-pulse w-full" />
                            ))}
                        </motion.div>
                    )}

                    {status === 'done' && result && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            {/* Step 1: Connectivity */}
                            <DiagItem
                                label="Ollama Server Status"
                                description={result.ollamaConnected ? "Connected to local instance" : "Local instance unreachable"}
                                success={result.ollamaConnected}
                            />

                            {/* Step 2: Llama Model */}
                            <DiagItem
                                label="Generative Model (llama3.2)"
                                description={result.models.llama32 ? "Model ready for inference" : "Model not found locally"}
                                success={result.models.llama32}
                            />

                            {/* Step 3: Nomic Model */}
                            <DiagItem
                                label="Embedding Model (nomic-embed-text)"
                                description={result.models.nomic ? "Ready for vector generation" : "Model not found locally"}
                                success={result.models.nomic}
                            />

                            {/* Recommendations */}
                            {(!result.ollamaConnected || !result.models.llama32 || !result.models.nomic) && (
                                <div className="mt-8 p-6 bg-red-500/10 border border-red-500/20 rounded-2xl">
                                    <div className="flex items-center gap-2 text-red-400 mb-4">
                                        <AlertTriangle className="w-5 h-5" />
                                        <span className="font-bold text-sm uppercase">Required Actions</span>
                                    </div>
                                    <div className="space-y-4 text-sm">
                                        {!result.ollamaConnected && (
                                            <div className="text-zinc-400">
                                                <p className="mb-2">1. Ensure Ollama is running on your machine.</p>
                                                <div className="bg-black/40 p-3 rounded border border-white/5 font-mono text-zinc-300">ollama serve</div>
                                            </div>
                                        )}
                                        {(!result.models.llama32 || !result.models.nomic) && (
                                            <div className="text-zinc-400">
                                                <p className="mb-2">2. Install missing models via terminal:</p>
                                                <div className="bg-black/40 p-3 rounded border border-white/5 font-mono text-zinc-300 space-y-1">
                                                    {!result.models.llama32 && <div>ollama pull llama3.2</div>}
                                                    {!result.models.nomic && <div>ollama pull nomic-embed-text</div>}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {result.ollamaConnected && result.models.llama32 && result.models.nomic && (
                                <div className="mt-8 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center">
                                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                                    <p className="text-emerald-400 font-bold">System Online & Fully Compatible</p>
                                    <p className="text-emerald-500/60 text-xs mt-1">You are ready to chat with 100% privacy.</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function DiagItem({ label, description, success }: { label: string, description: string, success: boolean }) {
    return (
        <div className="flex items-center gap-4 group">
            <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center border transition-colors",
                success ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"
            )}>
                {success ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            </div>
            <div>
                <h4 className="text-sm font-bold text-white group-hover:text-zinc-300 transition-colors">{label}</h4>
                <p className="text-xs text-zinc-500">{description}</p>
            </div>
        </div>
    );
}
