"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, ArrowRight, Code2, Repeat } from "lucide-react";
import { cn } from "@/lib/utils";

// Comprehensive mock dictionary for all 10 supported languages
const mockDicts: Record<string, any> = {
    en: { hero: "Chat with your Intelligence.", desc: "Secure, searchable knowledge base." },
    hi: { hero: "अपनी बुद्धि के साथ चैट करें।", desc: "एक सुरक्षित, खोजने योग्य ज्ञान आधार।" },
    ta: { hero: "உங்கள் அறிவுத்திறனுடன் உரையாடுங்கள்.", desc: "பாதுகாப்பான, தேடக்கூடிய அறிவுத் தளம்." },
    ar: { hero: "دردش مع ذكائك.", desc: "قاعدة معرفية آمنة وقابلة للبحث." },
    ru: { hero: "Общайтесь со своим интеллектом.", desc: "Безопасная база знаний с поиском." },
    de: { hero: "Chatte mit deiner Intelligenz.", desc: "Sichere, durchsuchbare Wissensdatenbank." },
    ja: { hero: "あなたの知能と対話する。", desc: "安全で検索可能な知識ベース。" },
    fr: { hero: "Discutez avec votre intelligence.", desc: "Base de connaissances sécurisée." },
    es: { hero: "Chatea con tu Inteligencia.", desc: "Base de conocimientos segura." },
    nl: { hero: "Chat met je Intelligentie.", desc: "Veilige, doorzoekbare kennisbank." }
};

type DemoLang = "en" | "hi" | "ta" | "ar" | "ru" | "de" | "ja" | "fr" | "es" | "nl";

export function I18nDemo() {
    const [lang, setLang] = useState<DemoLang>("en");

    const languages: { code: DemoLang; label: string }[] = [
        { code: "en", label: "EN" },
        { code: "hi", label: "HI" },
        { code: "ta", label: "TA" },
        { code: "ar", label: "AR" },
        { code: "ru", label: "RU" },
        { code: "de", label: "DE" },
        { code: "ja", label: "JA" },
        { code: "fr", label: "FR" },
        { code: "es", label: "ES" },
        { code: "nl", label: "NL" }
    ];

    const currentDict = mockDicts[lang];
    const isRtl = lang === "ar";

    return (
        <div className="my-10 border border-white/10 rounded-3xl bg-black/40 overflow-hidden">
            <div className="p-4 border-b border-white/10 bg-white/5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-brand-primary" />
                        <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Live i18n Playground</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 justify-start sm:justify-end">
                        {languages.map((l) => (
                            <button
                                key={l.code}
                                onClick={() => setLang(l.code)}
                                className={cn(
                                    "px-2.5 py-1 rounded-md text-[9px] font-bold transition-all border",
                                    lang === l.code
                                        ? "bg-brand-primary text-white border-orange-400 shadow-lg shadow-brand-primary/20"
                                        : "bg-white/5 text-zinc-500 border-white/5 hover:bg-white/10 hover:border-white/10"
                                )}
                            >
                                {l.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Visual Preview */}
                <div className="p-8 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-white/10 min-h-[220px]">
                    <div className="mb-6 flex items-center gap-2 text-[10px] text-zinc-500 font-medium tracking-wider">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        RENDERED OUTPUT ({lang.toUpperCase()})
                    </div>

                    <div
                        className={cn(
                            "space-y-4 transition-all duration-500",
                            isRtl ? "text-right font-arabic" : lang === "ja" ? "text-left font-japanese" : "text-left"
                        )}
                        dir={isRtl ? "rtl" : "ltr"}
                    >
                        <motion.h3
                            key={`h3-${lang}`}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-2xl font-bold text-white tracking-tight"
                        >
                            {currentDict.hero}
                        </motion.h3>
                        <motion.p
                            key={`p-${lang}`}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-sm text-zinc-400 leading-relaxed"
                        >
                            {currentDict.desc}
                        </motion.p>
                    </div>
                </div>

                {/* Technical "Behind the Scenes" */}
                <div className="p-8 bg-zinc-900/50">
                    <div className="mb-6 flex items-center gap-2 text-[10px] text-zinc-500 font-medium tracking-wider">
                        <Code2 className="w-3 h-3" />
                        SYSTEM STATE
                    </div>

                    <div className="space-y-4">
                        <div className="bg-black/60 rounded-xl p-5 font-mono text-[11px] overflow-x-auto border border-white/5 leading-relaxed">
                            <div className="text-zinc-600 italic mb-2">// Language Dispatcher</div>
                            <div>
                                <span className="text-brand-primary">const</span> <span className="text-blue-300">locale</span> = <span className="text-orange-300">"{lang}"</span>;
                            </div>
                            <div>
                                <span className="text-brand-primary">const</span> <span className="text-blue-300">isRTL</span> = <span className="text-blue-300">locale</span> === <span className="text-orange-300">"ar"</span>;
                            </div>
                            <div className="mt-4">
                                <span className="text-zinc-600 italic">// Dynamic Translation</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-zinc-500">&lt;h1</span>
                                <span className="text-blue-200">dir</span>=<span className="text-zinc-500">&#123;</span><span className="text-blue-300">isRTL</span> ? <span className="text-orange-300">"rtl"</span> : <span className="text-orange-300">"ltr"</span><span className="text-zinc-500">&#125;&gt;</span>
                            </div>
                            <div className="pl-4">
                                <span className="text-zinc-500">&#123;</span><span className="text-brand-primary">t</span>(<span className="text-orange-300">"hero"</span>)<span className="text-zinc-500">&#125;</span>
                            </div>
                            <div className="text-zinc-500">&lt;/h1&gt;</div>
                        </div>

                        <div className="flex items-start gap-3 p-4 rounded-xl bg-brand-primary/5 border border-brand-primary/10">
                            <Repeat className="w-4 h-4 text-brand-primary mt-1 shrink-0" />
                            <div>
                                <div className="text-[10px] font-bold text-orange-300 uppercase tracking-tighter">I18n Context Updated</div>
                                <p className="text-[10px] text-zinc-500 mt-1 leading-normal">
                                    Resolved <b>{lang.toUpperCase()}</b> dictionary. Applied <b>{isRtl ? "Right-to-Left" : "Left-to-Right"}</b> layout flow and font weights.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
