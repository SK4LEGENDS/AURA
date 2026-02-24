import {
    Cpu,
    Database,
    Layout,
    Shield,
    Zap,
    Code,
    Globe,
    Lock,
    FileJson,
    GitBranch,
    Terminal,
    Box,
    Codesandbox,
    Download,
    Layers,
    Brain,
    Search,
    MessageSquare,
    CheckCircle2,
    Eye,
    BarChart3,
    Rocket,
    BookText,
    FileText,
    FileCode2,
    FileSpreadsheet,
    Table2,
    Bot,
    Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MermaidDiagram } from "@/components/docs/mermaid-diagram";
import { DetailToggle } from "@/components/docs/detail-toggle";
import { I18nDemo } from "@/components/docs/i18n-demo";
import { Troubleshooter } from "@/components/docs/troubleshooter";
import { APISandbox } from "@/components/docs/api-sandbox";
import { AuraEngineFlow } from "@/components/docs/aura-engine-flow";
import { HighFidelityArchitecture } from "@/components/docs/high-fidelity-architecture";
import { AccuracyAnalysis } from "@/components/analytics/accuracy-analysis";
import { HallucinationAnalysis } from "@/components/analytics/hallucination-analysis";
import { LatencyAnalysis } from "@/components/analytics/latency-analysis";
import { AblationStudy } from "@/components/analytics/ablation-study";
import { ComparativeAnalysis } from "@/components/analytics/comparative-analysis";

export interface DocSection {
    id: string;
    title: string;
    description: string;
    icon: any;
    content: React.ReactNode;
}

