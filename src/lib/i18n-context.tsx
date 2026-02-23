"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Dictionaries
import en from "@/dictionaries/en.json";
import hi from "@/dictionaries/hi.json";
import ta from "@/dictionaries/ta.json";
import ar from "@/dictionaries/ar.json";
import ru from "@/dictionaries/ru.json";
import de from "@/dictionaries/de.json";
import ja from "@/dictionaries/ja.json";
import fr from "@/dictionaries/fr.json";
import es from "@/dictionaries/es.json";
import nl from "@/dictionaries/nl.json";

const dictionaries: Record<string, any> = {
    en, hi, ta, ar, ru, de, ja, fr, es, nl
};

export type LanguageCode = "en" | "hi" | "ta" | "ar" | "ru" | "de" | "ja" | "fr" | "es" | "nl";

interface I18nContextType {
    uiLanguage: LanguageCode;
    inputLanguage: LanguageCode;
    outputLanguage: LanguageCode;
    setUiLanguage: (lang: LanguageCode) => void;
    setInputLanguage: (lang: LanguageCode) => void;
    setOutputLanguage: (lang: LanguageCode) => void;
    t: (path: string, options?: { returnObjects?: boolean }) => any;
    isRTL: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
    const [uiLanguage, setUiLanguage] = useState<LanguageCode>("en");
    const [inputLanguage, setInputLanguage] = useState<LanguageCode>("en");
    const [outputLanguage, setOutputLanguage] = useState<LanguageCode>("en");
    const [isRTL, setIsRTL] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const savedUi = localStorage.getItem("aura_ui_lang") as LanguageCode;
        const savedInput = localStorage.getItem("aura_input_lang") as LanguageCode;
        const savedOutput = localStorage.getItem("aura_output_lang") as LanguageCode;

        if (savedUi && dictionaries[savedUi]) setUiLanguage(savedUi);
        if (savedInput && dictionaries[savedInput]) setInputLanguage(savedInput);
        if (savedOutput && dictionaries[savedOutput]) setOutputLanguage(savedOutput);
    }, []);

    // Sync RTL and LocalStorage
    useEffect(() => {
        setIsRTL(uiLanguage === "ar");
        localStorage.setItem("aura_ui_lang", uiLanguage);
        document.documentElement.dir = uiLanguage === "ar" ? "rtl" : "ltr";
        document.documentElement.lang = uiLanguage;
    }, [uiLanguage]);

    useEffect(() => {
        localStorage.setItem("aura_input_lang", inputLanguage);
    }, [inputLanguage]);

    useEffect(() => {
        localStorage.setItem("aura_output_lang", outputLanguage);
    }, [outputLanguage]);

    const t = (path: string, options?: { returnObjects?: boolean }): any => {
        const keys = path.split(".");
        let result = dictionaries[uiLanguage];

        for (const key of keys) {
            if (result && result[key] !== undefined) {
                result = result[key];
            } else {
                // Fallback to English
                let fallback = dictionaries["en"];
                let found = true;
                for (const fkey of keys) {
                    if (fallback && fallback[fkey] !== undefined) fallback = fallback[fkey];
                    else {
                        found = false;
                        break;
                    }
                }
                result = found ? fallback : path;
                break;
            }
        }

        if (options?.returnObjects) return result;
        return typeof result === "string" ? result : path;
    };

    return (
        <I18nContext.Provider
            value={{
                uiLanguage,
                inputLanguage,
                outputLanguage,
                setUiLanguage,
                setInputLanguage,
                setOutputLanguage,
                t,
                isRTL,
            }}
        >
            {children}
        </I18nContext.Provider>
    );
}

export function useI18n() {
    const context = useContext(I18nContext);
    if (context === undefined) {
        throw new Error("useI18n must be used within an I18nProvider");
    }
    return context;
}
