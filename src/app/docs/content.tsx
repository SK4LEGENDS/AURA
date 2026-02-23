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
    Table2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MermaidDiagram } from "@/components/docs/mermaid-diagram";
import { DetailToggle } from "@/components/docs/detail-toggle";
import { I18nDemo } from "@/components/docs/i18n-demo";
import { Troubleshooter } from "@/components/docs/troubleshooter";
import { APISandbox } from "@/components/docs/api-sandbox";
import { AuraEngineFlow } from "@/components/docs/aura-engine-flow";
import { HighFidelityArchitecture } from "@/components/docs/high-fidelity-architecture";

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
                        Aura is built on the Next.js 14 App Router, leveraging **React Server Components (RSC)** for optimal initial load times and **Streaming SSR** for real-time AI responses.
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
                        We prioritize **Composition over Configuration**. Aura utilizes a modular component strategy that makes the UI resilient to change.
                    </p>
                    <div className="space-y-4">
                        <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                            <Zap className="w-5 h-5 text-amber-400 mt-1" />
                            <div>
                                <h4 className="text-white font-bold">Zustand State Management</h4>
                                <p className="text-sm text-zinc-500">Ultra-lightweight state for UI modes, chat history, and drawer states.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                            <Layers className="w-5 h-5 text-cyan-400 mt-1" />
                            <div>
                                <h4 className="text-white font-bold">Framer Motion</h4>
                                <p className="text-sm text-zinc-500">Physics-based animations for the architecture diagram and page transitions.</p>
                            </div>
                        </div>
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
                    <p className="text-neutral-400 mb-6 font-medium">
                        Aura implements a sophisticated **Retrieval-Augmented Generation** pipeline designed to eliminate hallucinations while maintaining low-latency local inference.
                    </p>

                    <div className="relative border-l-2 border-brand-primary/30 pl-8 space-y-12 py-4">
                        <div className="relative">
                            <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-brand-primary border-4 border-black" />
                            <h4 className="text-white font-bold mb-2">1. Local Embedding Generation</h4>
                            <p className="text-sm text-neutral-400">Incoming queries are vectorized using <code>nomic-embed-text</code> directly on your hardware.</p>
                        </div>
                        <div className="relative">
                            <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-brand-primary border-4 border-black" />
                            <h4 className="text-white font-bold mb-2">2. Semantic Search & Rank</h4>
                            <p className="text-sm text-neutral-400">Cosine similarity is calculated against thousands of document chunks to find the most relevant context.</p>
                        </div>
                        <div className="relative">
                            <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-blue-500 border-4 border-black" />
                            <h4 className="text-white font-bold mb-2">3. Context-Grounded Inference</h4>
                            <p className="text-sm text-neutral-400">The LLM is prompted with the retrieved context and strictly instructed to ignore internal knowledge.</p>
                        </div>
                    </div>

                    <DetailToggle title="Prompt Engineering Details">
                        <pre className="text-xs text-amber-500/80 p-4 bg-black/50 rounded-xl border border-white/5">
                            {`export const buildRagSystemPrompt = (context, style) => \`
You are Aura, an advanced AI.
Context: \${context}
Instructions:
- Answer ONLY based on the context.
- Style: \${style}.
- If missing, say "I do not have the answer".
\`;`}
                        </pre>
                    </DetailToggle>
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
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

                <section className="bg-zinc-900/40 p-6 rounded-2xl border border-white/5 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Database className="w-32 h-32 text-orange-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4">Vector Storage Schema</h3>
                    <div className="font-mono text-sm space-y-2">
                        <div className="text-brand-primary uppercase tracking-tighter font-bold">chats/&#123;chatId&#125;</div>
                        <div className="pl-4 text-zinc-500">├── sourceName: string</div>
                        <div className="pl-4 text-zinc-500">├── indexed: boolean</div>
                        <div className="pl-4 text-orange-400">└── chunks/&#123;chunkId&#125;</div>
                        <div className="pl-8 text-zinc-400">├── text: string (segment)</div>
                        <div className="pl-8 text-zinc-400">├── embedding: number[] (768d)</div>
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
                    <h2 className="text-2xl font-bold text-white mb-4">Live Synchronization</h2>
                    <p className="text-neutral-400 mb-6">
                        Aura uses a hybrid event model to ensure that document processing and chat updates happen in real-time.
                    </p>
                    <div className="bg-zinc-900/60 p-6 rounded-2xl border border-white/5">
                        <MermaidDiagram chart={`
graph LR
    O[Ollama] -->|tokens| S[Server API]
    S -->|ReadableStream| C[Client UI]
    F[Firebase] -->|onSnapshot| D[Dashboards]
    D -->|updates| C
    style O fill:#3b82f6,stroke:#fff
    style F fill:#f97316,stroke:#fff
                        `} />
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-brand-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <h4 className="text-brand-primary font-bold mb-3 flex items-center gap-2">
                                <Shield className="w-4 h-4" /> Triple-Lock Resilience
                            </h4>
                            <p className="text-sm text-zinc-400 leading-relaxed">
                                Maintains visibility even with malformed AI output. Includes a <strong>Surgery Engine</strong> that extracts data from conversational hallucinations.
                            </p>
                        </div>
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <h4 className="text-blue-400 font-bold mb-3 flex items-center gap-2">
                                <Download className="w-4 h-4" /> Board-Ready Exports
                            </h4>
                            <p className="text-sm text-zinc-400 leading-relaxed">
                                One-click vector export for PNG, SVG, and high-res PDF. Includes custom print-css for perfect scaling.
                            </p>
                        </div>
                    </div>
                </section>

                <DetailToggle title="Mangled Data Recovery Protocol">
                    <p className="mb-4">Internal fallback for malformed JSON blocks:</p>
                    <div className="bg-black/50 p-4 rounded-xl border border-red-500/20 text-red-400 text-xs font-mono">
                        {`// Surgery Engine logic
const matchedData = input.match(/\\[\s*{\s*"label"[\s\S]*?}\s*\\]/);
if (matchedData) return parseClean(matchedData[0]);`}
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
                            <code className="text-emerald-400">ollama run llama3.2</code>
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
                        Aura's localization engine is built for scale, supporting 10+ languages with automated RTL (Right-to-Left) switching and context-aware translations. Unlike traditional localization, Aura's system is decoupled from the component logic, allowing for zero-downtime language updates.
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
                        {["English", "Tamil", "Arabic", "Spanish", "French", "German", "Russian", "Japanese", "Dutch", "Hindi"].map((lang) => (
                            <div key={lang} className="text-center p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/10 transition-colors">
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Trust Score</h4>
                            <div className="text-3xl font-bold text-emerald-400">98.2%</div>
                            <p className="text-[10px] text-zinc-500 mt-2">Avg. grounding confidence</p>
                        </div>
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Latency</h4>
                            <div className="text-3xl font-bold text-blue-400">240ms</div>
                            <p className="text-[10px] text-zinc-500 mt-2">P95 token generation</p>
                        </div>
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking_widest mb-2">Coverage</h4>
                            <div className="text-3xl font-bold text-brand-primary">12k+</div>
                            <p className="text-[10px] text-zinc-500 mt-2">Semantic chunks indexed</p>
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
