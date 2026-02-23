"use client";
import { Terminal } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";

export function TrustSignals() {
    const { t } = useI18n();

    return (
        <section className="py-12 border-y border-white/5 bg-zinc-950/50 backdrop-blur-md">
            <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 text-zinc-500 grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-500">
                <span className="flex items-center gap-2 font-semibold">
                    <Terminal className="w-5 h-5" /> {t("landing.trust.engineering")}
                </span>
                <span className="flex items-center gap-2 font-semibold">
                    {t("landing.trust.research")}
                </span>
                <span className="flex items-center gap-2 font-semibold">
                    {t("landing.trust.production")}
                </span>
                <span className="flex items-center gap-2 font-semibold">
                    {t("landing.trust.soc2")}
                </span>
            </div>
        </section>
    );
}
