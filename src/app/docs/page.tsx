"use client";

import { motion } from "framer-motion";
import {
    Layers,
    Box,
    Shield,
    Cpu,
    Database,
    Codesandbox,
    Zap,
    FileText,
    GitBranch,
    Terminal,
    Layout,
    Lock
} from "lucide-react";
import Link from "next/link";

export default function DocsPage() {
    return (
        <div className="container mx-auto px-4 max-w-7xl">
            {/* Hero Section */}
            <div className="mb-20 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl"
                >
                    <span className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                        Aura Architecture
                    </span>
                    <br />
                    <span className="text-3xl md:text-5xl text-violet-400/90 font-light mt-2 block">
                        Technical Documentation
                    </span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mx-auto max-w-2xl text-lg text-neutral-400"
                >
                    Comprehensive technical reference for the Aura AI Platform. Explore the system architecture, core components, and developer guides.
                </motion.p>
            </div>

            {/* Platform Section */}
            <div className="mb-16">
                <SectionHeader title="PLATFORM" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <DocCard
                        icon={<Layout className="h-6 w-6 text-violet-400" />}
                        title="System Overview"
                        description="High-level architecture of the Aura platform, data flow, and core interactions."
                        slug="system-overview"
                    />
                    <DocCard
                        icon={<Box className="h-6 w-6 text-sky-400" />}
                        title="Create Next App"
                        description="Deep dive into the Next.js App Router implementation and server components."
                        slug="create-next-app"
                    />
                    <DocCard
                        icon={<Codesandbox className="h-6 w-6 text-cyan-400" />}
                        title="React Ecosystem"
                        description="Component patterns, custom hooks, and state management strategies."
                        slug="react-ecosystem"
                    />
                    <DocCard
                        icon={<Terminal className="h-6 w-6 text-amber-400" />}
                        title="Development Setup"
                        description="Environment configuration, dependency management, and build scripts."
                        slug="development-setup"
                    />
                </div>
            </div>

            {/* Core Features Section */}
            <div className="mb-16">
                <SectionHeader title="DISCOVER" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <DocCard
                        icon={<Cpu className="h-6 w-6 text-pink-400" />}
                        title="AI Intelligence"
                        description="Technical breakdown of the RAG pipeline, LLM context handling, and prompt engineering."
                        slug="ai-intelligence"
                    />
                    <DocCard
                        icon={<Database className="h-6 w-6 text-violet-400" />}
                        title="Data Engine"
                        description="File ingestion systems, vector database schemas, and embedding generation."
                        slug="data-engine"
                    />
                    <DocCard
                        icon={<Zap className="h-6 w-6 text-yellow-400" />}
                        title="Real-time Events"
                        description="WebSocket connections, server-sent events, and live updates."
                        slug="real-time-events"
                    />
                    <DocCard
                        icon={<Layers className="h-6 w-6 text-cyan-400" />}
                        title="Visualizations"
                        description="Dynamic graph rendering, chart generation, and canvas interactions."
                        slug="visualizations"
                    />
                </div>
            </div>

            {/* Automate Section */}
            <div className="mb-16">
                <SectionHeader title="AUTOMATE" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <DocCard
                        icon={<GitBranch className="h-6 w-6 text-orange-400" />}
                        title="Workflows"
                        description="Automated task execution and pipeline orchestration."
                        slug="workflows"
                    />
                    <DocCard
                        icon={<FileText className="h-6 w-6 text-teal-400" />}
                        title="API Reference"
                        description="Internal API endpoints, request signatures, and response types."
                        slug="api-reference"
                    />
                    <DocCard
                        icon={<Lock className="h-6 w-6 text-red-400" />}
                        title="Security"
                        description="Authentication flows, RBAC, and data encryption standards."
                        slug="security"
                    />
                    <DocCard
                        icon={<Shield className="h-6 w-6 text-green-400" />}
                        title="Compliance"
                        description="Data handling policies and regulatory compliance features."
                        slug="compliance"
                    />
                </div>
            </div>
        </div>
    );
}

function SectionHeader({ title }: { title: string }) {
    return (
        <div className="mb-6 flex items-center gap-4">
            <h2 className="text-sm font-bold tracking-widest text-violet-400 uppercase">
                {title}
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-violet-500/20 to-transparent" />
        </div>
    );
}

function DocCard({ icon, title, description, slug }: { icon: React.ReactNode; title: string; description: string; slug: string }) {
    return (
        <Link href={`/docs/${slug}`}>
            <motion.div
                whileHover={{ y: -5 }}
                className="group relative overflow-hidden rounded-xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-violet-500/30 hover:bg-white/10 hover:shadow-2xl hover:shadow-violet-500/10 cursor-pointer h-full"
            >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-black/20 ring-1 ring-white/10 transition-all group-hover:bg-violet-500/10 group-hover:ring-violet-500/20">
                    {icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white group-hover:text-violet-300 transition-colors">
                    {title}
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                    {description}
                </p>

                <div className="absolute bottom-0 left-0 h-1 w-0 bg-violet-500 transition-all duration-300 group-hover:w-full" />
            </motion.div>
        </Link>
    );
}

