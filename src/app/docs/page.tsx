"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    Layout,
    Cpu,
    Workflow,
    Database,
    Zap,
    CircleDashed,
    BarChart3,
    Code2,
    ShieldCheck,
    Terminal,
    Settings2,
    BookText,
    Search,
    Layers,
    Box,
    Codesandbox,
    GitBranch,
    FileText,
    Lock,
    Globe,
    Rocket
} from "lucide-react";
import { useI18n } from "@/lib/i18n-context";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/landing/footer";

export default function DocsPage() {
    const { t, isRTL } = useI18n();

    const sections = {
        platform: [
            {
                slug: "system-overview",
                title: t("docs.systemOverview"),
                icon: Layout,
                description: t("docs.systemDesc"),
                color: "blue"
            },
            {
                slug: "create-next-app",
                title: t("docs.createNextApp"),
                icon: Cpu,
                description: t("docs.createNextDesc"),
                color: "brandPrimary"
            },
            {
                slug: "react-ecosystem",
                title: t("docs.reactEcosystem"),
                icon: CircleDashed,
                description: t("docs.reactDesc"),
                color: "cyan"
            },
            {
                slug: "development-setup",
                title: t("docs.devSetup"),
                icon: Terminal,
                description: t("docs.devSetupDesc"),
                color: "green"
            }
        ],
        discover: [
            {
                slug: "ai-intelligence",
                title: t("docs.aiIntelligence"),
                icon: Zap,
                description: t("docs.aiDesc"),
                color: "yellow"
            },
            {
                slug: "data-engine",
                title: t("docs.dataEngine"),
                icon: Database,
                description: t("docs.dataDesc"),
                color: "orange"
            },
            {
                slug: "real-time-events",
                title: t("docs.realTime"),
                icon: Workflow,
                description: t("docs.realTimeDesc"),
                color: "pink"
            },
            {
                slug: "visualizations",
                title: t("docs.visualizations"),
                icon: BarChart3,
                description: t("docs.vizDesc"),
                color: "indigo"
            }
        ],
        resources: [
            {
                slug: "workflows",
                title: t("docs.workflows"),
                icon: Settings2,
                description: t("docs.workflowsDesc"),
                color: "emerald"
            },
            {
                slug: "api-reference",
                title: t("docs.apiRef"),
                icon: Code2,
                description: t("docs.apiDesc"),
                color: "rose"
            },
            {
                slug: "security",
                title: t("docs.security"),
                icon: ShieldCheck,
                description: t("docs.securityDesc"),
                color: "slate"
            },
            {
                slug: "compliance",
                title: t("docs.compliance"),
                icon: BookText,
                description: t("docs.complianceDesc"),
                color: "blue"
            }
        ],
        advanced: [
            {
                slug: "internationalization",
                title: t("docs.i18nTitle"),
                icon: Globe,
                description: t("docs.i18nDesc"),
                color: "pink"
            },
            {
                slug: "analytics",
                title: t("docs.analyticsTitle"),
                icon: BarChart3,
                description: t("docs.analyticsDesc"),
                color: "indigo"
            },
            {
                slug: "troubleshooting",
                title: t("docs.troubleshootTitle"),
                icon: Search,
                description: t("docs.troubleshootDesc"),
                color: "yellow"
            },
            {
                slug: "deployment",
                title: t("docs.deployTitle"),
                icon: Rocket,
                description: t("docs.deployDesc"),
                color: "emerald"
            }
        ]
    };

    return (
        <div className={cn(
            "min-h-screen",
            isRTL ? "font-arabic" : ""
        )} dir={isRTL ? "rtl" : "ltr"}>
            <main className="container mx-auto px-6 pt-24 pb-12">
                {/* Hero Section */}
                <div className="max-w-4xl mx-auto text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-6xl font-bold tracking-tight mb-4 bg-linear-to-b from-white to-white/40 bg-clip-text text-transparent pb-4">
                            {t("docs.title")}
                        </h1>
                        <p className="text-2xl font-light text-brand-primary/80 tracking-wide mb-8">
                            {t("docs.subtitle")}
                        </p>
                        <p className="text-lg text-zinc-500 leading-relaxed max-w-2xl mx-auto">
                            {t("docs.heroDesc")}
                        </p>
                    </motion.div>
                </div>

                {/* Section Content */}
                <div className="space-y-24">
                    {/* Platform */}
                    <section>
                        <div className="flex items-center gap-4 mb-10">
                            <h2 className="text-xs font-bold tracking-[0.2em] text-zinc-600 uppercase">Platform</h2>
                            <div className="h-px flex-1 bg-zinc-900" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {sections.platform.map((section, idx) => (
                                <Link key={section.title} href={`/docs/${section.slug}`}>
                                    <DocCard section={section} delay={idx * 0.05} />
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Discover */}
                    <section>
                        <div className="flex items-center gap-4 mb-10">
                            <h2 className="text-xs font-bold tracking-[0.2em] text-zinc-600 uppercase">Discover</h2>
                            <div className="h-px flex-1 bg-zinc-900" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {sections.discover.map((section, idx) => (
                                <Link key={section.title} href={`/docs/${section.slug}`}>
                                    <DocCard section={section} delay={idx * 0.05} />
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Resources */}
                    <section>
                        <div className="flex items-center gap-4 mb-10">
                            <h2 className="text-xs font-bold tracking-[0.2em] text-zinc-600 uppercase">Resources</h2>
                            <div className="h-px flex-1 bg-zinc-900" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {sections.resources.map((section, idx) => (
                                <Link key={section.title} href={`/docs/${section.slug}`}>
                                    <DocCard section={section} delay={idx * 0.05} />
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Enterprise & Ops */}
                    <section>
                        <div className="flex items-center gap-4 mb-10">
                            <h2 className="text-xs font-bold tracking-[0.2em] text-zinc-600 uppercase">{t("docs.advancedTitle")}</h2>
                            <div className="h-px flex-1 bg-zinc-900" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {sections.advanced.map((section, idx) => (
                                <Link key={section.title} href={`/docs/${section.slug}`}>
                                    <DocCard section={section} delay={idx * 0.05} />
                                </Link>
                            ))}
                        </div>
                    </section>
                </div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}

function DocCard({ section, delay }: { section: any; delay: number }) {
    const colorMap: Record<string, string> = {
        blue: "text-blue-400 group-hover:text-blue-300",
        brandPrimary: "text-brand-primary group-hover:text-brand-primary/80",
        cyan: "text-cyan-400 group-hover:text-cyan-300",
        green: "text-green-400 group-hover:text-green-300",
        yellow: "text-yellow-400 group-hover:text-yellow-300",
        orange: "text-orange-400 group-hover:text-orange-300",
        pink: "text-pink-400 group-hover:text-pink-300",
        indigo: "text-indigo-400 group-hover:text-indigo-300",
        emerald: "text-emerald-400 group-hover:text-emerald-300",
        rose: "text-rose-400 group-hover:text-rose-300",
        slate: "text-slate-400 group-hover:text-slate-300"
    };

    const bgColorMap: Record<string, string> = {
        blue: "group-hover:bg-blue-500/10",
        brandPrimary: "group-hover:bg-brand-primary/10",
        cyan: "group-hover:bg-cyan-500/10",
        green: "group-hover:bg-green-500/10",
        yellow: "group-hover:bg-yellow-500/10",
        orange: "group-hover:bg-orange-500/10",
        pink: "group-hover:bg-pink-500/10",
        indigo: "group-hover:bg-indigo-500/10",
        emerald: "group-hover:bg-emerald-500/10",
        rose: "group-hover:bg-rose-500/10",
        slate: "group-hover:bg-slate-500/10"
    };

    const borderColorMap: Record<string, string> = {
        blue: "group-hover:border-blue-500/30",
        brandPrimary: "group-hover:border-brand-primary/30",
        cyan: "group-hover:border-cyan-500/30",
        green: "group-hover:border-green-500/30",
        yellow: "group-hover:border-yellow-500/30",
        orange: "group-hover:border-orange-500/30",
        pink: "group-hover:border-pink-500/30",
        indigo: "group-hover:border-indigo-500/30",
        emerald: "group-hover:border-emerald-500/30",
        rose: "group-hover:border-rose-500/30",
        slate: "group-hover:border-slate-500/30"
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className="group relative p-6 bg-zinc-900/40 border border-white/5 rounded-2xl hover:bg-zinc-900/60 hover:border-white/10 transition-all cursor-pointer overflow-hidden h-full"
        >
            <div className={`absolute top-0 right-0 w-24 h-24 blur-3xl -mr-8 -mt-8 opacity-0 group-hover:opacity-100 transition-all ${bgColorMap[section.color]}`} />

            <div className="relative z-10">
                <div className={cn(
                    "w-12 h-12 rounded-xl bg-zinc-800/50 flex items-center justify-center mb-6 border border-white/5 transition-all",
                    borderColorMap[section.color]
                )}>
                    <section.icon className={cn("w-6 h-6 transition-all", colorMap[section.color])} />
                </div>

                <h3 className="text-lg font-semibold text-white mb-2 group-hover:translate-x-1 transition-transform">
                    {section.title}
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed group-hover:text-zinc-400 transition-colors">
                    {section.description}
                </p>
            </div>
        </motion.div>
    );
}