export const docSections: Record<string, DocSection> = {
    "api-reference": {
        id: "api-reference",
        title: "API Reference",
        description: "Endpoints and integration sandbox.",
        icon: FileJson,
        content: (
            <div className="space-y-12">
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6">Interaction Sandbox</h2>
                    <APISandbox />
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-6">System Health Diagnostic</h2>
                    <Troubleshooter />
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">Core Endpoints</h2>
                    <div className="space-y-4">
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                            <div className="font-mono text-brand-primary font-bold mb-1">POST /api/chat</div>
                            <p className="text-sm text-zinc-400">Streams LLM tokens with interactive metadata block.</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                            <div className="font-mono text-blue-400 font-bold mb-1">POST /api/upload</div>
                            <p className="text-sm text-zinc-400">Processes files and indexes vectors into Firestore.</p>
                        </div>
                    </div>
                </section>
            </div>
        )
    },
    "system-overview": {
        id: "system-overview",
        title: "System Overview",
        description: "High-level architecture of the Aura platform.",
        icon: Layout,
        content: (
            <div className="space-y-6">
                <section>
                    <h2 className="text-xl font-bold text-white mb-4 border-b border-white/5 pb-2">
                        Aura System Architecture
                    </h2>
                    <HighFidelityArchitecture />
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-4 border-b border-white/5 pb-2">
                        Aura Intelligence Engine
                    </h2>

                    <AuraEngineFlow />
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-zinc-900/40 p-6 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-2 text-sky-400 mb-4">
                            <Layout className="w-5 h-5" />
                            <h3 className="text-xl font-semibold">Frontend Stack</h3>
                        </div>
                        <ul className="space-y-3 text-neutral-400 text-sm">
                            <li className="bg-white/5 p-3 rounded-xl border border-white/5">
                                <strong className="text-white block mb-0.5">Next.js 14</strong>
                                React Server Components for performance, Client Components for interactivity.
                            </li>
                            <li className="bg-white/5 p-3 rounded-xl border border-white/5">
                                <strong className="text-white block mb-0.5">Framer & Tailwind</strong>
                                Responsive-first UI with ultra-smooth transitions and system theme synchronization.
                            </li>
                        </ul>
                    </div>
                    <div className="bg-zinc-900/40 p-6 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-2 text-brand-primary mb-4">
                            <Terminal className="w-5 h-5" />
                            <h3 className="text-xl font-semibold">Backend Stack</h3>
                        </div>
                        <ul className="space-y-3 text-neutral-400 text-sm">
                            <li className="bg-white/5 p-3 rounded-xl border border-white/5">
                                <strong className="text-white block mb-0.5">Node.js API Routes</strong>
                                Serverless-ready functions located in <code>src/app/api</code>.
                            </li>
                            <li className="bg-white/5 p-3 rounded-xl border border-white/5">
                                <strong className="text-white block mb-0.5">Ollama Integration</strong>
                                Direct socket communication with local LLM instances for 100% privacy.
                            </li>
                        </ul>
                    </div>
                </section>
            </div >
        )
    },
    "create-next-app": {
        id: "create-next-app",
        title: "Create Next App",
        description: "Deep dive into the Next.js App Router implementation.",
        icon: Box,
        content: (
            <div className="space-y-8">
                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">App Router Foundation</h2>
                    <p className="text-neutral-400 mb-6">
                        Aura is built on the Next.js 14 App Router, leveraging React Server Components (RSC) for optimal initial load times and Streaming SSR for real-time AI responses.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                            <h4 className="text-brand-primary font-bold mb-2">Server Components</h4>
                            <p className="text-sm text-zinc-500">Data fetching and sensitive logic occur on the server, reducing bundle size for the client.</p>
                        </div>
                        <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                            <h4 className="text-sky-400 font-bold mb-2">Streaming Responses</h4>
                            <p className="text-sm text-zinc-500">Ollama tokens are streamed to the client using <code>ReadableStream</code> for immediate feedback.</p>
                        </div>
                    </div>
                </section>
                <section>
                    <h3 className="text-xl font-bold text-white mb-4">Directory Structure</h3>
                    <pre className="text-xs bg-black/40 p-4 rounded-xl border border-white/5 font-mono text-zinc-400">
                        {`src/
├── app/          # Next.js App Router
│   ├── api/      # Serverless function routes
│   └── docs/     # Interactive documentation system
├── components/   # Shared UI components
└── lib/          # Utilities and core logic`}
                    </pre>
                </section>
            </div>
        )
    },
    "react-ecosystem": {
        id: "react-ecosystem",
        title: "React Ecosystem",
        description: "State management and component patterns.",
        icon: Codesandbox,
        content: (
            <div className="space-y-8">
                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">Frontend Philosophy</h2>
                    <p className="text-neutral-400 mb-6">
                        We prioritize Composition over Configuration. Aura utilizes a modular component strategy that makes the UI resilient to change, focusing on atomic design principles and predictable state transitions.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <div className="flex items-start gap-4 p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors group">
                            <Zap className="w-6 h-6 text-amber-400 mt-1 group-hover:scale-110 transition-transform" />
                            <div>
                                <h4 className="text-white font-bold text-lg">Zustand State</h4>
                                <p className="text-sm text-zinc-500 leading-relaxed">Externalized, high-performance state management for UI modes, session history, and interactive drawer states with zero boilerplate.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors group">
                            <Layers className="w-6 h-6 text-cyan-400 mt-1 group-hover:scale-110 transition-transform" />
                            <div>
                                <h4 className="text-white font-bold text-lg">Framer Motion</h4>
                                <p className="text-sm text-zinc-500 leading-relaxed">Declarative, physics-based animations powering everything from simple button hovers to complex 3D architecture diagrams.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors group">
                            <Code className="w-6 h-6 text-blue-400 mt-1 group-hover:scale-110 transition-transform" />
                            <div>
                                <h4 className="text-white font-bold text-lg">Tailwind CSS</h4>
                                <p className="text-sm text-zinc-500 leading-relaxed">Utility-first styling with custom design tokens for AURA's signature high-density, dark-veil aesthetic and responsive layouts.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors group">
                            <Eye className="w-6 h-6 text-purple-400 mt-1 group-hover:scale-110 transition-transform" />
                            <div>
                                <h4 className="text-white font-bold text-lg">Lucide Icons</h4>
                                <p className="text-sm text-zinc-500 leading-relaxed">A consistent, lightweight visual language using SVG-based iconography that scales perfectly across all screen resolutions.</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-zinc-900/40 border border-white/5 rounded-2xl">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Box className="w-5 h-5 text-zinc-500" />
                            Global Context Architecture
                        </h3>
                        <p className="text-sm text-zinc-400 mb-6 font-medium">
                            AURA maintains its reactive lifecycle through a multi-layered Context API strategy, ensuring settings and localizations are synced project-wide.
                        </p>
                        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <li className="p-3 bg-black/20 rounded-xl border border-white/5">
                                <div className="text-[10px] uppercase font-bold text-zinc-600 mb-1">Localization</div>
                                <div className="text-xs text-white">I18nProvider</div>
                            </li>
                            <li className="p-3 bg-black/20 rounded-xl border border-white/5">
                                <div className="text-[10px] uppercase font-bold text-zinc-600 mb-1">Visual Settings</div>
                                <div className="text-xs text-white">ThemeProvider</div>
                            </li>
                            <li className="p-3 bg-black/20 rounded-xl border border-white/5">
                                <div className="text-[10px] uppercase font-bold text-zinc-600 mb-1">App Logic</div>
                                <div className="text-xs text-white">SettingsProvider</div>
                            </li>
                        </ul>
                    </div>
                </section>
            </div>
        )
    },
    "ai-intelligence": {
        id: "ai-intelligence",
        title: "AI Intelligence",
        description: "The RAG pipeline and reasoning engine.",
        icon: Brain,
        content: (
            <div className="space-y-8">
                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">RAG Pipeline Architecture</h2>
                    <p className="text-neutral-400 mb-8 font-medium">
                        Aura implements a custom Retrieval-Augmented Generation pipeline designed for high-precision local inference. Unlike cloud-based systems, AURA's RAG happens entirely within your private memory space.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {/* Step 1 */}
                        <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 relative group hover:border-brand-primary/30 transition-all">
                            <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Brain className="w-6 h-6 text-brand-primary" />
                            </div>
                            <div className="text-[10px] uppercase font-bold text-zinc-600 mb-2 tracking-widest">Step 01</div>
                            <h4 className="text-white font-bold mb-3">Embedding Pulse</h4>
                            <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                                Vectorizes queries via nomic-embed-text. High-performance local embedding with standard tokenization.
                            </p>
                            <div className="pt-4 border-t border-white/5 flex flex-col gap-2">
                                <span className="text-[10px] text-zinc-500 flex justify-between">Model <span className="text-blue-400">nomic-embed</span></span>
                                <span className="text-[10px] text-zinc-500 flex justify-between">Dimensions <span className="text-white">768d</span></span>
                            </div>
                        </div>

                        {/* Reasoning Engine */}
                        <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 relative group hover:border-blue-400/30 transition-all">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Zap className="w-6 h-6 text-blue-400" />
                            </div>
                            <div className="text-[10px] uppercase font-bold text-zinc-600 mb-2 tracking-widest">General Intelligence</div>
                            <h4 className="text-white font-bold mb-3">Reasoning Core</h4>
                            <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                                Powered by llama3.2. Used for zero-shot reasoning, context synthesis, and complex decision making in English contexts.
                            </p>
                            <div className="pt-4 border-t border-white/5 flex flex-col gap-2">
                                <span className="text-[10px] text-zinc-500 flex justify-between">Model <span className="text-sky-400">llama3.2</span></span>
                                <span className="text-[10px] text-zinc-500 flex justify-between">Context <span className="text-white">128k</span></span>
                            </div>
                        </div>

                        {/* Translation Engine */}
                        <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 relative group hover:border-emerald-400/30 transition-all">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Globe className="w-6 h-6 text-emerald-400" />
                            </div>
                            <div className="text-[10px] uppercase font-bold text-zinc-600 mb-2 tracking-widest">Regional Expansion</div>
                            <h4 className="text-white font-bold mb-3">Translation Hub</h4>
                            <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                                Powered by translategemma:4b. The primary engine for AURA's 50+ global languages, ensuring high-fidelity cross-lingual RAG.
                            </p>
                            <div className="pt-4 border-t border-white/5 flex flex-col gap-2">
                                <span className="text-[10px] text-zinc-500 flex justify-between">Model <span className="text-emerald-400">translategemma</span></span>
                                <span className="text-[10px] text-zinc-500 flex justify-between">Languages <span className="text-white">50+ Global</span></span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        <div className="p-6 bg-zinc-900/40 border border-white/5 rounded-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Shield className="w-12 h-12 text-emerald-400" />
                            </div>
                            <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                Hallucination Mitigation
                            </h4>
                            <p className="text-sm text-zinc-500 leading-relaxed">
                                AURA uses Negative Constraint Prompting. If the retrieved context doesn't contain the answer, the engine is hard-locked to state its lack of knowledge rather than fabricating a guess.
                            </p>
                        </div>
                        <div className="p-6 bg-zinc-900/40 border border-white/5 rounded-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Lock className="w-12 h-12 text-blue-400" />
                            </div>
                            <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                                <Database className="w-4 h-4 text-blue-400" />
                                Private Indexing
                            </h4>
                            <p className="text-sm text-zinc-500 leading-relaxed">
                                Your data is never uploaded for training. The vector store is ephemeral or local, meaning your intellectual property stays within your physical control.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <DetailToggle title="RAG Hyperparameters">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-black/30 rounded-xl border border-white/5 font-mono text-[10px]">
                                <div className="space-y-1">
                                    <div className="text-zinc-600 uppercase">Chunk Size</div>
                                    <div className="text-brand-primary">500 Tokens</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-zinc-600 uppercase">Overlap</div>
                                    <div className="text-brand-primary">50 Tokens</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-zinc-600 uppercase">Top K</div>
                                    <div className="text-brand-primary">5 Chunks</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-zinc-600 uppercase">Threshold</div>
                                    <div className="text-brand-primary">0.75 Sim</div>
                                </div>
                            </div>
                        </DetailToggle>

                        <DetailToggle title="Prompt Engineering Details">
                            <pre className="text-xs text-amber-500/80 p-4 bg-black/50 rounded-xl border border-white/5 overflow-x-auto">
                                {`export const buildRagSystemPrompt = (context, style) => \`
You are Aura, an advanced AI grounding system.
### CONTEXT DATA:
\${context}

### INSTRUCTIONS:
1. Use ONLY the provided context to answer.
2. If the answer is not in context, state: "I do not have sufficient information in the provided sources."
3. Style: \${style}.
4. Cite sources using [Source Name] format.
\`;`}
                            </pre>
                        </DetailToggle>
                    </div>

                    <div className="mt-16">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Cpu className="w-5 h-5 text-brand-primary" />
                            AURA Technical Model Zoo
                        </h3>
                        <p className="text-sm text-zinc-400 mb-8 leading-relaxed max-w-2xl">
                            AURA leverages a diverse array of specialized local models via Ollama to provide a tailored experience for every task, from high-stakes reasoning to global translation.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                {
                                    id: "llama3.2",
                                    name: "Llama 3.2",
                                    desc: "Strong all-around general model for reasoning, chat, and everyday tasks.",
                                    icon: Bot,
                                    color: "text-blue-400",
                                    bg: "bg-blue-500/10"
                                },
                                {
                                    id: "phi3:mini",
                                    name: "Phi-3 Mini",
                                    desc: "Lightweight, fast model optimized for simple reasoning and low-resource use.",
                                    icon: Zap,
                                    color: "text-green-500",
                                    bg: "bg-green-500/10"
                                },
                                {
                                    id: "llama3.2-vision",
                                    name: "Llama 3.2 Vision",
                                    desc: "Multimodal model that understands images plus text for visual reasoning.",
                                    icon: Eye,
                                    color: "text-blue-500",
                                    bg: "bg-blue-500/10"
                                },
                                {
                                    id: "qwen2.5:7b",
                                    name: "Qwen 2.5 7B",
                                    desc: "Balanced general-purpose model with solid reasoning and multilingual ability.",
                                    icon: Globe,
                                    color: "text-brand-primary",
                                    bg: "bg-orange-500/10"
                                },
                                {
                                    id: "llama3.1",
                                    name: "Llama 3.1",
                                    desc: "Reliable conversational and instruction-following model with stable performance.",
                                    icon: MessageSquare,
                                    color: "text-indigo-500",
                                    bg: "bg-indigo-500/10"
                                },
                                {
                                    id: "deepseek-r1:7b",
                                    name: "DeepSeek R1 7B",
                                    desc: "Reasoning-focused model built for logic, math, and step-by-step thinking.",
                                    icon: Brain,
                                    color: "text-red-500",
                                    bg: "bg-red-500/10"
                                },
                                {
                                    id: "qwen2.5-coder:7b",
                                    name: "Qwen 2.5 Coder 7B",
                                    desc: "Code-specialized model excelling at programming, debugging, and code generation.",
                                    icon: Code,
                                    color: "text-cyan-500",
                                    bg: "bg-cyan-500/10"
                                },
                                {
                                    id: "translategemma:4b",
                                    name: "TranslateGemma 4B",
                                    desc: "Translation-optimized model for accurate and fluent multilingual conversion.",
                                    icon: Sparkles,
                                    color: "text-emerald-500",
                                    bg: "bg-emerald-500/10"
                                }
                            ].map((model) => (
                                <div key={model.id} className="p-4 bg-zinc-900/40 border border-white/5 rounded-xl group hover:border-white/20 transition-all flex items-start gap-4">
                                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", model.bg)}>
                                        <model.icon className={cn("w-5 h-5", model.color)} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="text-white font-bold text-sm">{model.name}</h4>
                                            <code className={cn(
                                                "text-[10px] px-1.5 py-0.5 rounded-md border border-white/5",
                                                model.color,
                                                model.bg
                                            )}>
                                                {model.id}
                                            </code>
                                        </div>
                                        <p className="text-xs text-zinc-500 leading-relaxed">
                                            {model.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        )
    },
    "data-engine": {
        id: "data-engine",
        title: "Data Engine",
        description: "File ingestion and vector database schemas.",
        icon: Database,
        content: (
            <div className="space-y-8">
                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">Supported High-Fidelity Formats</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                        {[
                            { fmt: 'PDF', icon: FileText, color: 'text-red-400' },
                            { fmt: 'DOCX', icon: FileText, color: 'text-blue-400' },
                            { fmt: 'TXT', icon: FileText, color: 'text-zinc-400' },
                            { fmt: 'MD', icon: FileCode2, color: 'text-sky-400' },
                            { fmt: 'CSV', icon: FileSpreadsheet, color: 'text-emerald-400' },
                            { fmt: 'XLSX', icon: Table2, color: 'text-green-500' },
                            { fmt: 'JSON', icon: FileJson, color: 'text-amber-400' }
                        ].map(({ fmt, icon: Icon, color }) => (
                            <div key={fmt} className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center group hover:bg-white/10 transition-colors">
                                <Icon className={cn("w-5 h-5 mx-auto mb-2", color)} />
                                <span className="font-mono text-xs text-white">.{fmt}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mb-12">
                    <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                        <GitBranch className="w-5 h-5 text-zinc-500" />
                        AURA Ingestion Engine (v4)
                    </h3>
                    <AuraEngineFlow />
                </section>

                <section className="bg-zinc-900/40 p-6 rounded-2xl border border-white/5 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Database className="w-32 h-32 text-orange-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4">Vector Storage Schema</h3>
                    <div className="font-mono text-sm space-y-2">
                        <div className="text-brand-primary uppercase tracking-tighter font-bold">chats/&#123;chatId&#125;</div>
                        <div className="pl-4 text-zinc-500">├── sourceName: string <span className="text-[10px] text-zinc-700 italic">// original filename</span></div>
                        <div className="pl-4 text-zinc-500">├── indexed: boolean <span className="text-[10px] text-zinc-700 italic">// status flag</span></div>
                        <div className="pl-4 text-orange-400">└── chunks/&#123;chunkId&#125;</div>
                        <div className="pl-8 text-zinc-400">├── text: string (segment) <span className="text-[10px] text-zinc-700 italic">// 500 token limit</span></div>
                        <div className="pl-8 text-zinc-400">├── embedding: number[] <span className="text-[10px] text-zinc-700 italic">// 768-dimensional float32</span></div>
                    </div>
                </section>
            </div>
        )
    },
    "real-time-events": {
        id: "real-time-events",
        title: "Real-time Events",
        description: "WebSocket and Event-Driven architecture.",
        icon: Zap,
        content: (
            <div className="space-y-8">
                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">Live Synchronization Engine</h2>
                    <p className="text-neutral-400 mb-8 max-w-2xl leading-relaxed">
                        Aura uses a hybrid event model to ensure that document processing status and AI thought-streams are synchronized project-wide without UI glitches.
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                        <div className="bg-zinc-900/60 p-8 rounded-3xl border border-white/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-10 opacity-5">
                                <Zap className="w-48 h-48 text-brand-primary" />
                            </div>
                            <h4 className="text-white font-bold mb-6 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                                Token Streaming Architecture
                            </h4>
                            <div className="space-y-4 relative z-10">
                                <div className="p-4 bg-black/40 border border-white/5 rounded-2xl">
                                    <div className="text-[10px] font-bold text-zinc-500 uppercase mb-2">Protocol</div>
                                    <p className="text-sm text-zinc-400">HTTP/1.1 Chunked Transfer Encoding (Server-Sent Events equivalent via Edge Streams).</p>
                                </div>
                                <div className="p-4 bg-black/40 border border-white/5 rounded-2xl">
                                    <div className="text-[10px] font-bold text-zinc-500 uppercase mb-2">Backpressure</div>
                                    <p className="text-sm text-zinc-400">Adaptive buffer management ensures the UI never lags even during high-velocity AI reasoning bursts.</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-zinc-900/60 p-6 rounded-3xl border border-white/5 flex flex-col justify-center">
                            <MermaidDiagram chart={`
graph LR
    O[Ollama] -->|tokens| S[API Route]
    S -->|ReadableStream| C[Client Hook]
    C -->|UI Update| V[Virtual DOM]
    F[Firebase] -->|onSnapshot| D[Dashboards]
    D -->|Prop Sync| C
    style O fill:#3b82f622,stroke:#3b82f6
    style F fill:#f9731622,stroke:#f97316
    style S fill:#10b98122,stroke:#10b981
                            `} />
                        </div>
                    </div>

                    <div className="p-6 bg-zinc-900/40 border border-white/5 rounded-2xl">
                        <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                            <Codesandbox className="w-4 h-4 text-cyan-400" />
                            Event Types
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 bg-black/20 rounded-xl border border-white/5">
                                <div className="text-white font-bold text-xs mb-1">AI_THOUGHT</div>
                                <p className="text-[10px] text-zinc-500 leading-relaxed italic">Dispatched when the model is processing RAG context before final output.</p>
                            </div>
                            <div className="p-4 bg-black/20 rounded-xl border border-white/5">
                                <div className="text-white font-bold text-xs mb-1">METADATA_UPGRADE</div>
                                <p className="text-[10px] text-zinc-500 leading-relaxed italic">Fired when the indexer completes a percentage threshold of document embedding.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    },
    "visualizations": {
        id: "visualizations",
        title: "Visualizations",
        description: "Dynamic graph rendering systems.",
        icon: BarChart3,
        content: (
            <div className="space-y-8">
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6">Ultra-Robust Renderer (v4)</h2>
                    <p className="text-zinc-400 mb-8 leading-relaxed max-w-3xl">
                        AURA's visualization engine is built to bridge the gap between stochastic AI output and deterministic UI requirements. It utilizes a Triple-Lock Resilience pattern that ensures chart stability even under maximum cognitive load.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        <div className="bg-zinc-900/40 p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-brand-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <h4 className="text-brand-primary font-bold mb-3 flex items-center gap-2">
                                <Shield className="w-4 h-4" /> Surgery Engine v2
                            </h4>
                            <p className="text-sm text-zinc-400 leading-relaxed">
                                Automatically detects and repairs malformed JSON blocks. It can extract valid data from within conversational noise or truncated responses.
                            </p>
                            <div className="mt-4 flex items-center gap-3">
                                <span className="px-2 py-0.5 rounded bg-brand-primary/10 text-brand-primary text-[10px] font-bold uppercase">Regex-Hardened</span>
                                <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-500 text-[10px] font-bold uppercase">JSON-Safe</span>
                            </div>
                        </div>
                        <div className="bg-zinc-900/40 p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <h4 className="text-blue-400 font-bold mb-3 flex items-center gap-2">
                                <Download className="w-4 h-4" /> Vector Export Ops
                            </h4>
                            <p className="text-sm text-zinc-400 leading-relaxed">
                                Professional-grade exports for board presentations. Supports high-res PNG and lossless SVG with custom print-overrides.
                            </p>
                            <div className="mt-4 flex items-center gap-3">
                                <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase">300 DPI</span>
                                <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-500 text-[10px] font-bold uppercase">Print-Perfect</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-12">
                        <section>
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                                Neural Ablation Study
                            </h3>
                            <AblationStudy />
                        </section>

                        <section className="pt-12 border-t border-white/5">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                Latency & Processing Velocity
                            </h3>
                            <LatencyAnalysis />
                        </section>
                    </div>
                </section>

                <DetailToggle title="Mangled Data Recovery Protocol">
                    <p className="text-sm text-zinc-400 mb-4">AURA's internal fallback logic for recovering data from malformed AI responses:</p>
                    <div className="bg-black/80 p-5 rounded-xl border border-zinc-800 font-mono text-xs overflow-x-auto">
                        <div className="text-zinc-500 mb-2">// Stage 1: Greedy Extraction</div>
                        <div className="text-emerald-400">{'const pattern = /\\[\\s*\\{\\s*"label"[\\s\\S]*?\\}\\s*\\]/g;'}</div>
                        <div className="text-zinc-500 my-4">// Stage 2: Structural Repair</div>
                        <div className="text-white">
                            {`try {
    const raw = input.match(pattern)[0];
    return JSON.parse(raw.replace(/\\n/g, ' '));
} catch (e) {
    return runSurgeryEngine_v4(input); // Advanced heuristic repair
}`}
                        </div>
                    </div>
                </DetailToggle>
            </div>
        )
    },
    "workflows": {
        id: "workflows",
        title: "Workflows",
        description: "Automated task execution and pipeline orchestration.",
        icon: GitBranch,
        content: (
            <div className="space-y-8">
                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">Processing Pipeline</h2>
                    <p className="text-neutral-400 mb-6">
                        Every file uploaded to Aura goes through a multi-stage workflow to ensure perfect indexing.
                    </p>
                    <div className="space-y-4">
                        {[
                            { step: "INGEST", desc: "Binary parsing and text extraction." },
                            { step: "CHUNK", desc: "Recursive character-based splitting." },
                            { step: "EMBED", desc: "Vector generation using Nomic model." },
                            { step: "STORE", desc: "Persistent storage in Vector Database." },
                        ].map((w, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                                <div className="text-xs font-mono text-brand-primary bg-brand-primary/10 px-2 py-1 rounded">0{i + 1}</div>
                                <div>
                                    <h4 className="text-white font-bold text-sm uppercase">{w.step}</h4>
                                    <p className="text-xs text-zinc-500">{w.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        )
    },
    "development-setup": {
        id: "development-setup",
        title: "Development Setup",
        description: "Get started with local Aura development.",
        icon: Terminal,
        content: (
            <div className="space-y-8">
                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">Local Environment</h2>
                    <div className="bg-black/50 p-6 rounded-2xl border border-white/10 font-mono text-sm text-zinc-400 space-y-4">
                        <div>
                            <p className="text-white mb-1"># 1. Clone & Install</p>
                            <code className="text-sky-400">git clone aura-ai-platform<br />npm install</code>
                        </div>
                        <div>
                            <p className="text-white mb-1"># 2. Start Local LLM</p>
                            <code className="text-emerald-400">ollama run translategemma:4b</code>
                        </div>
                        <div>
                            <p className="text-white mb-1"># 3. Launch Development Server</p>
                            <code className="text-amber-400">npm run dev</code>
                        </div>
                    </div>
                </section>
                <section>
                    <h3 className="text-xl font-bold text-white mb-4">Environment Keys</h3>
                    <p className="text-sm text-zinc-500 mb-4">Required <code>.env.local</code> settings:</p>
                    <pre className="text-xs text-zinc-400 p-4 bg-white/5 rounded-xl border border-white/5">
                        {`NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
OLLAMA_BASE_URL=http://localhost:11434`}
                    </pre>
                </section>
            </div>
        )
    },
    "security": {
        id: "security",
        title: "Security",
        description: "Authentication and privacy protocols.",
        icon: Shield,
        content: (
            <div className="space-y-6">
                <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                    <h3 className="text-emerald-400 font-bold mb-2 flex items-center gap-2">
                        <Lock className="w-5 h-5" /> Local-Only Inference
                    </h3>
                    <p className="text-sm text-zinc-400">
                        Inference costs $0 and privacy is 100%. Data never leaves your hardware. We do not use external LLM providers (OpenAI, Anthropic).
                    </p>
                </div>
                <div className="p-6 bg-zinc-900/40 border border-white/5 rounded-2xl">
                    <h3 className="text-white font-bold mb-4">Access Control</h3>
                    <ul className="space-y-3">
                        <li className="flex items-center gap-3 text-sm text-zinc-400">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            Firebase Auth with Google Identity
                        </li>
                        <li className="flex items-center gap-3 text-sm text-zinc-400">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            Server-Side privileged Admin SDK
                        </li>
                        <li className="flex items-center gap-3 text-sm text-zinc-400">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            Session isolation per user workspace
                        </li>
                    </ul>
                </div>
            </div>
        )
    },
    "compliance": {
        id: "compliance",
        title: "Compliance",
        description: "Privacy and legal declarations.",
        icon: Globe,
        content: (
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                <p className="text-sm text-zinc-400 leading-relaxed italic">
                    "Aura is designed as a privacy-first research tool. All data processed remain within the user's private tenant and local inference engine. No third-party data telemetry is utilized for model training."
                </p>
            </div>
        )
    },
    "internationalization": {
        id: "internationalization",
        title: "Internationalization",
        description: "Technical implementation of AURA's multi-language architecture and RTL support.",
        icon: Globe,
        content: (
            <div className="space-y-12">
                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">Multi-Language Architecture</h2>
                    <p className="text-neutral-400 mb-8 leading-relaxed">
                        Aura's localization engine is built for scale, supporting 50+ languages with automated RTL (Right-to-Left) switching and context-aware translations powered by translategemma:4b. This system is decoupled from the component logic, allowing for zero-downtime language updates.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center mb-4">
                                <BookText className="w-5 h-5 text-brand-primary" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Dictionary-Based Routing</h3>
                            <p className="text-sm text-zinc-400 leading-relaxed">
                                Decoupled translation files (`src/dictionaries/*.json`) allow for rapid deployment of new languages without rebuilding core logic.
                            </p>
                        </div>
                        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                                <Zap className="w-5 h-5 text-blue-400" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Dynamic RTL Logic</h3>
                            <p className="text-sm text-zinc-400 leading-relaxed">
                                Automated detection and application of `dir="rtl"` and custom fonts (e.g., `font-arabic`) for seamless Arabic and Hebrew support.
                            </p>
                        </div>
                    </div>

                    <I18nDemo />

                    <div className="mt-12 space-y-8">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-brand-primary" />
                                The Deep Dive: How it Works
                            </h3>
                            <div className="prose prose-invert max-w-none">
                                <p className="text-zinc-400 leading-relaxed mb-6">
                                    The core of AURA's i18n system resides in the <code className="text-brand-primary">I18nProvider</code>. This context provider manages three distinct language states to handle complex translation workflows (like translating from a Russian source to a German output while the UI is in English).
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                    <div className="p-4 bg-zinc-900 border border-white/5 rounded-xl">
                                        <div className="text-[10px] font-bold text-zinc-500 uppercase mb-1">State 1</div>
                                        <div className="text-white font-bold">UI Language</div>
                                        <div className="text-xs text-zinc-500 mt-1">Controls headers, buttons, and navigation.</div>
                                    </div>
                                    <div className="p-4 bg-zinc-900 border border-white/5 rounded-xl">
                                        <div className="text-[10px] font-bold text-zinc-500 uppercase mb-1">State 2</div>
                                        <div className="text-white font-bold">Source Language</div>
                                        <div className="text-xs text-zinc-500 mt-1">Identifies the language of uploaded documents.</div>
                                    </div>
                                    <div className="p-4 bg-zinc-900 border border-white/5 rounded-xl">
                                        <div className="text-[10px] font-bold text-zinc-500 uppercase mb-1">State 3</div>
                                        <div className="text-white font-bold">Output Language</div>
                                        <div className="text-xs text-zinc-500 mt-1">Determines the AI's response language.</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-zinc-900/40 border border-white/10 rounded-2xl p-8">
                            <h4 className="text-white font-bold mb-4">The RTL Challenge</h4>
                            <p className="text-sm text-zinc-400 leading-relaxed italic border-l-2 border-brand-primary/50 pl-4">
                                "Handling RTL isn't just about flipping text—it's about re-orienting the user's mental model. Navigation, icons, and layout flows must all invert gracefully."
                            </p>
                            <p className="text-sm text-zinc-400 mt-4 leading-relaxed">
                                AURA solves this by injecting a global <code className="text-blue-300">dir</code> attribute into the document root. This triggers CSS logical properties like <code className="text-blue-300">ms-auto</code> instead of <code className="text-blue-300">ml-auto</code>, ensuring layouts stay intact.
                            </p>
                        </div>
                    </div>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-white mb-6">Supported Languages</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {["English", "Hindi", "Bengali", "Tamil", "Telugu", "Marathi", "Gujarati", "Kannada", "Malayalam", "Odia", "Punjabi", "Assamese", "Maithili", "Konkani", "Manipuri", "Dogri", "Kashmiri", "Sindhi", "Urdu", "Sanskrit", "Nepali", "Bodo", "Santali", "Japanese", "Chinese", "Korean", "Indonesian", "Malay", "Vietnamese", "Filipino", "French", "German", "Spanish", "Italian", "Portuguese", "Russian", "Swedish", "Norwegian", "Danish", "Finnish", "Polish", "Ukrainian", "Turkish", "Thai", "Greek", "Hungarian", "Czech", "Romanian", "Bulgarian", "Arabic"].map((lang) => (
                            <div key={lang} className="text-center p-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-medium text-zinc-400 hover:text-white hover:bg-white/10 transition-colors">
                                {lang}
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        )
    },
    "analytics": {
        id: "analytics",
        title: "Analytics & Insights",
        description: "Platform usage traceability and confidence distribution metrics.",
        icon: BarChart3,
        content: (
            <div className="space-y-8">
                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">Intelligence Analytics</h2>
                    <p className="text-neutral-400 mb-6 font-medium">
                        Aura provides deep observability into the RAG pipeline, tracking confidence scores, retrieval accuracy, and system latency in real-time.
                    </p>
                    <div className="space-y-12">
                        <ComparativeAnalysis />

                        <div className="space-y-24 pt-12 border-t border-white/5">
                            <section>
                                <div className="max-w-3xl mb-12">
                                    <h3 className="text-3xl font-bold text-white mb-4">Precision & Accuracy Matrix</h3>
                                    <p className="text-zinc-500 text-sm leading-relaxed">Detailed breakdown of retrieval performance and semantic alignment accuracy across the AURA intelligence stack.</p>
                                </div>
                                <AccuracyAnalysis />
                            </section>

                            <section className="pt-24 border-t border-white/5">
                                <div className="max-w-3xl mb-12">
                                    <h3 className="text-3xl font-bold text-white mb-4">Hallucination Resistance</h3>
                                    <p className="text-zinc-500 text-sm leading-relaxed">Visualizing AURA's zero-hallucination guarantee through deterministic source grounding and probabilistic mapping monitoring.</p>
                                </div>
                                <HallucinationAnalysis />
                            </section>
                        </div>
                    </div>
                </section>
            </div>
        )
    },
    "troubleshooting": {
        id: "troubleshooting",
        title: "Troubleshooting",
        description: "Common diagnostic procedures and system health monitoring.",
        icon: Search,
        content: (
            <div className="space-y-8">
                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">System Diagnostics</h2>
                    <div className="bg-zinc-900/60 p-6 rounded-2xl border border-white/5 space-y-6">
                        <div>
                            <h4 className="text-white font-bold mb-2">Ollama Connection Issues</h4>
                            <p className="text-sm text-zinc-400 mb-4">Ensure the Ollama server is running and accessible at `localhost:11434`.</p>
                            <code className="block bg-black/50 p-3 rounded-lg text-xs text-sky-400">curl http://localhost:11434/api/tags</code>
                        </div>
                        <div className="border-t border-white/5 pt-6">
                            <h4 className="text-white font-bold mb-2">Firestore Sync Failures</h4>
                            <p className="text-sm text-zinc-400">Check Firebase project permissions and ensuring the Admin SDK key is correctly configured in `.env.local`.</p>
                        </div>
                    </div>
                </section>
            </div>
        )
    },
    "deployment": {
        id: "deployment",
        title: "Deployment Guide",
        description: "Production-ready deployment strategies for cloud and on-premise.",
        icon: Rocket,
        content: (
            <div className="space-y-8">
                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">Production Deployment</h2>
                    <div className="space-y-4">
                        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-start gap-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                                <Box className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold mb-1">Docker Containerization</h4>
                                <p className="text-sm text-zinc-400">Deploy Aura as a multi-container stack including the Next.js app and local Ollama instance.</p>
                            </div>
                        </div>
                        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-start gap-4">
                            <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center shrink-0">
                                <Zap className="w-5 h-5 text-brand-primary" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold mb-1">Vercel & Cloud Edge</h4>
                                <p className="text-sm text-zinc-400">Optimized for Vercel deployment with edge function support for low-latency streaming.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
};
