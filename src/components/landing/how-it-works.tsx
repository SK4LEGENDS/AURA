"use client";

import { motion } from "framer-motion";
import { FileUp, Database, Search, MessageSquare, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";
import { cn } from "@/lib/utils";

export function HowItWorks() {
    const { t, isRTL } = useI18n();

    const steps = [
        { icon: <FileUp />, label: t("landing.engine.step1"), desc: t("landing.engine.desc1") },
        { icon: <Database />, label: t("landing.engine.step2"), desc: t("landing.engine.desc2") },
        { icon: <Search />, label: t("landing.engine.step3"), desc: t("landing.engine.desc3") },
        {
            icon: <MessageSquare />,
            label: t("landing.engine.step4"),
            desc: t("landing.engine.desc4"),
        },
    ];

    return (
        <section className="py-24 bg-zinc-950 border-y border-white/5">
            <div className="container mx-auto px-6">
                <div className="text-center mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold mb-6"
                    >
                        {t("landing.engine.title")}
                    </motion.h2>
                    <p className="text-zinc-400">{t("landing.engine.subtitle")}</p>
                </div>

                <div className="relative">
                    {/* Connecting Line */}
                    <div className="hidden md:block absolute top-[28px] left-[10%] right-[10%] h-[2px] bg-linear-to-r from-brand-primary/0 via-brand-primary/50 to-brand-primary/0 z-0" />

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="flex flex-col items-center text-center"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-brand-primary/30 flex items-center justify-center text-white mb-6 shadow-lg shadow-brand-primary/20 z-10 relative">
                                    {step.icon}
                                    {index < steps.length - 1 && (
                                        <div className="md:hidden absolute -bottom-10 left-1/2 -translate-x-1/2 text-zinc-700">
                                            <ArrowRight className={cn("rotate-90", isRTL && "-rotate-90")} />
                                        </div>
                                    )}
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{step.label}</h3>
                                <p className="text-zinc-500 text-sm">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
