"use client";

import { use, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Calendar,
    ArrowLeft,
    Share2,
    CalendarDays,
    Tag,
    Clock,
    User,
    Shield,
    Link2,
    Check,
    Box
} from "lucide-react";
import { useI18n } from "@/lib/i18n-context";
import { cn } from "@/lib/utils";

export default function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { t, isRTL } = useI18n();
    const { slug } = use(params);
    const [copied, setCopied] = useState(false);

    // Map slug to translation keys
    const newsMap: Record<string, string> = {
        "v1-2-4-release": "v124",
        "llama-3-2-integration": "llama",
        "global-language-expansion": "global"
    };

    const key = newsMap[slug];

    if (!key) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4 font-playfair">Release Not Found</h1>
                    <Link href="/news" className="text-brand-primary hover:underline">Back to Newsroom</Link>
                </div>
            </div>
        );
    }

    const title = t(`news.${key}.title`);
    const date = t(`news.${key}.date`);
    const category = t(`news.${key}.category`);
    const content = t(`news.${key}.content`);
    const summary = t(`news.${key}.summary`);

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={cn(
            "min-h-screen bg-[#0a0a0a]",
            isRTL ? "font-arabic" : ""
        )} dir={isRTL ? "rtl" : "ltr"}>
            <main className="container mx-auto px-6 pt-32 pb-24 relative z-10">
                <div className="max-w-7xl mx-auto">
                    {/* Back Link */}
                    <Link
                        href="/news"
                        className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-20 group"
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        <span className="text-sm font-medium">Back to Newsroom</span>
                    </Link>

                    <div className="flex flex-col lg:flex-row gap-20">
                        {/* Main Content Area */}
                        <div className="flex-1">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-5xl md:text-8xl font-bold tracking-tight text-white mb-12 font-playfair leading-[1.05]"
                            >
                                {title}
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-2xl md:text-3xl text-zinc-500 leading-relaxed font-light italic mb-16"
                            >
                                {summary}
                            </motion.p>

                            <div className="h-px w-full bg-white/10 mb-16" />

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="prose prose-invert prose-zinc max-w-none prose-p:text-xl prose-p:leading-relaxed prose-p:text-zinc-300 space-y-8"
                            >
                                {content.split('\n').map((para: string, i: number) => (
                                    <p key={i}>{para}</p>
                                ))}
                            </motion.div>
                        </div>

                        {/* Right Sidebar Meta */}
                        <motion.aside
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="w-full lg:w-[320px] space-y-12"
                        >
                            <div className="space-y-8">
                                <MetaItem
                                    icon={Tag}
                                    label="Category"
                                    value={category}
                                />
                                <MetaItem
                                    icon={Box}
                                    label="Product"
                                    value="AURA Platform"
                                />
                                <MetaItem
                                    icon={CalendarDays}
                                    label="Date"
                                    value={date}
                                />
                                <MetaItem
                                    icon={Clock}
                                    label="Reading time"
                                    value="4 min"
                                />

                                <div className="space-y-3 pt-4">
                                    <div className="flex items-center gap-3 text-zinc-500">
                                        <Share2 className="w-4 h-4" />
                                        <span className="text-sm font-medium">Share</span>
                                    </div>
                                    <button
                                        onClick={copyLink}
                                        className="flex items-center gap-2 text-white text-sm hover:text-brand-primary transition-colors underline decoration-white/20 underline-offset-4 font-medium"
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                                <span className="text-emerald-400">Link copied</span>
                                            </>
                                        ) : (
                                            <>
                                                <Link2 className="w-3.5 h-3.5" />
                                                <span>Copy link</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Verification Badge */}
                            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                                <Shield className="w-5 h-5 text-brand-primary mb-4" />
                                <h4 className="text-white text-sm font-bold mb-2 uppercase tracking-widest">Verified Release</h4>
                                <p className="text-zinc-500 text-xs leading-relaxed">
                                    All technical updates are validated by AURA Core Engineering for local inference stability.
                                </p>
                            </div>
                        </motion.aside>
                    </div>
                </div>
            </main>
        </div>
    );
}

function MetaItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-3 text-zinc-500">
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{label}</span>
            </div>
            <p className="text-white text-sm font-bold pl-7 uppercase tracking-wider">{value}</p>
        </div>
    );
}
