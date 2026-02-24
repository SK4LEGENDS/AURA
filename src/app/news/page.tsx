"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    Calendar,
    ChevronRight,
    ArrowLeft,
    Globe,
    Zap,
    Mail,
    Download,
    HelpCircle
} from "lucide-react";
import { useI18n } from "@/lib/i18n-context";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/landing/footer";

export default function NewsPage() {
    const { t, isRTL } = useI18n();

    const newsItems = [
        {
            slug: "v1-2-4-release",
            title: t("news.v124.title"),
            date: t("news.v124.date"),
            category: t("news.v124.category"),
            summary: t("news.v124.summary"),
            icon: Globe,
            color: "pink"
        },
        {
            slug: "llama-3-2-integration",
            title: t("news.llama.title"),
            date: t("news.llama.date"),
            category: t("news.llama.category"),
            summary: t("news.llama.summary"),
            icon: Zap,
            color: "yellow"
        },
        {
            slug: "global-language-expansion",
            title: t("news.global.title"),
            date: t("news.global.date"),
            category: t("news.global.category"),
            summary: t("news.global.summary"),
            icon: Globe,
            color: "blue"
        }
    ];

    const contactInfo = [
        { label: "Press inquiries", value: "press@aura-ai.tech", icon: Mail },
        { label: "Non-media inquiries", value: "support@aura-ai.tech", icon: HelpCircle },
        { label: "Media assets", value: "Download press kit", icon: Download, isLink: true }
    ];

    return (
        <div className={cn(
            "min-h-screen bg-[#0a0a0a]",
            isRTL ? "font-arabic" : ""
        )} dir={isRTL ? "rtl" : "ltr"}>
            <main className="container mx-auto px-6 pt-32 pb-24 relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-6xl md:text-8xl font-bold tracking-tight text-white font-playfair"
                    >
                        Newsroom
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="w-full md:w-[400px] border-t border-white/10"
                    >
                        {contactInfo.map((info, i) => (
                            <div key={i} className="flex justify-between items-center py-4 border-b border-white/10 group">
                                <span className="text-zinc-500 text-sm font-medium">{info.label}</span>
                                <div className="flex items-center gap-2 text-white text-sm">
                                    {info.isLink ? (
                                        <a href="#" className="flex items-center gap-2 hover:text-brand-primary transition-colors underline decoration-white/20 underline-offset-4">
                                            <info.icon className="w-3.5 h-3.5" />
                                            {info.value}
                                        </a>
                                    ) : (
                                        <>
                                            <info.icon className="w-3.5 h-3.5 text-zinc-600" />
                                            <span>{info.value}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>

                <div className="h-px w-full bg-white/10 mb-20" />

                {/* News Feed */}
                <div className="space-y-0">
                    {newsItems.map((item, idx) => (
                        <NewsRow key={item.slug} item={item} idx={idx} />
                    ))}
                </div>

                {/* Coming Soon Placeholder */}
                <div className="mt-24 py-20 border-t border-white/10 text-center">
                    <p className="text-zinc-600 font-playfair text-xl italic">More technical updates arriving soon.</p>
                </div>
            </main>

            <Footer />
        </div>
    );
}

function NewsRow({ item, idx }: { item: any; idx: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="group relative border-b border-white/5 last:border-0"
        >
            <Link
                href={`/news/${item.slug}`}
                className="flex flex-col md:flex-row gap-8 py-16 hover:bg-white/[0.02] transition-colors relative"
            >
                {/* Vertical Accent Line */}
                <div className="absolute left-0 top-16 bottom-16 w-px bg-white/10 group-hover:bg-brand-primary/50 transition-colors" />

                <div className="flex-1 pl-12">
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 font-playfair leading-tight group-hover:text-brand-primary transition-colors">
                        {item.title}
                    </h3>
                    <p className="text-zinc-500 text-sm mb-2">{item.date}</p>
                </div>

                <div className="flex-1 md:max-w-md">
                    <p className="text-zinc-400 leading-relaxed font-light line-clamp-2">
                        {item.summary}
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 group-hover:text-brand-primary transition-colors">
                        Read more
                        <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
