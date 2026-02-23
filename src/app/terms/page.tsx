"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";
import { Footer } from "@/components/landing/footer";

export default function TermsPage() {
    const { t } = useI18n();

    return (
        <div className="min-h-screen bg-black text-white selection:bg-brand-primary/30 font-sans p-8 md:p-12">
            <div className="max-w-3xl mx-auto">
                <header className="mb-12">
                    <Link href="/" className="inline-flex items-center text-zinc-400 hover:text-white transition-colors mb-6 text-sm">
                        <ArrowLeft className="w-4 h-4 mr-2" /> {t("common.backToHome")}
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-b from-white to-zinc-400">
                        {t("legal.terms.title")}
                    </h1>
                    <p className="text-zinc-500 mt-4">{t("common.lastUpdated")}: December 28, 2025</p>
                </header>

                <article className="prose prose-invert prose-zinc max-w-none">
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-4">{t("legal.terms.acceptHeader")}</h2>
                        <p className="text-zinc-300 mb-4">
                            {t("legal.terms.acceptText")}
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-4">{t("legal.terms.usageHeader")}</h2>
                        <p className="text-zinc-300 mb-4">
                            {t("legal.terms.usageText")}
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-zinc-300">
                            <li>{t("legal.terms.usageLi1")}</li>
                            <li>{t("legal.terms.usageLi2")}</li>
                            <li>{t("legal.terms.usageLi3")}</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-4">{t("legal.terms.ownerHeader")}</h2>
                        <p className="text-zinc-300 mb-4">
                            {t("legal.terms.ownerText")}
                        </p>
                        <p className="text-zinc-300 mb-4 italic opacity-80">
                            {t("legal.terms.ownerDisclaimer")}
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-4">{t("legal.terms.terminateHeader")}</h2>
                        <p className="text-zinc-300 mb-4">
                            {t("legal.terms.terminateText")}
                        </p>
                    </section>
                </article>

                <footer className="mt-16 pt-8 border-t border-white/10 text-zinc-500 text-sm mb-24">
                    <p>{t("common.questions")} <Link href="/contact" className="text-white hover:underline">legal@aura.system</Link></p>
                </footer>
            </div>
            <Footer />
        </div>
    );
}
