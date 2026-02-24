"use client";

import Link from "next/link";
import { ArrowLeft, Mail, MapPin, MessageSquare } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";

export default function ContactPage() {
    const { t } = useI18n();

    return (
        <div className="min-h-screen bg-black text-white selection:bg-purple-500/30 font-sans p-8 md:p-12">
            <div className="max-w-3xl mx-auto">
                <header className="mb-12">
                    <Link href="/" className="inline-flex items-center text-zinc-400 hover:text-white transition-colors mb-6 text-sm">
                        <ArrowLeft className="w-4 h-4 mr-2" /> {t("common.backToHome")}
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-b from-white to-zinc-400 pb-4">
                        {t("legal.contact.title")}
                    </h1>
                    <p className="text-zinc-500 mt-4">{t("legal.contact.subtitle")}</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/10">
                        <Mail className="w-8 h-8 text-purple-400 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">{t("legal.contact.generalTitle")}</h3>
                        <p className="text-zinc-400 text-sm mb-4">{t("legal.contact.generalDesc")}</p>
                        <a href="mailto:hello@aura.system" className="text-white hover:underline font-medium">hello@aura.system</a>
                    </div>

                    <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/10">
                        <MessageSquare className="w-8 h-8 text-blue-400 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">{t("legal.contact.techTitle")}</h3>
                        <p className="text-zinc-400 text-sm mb-4">{t("legal.contact.techDesc")}</p>
                        <a href="mailto:support@aura.system" className="text-white hover:underline font-medium">support@aura.system</a>
                    </div>
                </div>

                <div className="p-8 rounded-2xl bg-zinc-900/30 border border-white/5 text-center">
                    <h3 className="text-lg font-medium text-zinc-200 mb-2">{t("legal.contact.enterpriseTitle")}</h3>
                    <p className="text-zinc-400 max-w-md mx-auto mb-6">{t("legal.contact.enterpriseDesc")}</p>
                    <button className="px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-zinc-200 transition-colors">
                        {t("legal.contact.contactSales")}
                    </button>
                </div>
            </div>
        </div>
    );
}
