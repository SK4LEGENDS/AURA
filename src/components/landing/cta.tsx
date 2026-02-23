"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";
import { cn } from "@/lib/utils";

export function CTA() {
    const { t, isRTL } = useI18n();

    // Split title by <br /> to handle localization with line breaks if needed, 
    // or just use the whole string if it's safe.
    const titleParts = t("landing.cta.title").split("<br />");

    return (
        <section className="py-32 bg-black relative overflow-hidden">
            {/* Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-brand-primary/20 to-orange-600/20 rounded-full blur-[120px]" />

            <div className="container mx-auto px-6 relative z-10 text-center">
                <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">
                    {titleParts[0]} {titleParts.length > 1 && <br />}
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-primary to-amber-500">
                        {titleParts[1] || ""}
                    </span>
                </h2>
                <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
                    {t("landing.cta.subtitle")}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/login"
                        className="px-10 py-5 bg-white text-black text-lg font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] flex items-center gap-2"
                    >
                        {t("landing.cta.getStarted")}
                        <ArrowRight className={cn("w-5 h-5", isRTL && "rotate-180")} />
                    </Link>
                    <Link
                        href="#"
                        className="px-10 py-5 bg-zinc-900 border border-zinc-800 text-white text-lg font-medium rounded-full hover:bg-zinc-800 transition-colors"
                    >
                        {t("landing.cta.contactSales")}
                    </Link>
                </div>
            </div>
        </section>
    );
}
