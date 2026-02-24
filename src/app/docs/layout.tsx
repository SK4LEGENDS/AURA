"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, BookText, Search } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";
import { cn } from "@/lib/utils";

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { t, isRTL } = useI18n();

    return (
        <div className="min-h-screen bg-neutral-950 text-white selection:bg-brand-primary/30">
            {/* Ambient Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-brand-primary/10 blur-[100px]" />
                <div className="absolute bottom-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-orange-900/10 blur-[100px]" />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 brightness-100 contrast-150 mix-blend-overlay" />
            </div>

            {/* Navbar */}
            <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-black/50 backdrop-blur-xl">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-2 rounded-lg py-1.5 pr-3 pl-2 text-sm text-neutral-400 transition-colors hover:bg-white/5 hover:text-white"
                        >
                            <ArrowLeft className={cn("h-4 w-4", isRTL && "rotate-180")} />
                            <span>{t("common.backToApp")}</span>
                        </Link>
                        <div className="h-6 w-px bg-white/10" />
                        <div className="flex items-center gap-3 pl-2">
                            <div className="rounded-lg bg-brand-primary/10 p-1.5 text-brand-primary border border-brand-primary/20">
                                <BookText className="h-4 w-4" />
                            </div>
                            <span className="font-bold tracking-tight text-white">Aura Docs</span>
                        </div>
                    </div>

                    <div className="relative hidden md:block group">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500 group-focus-within:text-brand-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Search documentation..."
                            className="h-9 w-64 rounded-full border border-white/10 bg-white/5 pl-9 pr-4 text-sm text-neutral-300 placeholder:text-neutral-600 focus:border-brand-primary/50 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-brand-primary/50 transition-all"
                        />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 pt-24">
                {children}
            </main>
        </div>
    );
}
