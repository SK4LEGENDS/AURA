"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";

export function FAQ() {
    const { t } = useI18n();

    const faqs = [
        {
            q: t("landing.faq.q1"),
            a: t("landing.faq.a1"),
        },
        {
            q: t("landing.faq.q2"),
            a: t("landing.faq.a2"),
        },
        {
            q: t("landing.faq.q3"),
            a: t("landing.faq.a3"),
        },
        {
            q: t("landing.faq.q4"),
            a: t("landing.faq.a4"),
        },
    ];

    return (
        <section id="faq" className="py-24 bg-zinc-950">
            <div className="container mx-auto px-6 max-w-3xl">
                <h2 className="text-3xl font-bold mb-12 text-center">{t("landing.faq.title")}</h2>

                <div className="space-y-4">
                    {faqs.map((item, idx) => (
                        <Accordion key={idx} question={item.q} answer={item.a} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function Accordion({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-white/5 rounded-xl bg-zinc-900/30 overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
            >
                <span className="font-medium text-lg">{question}</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-6 pt-0 text-zinc-400 leading-relaxed">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
