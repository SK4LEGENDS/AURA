"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";

export function ComparisonSection() {
    const { t } = useI18n();

    const comparisonData = [
        {
            feature: t("landing.comparison.privacy"),
            aura: t("landing.comparison.privacyAura"),
            generic: t("landing.comparison.privacyGeneric"),
        },
        {
            feature: t("landing.comparison.grounding"),
            aura: t("landing.comparison.groundingAura"),
            generic: t("landing.comparison.groundingGeneric"),
        },
        {
            feature: t("landing.comparison.deployment"),
            aura: t("landing.comparison.deploymentAura"),
            generic: t("landing.comparison.deploymentGeneric"),
        },
        {
            feature: t("landing.comparison.support"),
            aura: t("landing.comparison.supportAura"),
            generic: t("landing.comparison.supportGeneric"),
        },
    ];

    return (
        <section className="py-24 bg-black relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px]" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold mb-6"
                    >
                        {t("landing.comparison.title")}
                    </motion.h2>
                    <p className="text-zinc-400 max-w-2xl mx-auto">
                        {t("landing.comparison.subtitle")}
                    </p>
                </div>

                <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden border border-white/10 bg-zinc-900/50 backdrop-blur-sm">
                    <div className="grid grid-cols-3 p-6 border-b border-white/10 bg-white/5">
                        <div className="text-sm font-medium text-zinc-500 uppercase tracking-wider">
                            {t("landing.comparison.feature")}
                        </div>
                        <div className="text-lg font-bold text-white text-center">
                            {t("landing.comparison.aura")}
                        </div>
                        <div className="text-lg font-bold text-zinc-500 text-center">
                            {t("landing.comparison.generic")}
                        </div>
                    </div>

                    {comparisonData.map((row, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="grid grid-cols-3 p-6 border-b border-white/5 hover:bg-white/5 transition-colors items-center"
                        >
                            <div className="font-semibold text-zinc-300">{row.feature}</div>
                            <div className="text-center flex items-center justify-center gap-2 text-brand-primary font-medium bg-brand-primary/10 py-1 px-3 rounded-full mx-auto w-fit">
                                <Check className="w-4 h-4" />
                                {row.aura}
                            </div>
                            <div className="text-center flex items-center justify-center gap-2 text-zinc-500">
                                {row.generic.includes("Cloud") ||
                                    row.generic.includes("Training") ||
                                    row.generic.includes("Hallucinations") ||
                                    row.generic.includes("training") ||
                                    row.generic.includes("Hallucinaties") ? (
                                    <X className="w-4 h-4 text-red-900" />
                                ) : null}
                                {row.generic}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
