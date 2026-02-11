"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
    {
        q: "Is my data used to train your models?",
        a: "Absolutely not. Aura runs on an isolated architecture. Your data is indexed only for your private retrieval sessions and is never used for model training or shared with third parties.",
    },
    {
        q: "Can I deploy this offline / air-gapped?",
        a: "Yes. Aura supports full on-premise deployment via Docker containers, allowing it to run in completely offline or air-gapped environments for maximum security.",
    },
    {
        q: "What file types are supported?",
        a: "We currently support PDF, Microsoft Word (.docx), Excel (.xlsx), Markdown, and plain text. We are constantly adding new parsers.",
    },
    {
        q: "How accurate are the answers?",
        a: "Aura uses valid citations for every claim. If the information isn't in your documents, the system will explicitly state 'I do not have the answer' rather than hallucinating.",
    },
];

export function FAQ() {
    return (
        <section className="py-24 bg-zinc-950">
            <div className="container mx-auto px-6 max-w-3xl">
                <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>

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
