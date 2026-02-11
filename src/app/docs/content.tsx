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
    BarChart3
} from "lucide-react";
import { MermaidDiagram } from "@/components/docs/mermaid-diagram";
import { DetailToggle } from "@/components/docs/detail-toggle";
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
                            <div className="font-mono text-purple-400 font-bold mb-1">POST /api/chat</div>
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
                        <div className="flex items-center gap-2 text-violet-400 mb-4">
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
                            <h4 className="text-violet-400 font-bold mb-2">Server Components</h4>
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

                    <div className="relative border-l-2 border-purple-500/30 pl-8 space-y-12 py-4">
                        <div className="relative">
                            <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-purple-500 border-4 border-black" />
                            <h4 className="text-white font-bold mb-2">1. Local Embedding Generation</h4>
                            <p className="text-sm text-neutral-400">Incoming queries are vectorized using <code>nomic-embed-text</code> directly on your hardware.</p>
                        </div>
                        <div className="relative">
                            <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-purple-500 border-4 border-black" />
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
                        {['PDF', 'DOCX', 'TXT', 'MD', 'CSV', 'XLSX', 'JSON'].map(fmt => (
                            <div key={fmt} className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center">
                                <FileJson className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
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
                        <div className="text-violet-400 uppercase tracking-tighter font-bold">chats/&#123;chatId&#125;</div>
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
                            <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <h4 className="text-purple-400 font-bold mb-3 flex items-center gap-2">
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
                                <div className="text-xs font-mono text-violet-400 bg-violet-400/10 px-2 py-1 rounded">0{i + 1}</div>
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
    }
};
