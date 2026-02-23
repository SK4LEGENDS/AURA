"use client";

import React, { useState } from "react";
import { useI18n, LanguageCode } from "@/lib/i18n-context";
import { Globe, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";


const languages: { code: LanguageCode; name: string; nativeName: string }[] = [
    { code: "en", name: "English", nativeName: "English" },
    { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
    { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
    { code: "ar", name: "Arabic", nativeName: "العربية" },
    { code: "ru", name: "Russian", nativeName: "Русский" },
    { code: "de", name: "German", nativeName: "Deutsch" },
    { code: "ja", name: "Japanese", nativeName: "日本語" },
    { code: "fr", name: "French", nativeName: "Français" },
    { code: "es", name: "Spanish", nativeName: "Español" },
    { code: "nl", name: "Dutch", nativeName: "Nederlands" },
];

export function LanguageSwitcher({ className }: { className?: string }) {
    const { uiLanguage, setUiLanguage } = useI18n();
    const [isOpen, setIsOpen] = useState(false);

    const currentLang = languages.find((l) => l.code === uiLanguage) || languages[0];

    return (
        <div className={cn("relative", className)}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all"
            >
                <Globe className="h-4 w-4" />
                <span>{currentLang.nativeName}</span>
                <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-xl border border-white/10 bg-zinc-900 p-1 shadow-2xl animate-in fade-in zoom-in-95 duration-100">
                        <div className="p-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                            Select Language
                        </div>
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => {
                                    setUiLanguage(lang.code);
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors",
                                    uiLanguage === lang.code
                                        ? "bg-white/10 text-white"
                                        : "text-zinc-400 hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <div className="flex flex-col">
                                    <span>{lang.nativeName}</span>
                                    <span className="text-[10px] opacity-50">{lang.name}</span>
                                </div>
                                {uiLanguage === lang.code && <Check className="h-4 w-4" />}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
