"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";
import { Footer } from "@/components/landing/footer";

export default function PrivacyPage() {
    const { t } = useI18n();

    return (
        <div className="min-h-screen bg-black text-white selection:bg-brand-primary/30 font-sans p-8 md:p-12">
            <div className="max-w-3xl mx-auto">
                <header className="mb-12">
                    <Link href="/" className="inline-flex items-center text-zinc-400 hover:text-white transition-colors mb-6 text-sm">
                        <ArrowLeft className="w-4 h-4 mr-2" /> {t("common.backToHome")}
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-b from-white to-zinc-400 pb-4">
                        {t("legal.privacy.title")}
                    </h1>
                    <p className="text-zinc-500 mt-4">{t("common.lastUpdated")}: December 28, 2025</p>
                </header>

                <article className="prose prose-invert prose-zinc max-w-none">
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-4">{t("legal.privacy.introHeader")}</h2>
                        <p className="text-zinc-300 mb-4">
                            {t("legal.privacy.introText")}
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-4">{t("legal.privacy.securityHeader")}</h2>
                        <p className="text-zinc-300 mb-4">
                            {t("legal.privacy.securityText")}
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-zinc-300">
                            <li>{t("legal.privacy.securityLi1")}</li>
                            <li>{t("legal.privacy.securityLi2")}</li>
                            <li>{t("legal.privacy.securityLi3")}</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-4">{t("legal.privacy.collectHeader")}</h2>
                        <p className="text-zinc-300 mb-4">
                            {t("legal.privacy.collectText")}
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-zinc-300">
                            <li>{t("legal.privacy.collectLi1")}</li>
                            <li>{t("legal.privacy.collectLi2")}</li>
                            <li>{t("legal.privacy.collectLi3")}</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-4">{t("legal.privacy.rightsHeader")}</h2>
                        <p className="text-zinc-300 mb-4">
                            {t("legal.privacy.rightsText")}
                        </p>
                    </section>
                </article>

                <footer className="mt-16 pt-8 border-t border-white/10 text-zinc-500 text-sm mb-24">
                    <p>{t("common.questions")} <Link href="/contact" className="text-white hover:underline">security@aura.system</Link></p>
                </footer>
            </div>
            <Footer />
        </div>
    );
}
