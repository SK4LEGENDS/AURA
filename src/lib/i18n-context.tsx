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
import bn from "@/dictionaries/bn.json";
import gu from "@/dictionaries/gu.json";
import kn from "@/dictionaries/kn.json";
import ml from "@/dictionaries/ml.json";
import mr from "@/dictionaries/mr.json";
import te from "@/dictionaries/te.json";
import as from "@/dictionaries/as.json";
import brx from "@/dictionaries/brx.json";
import doi from "@/dictionaries/doi.json";
import ks from "@/dictionaries/ks.json";
import kok from "@/dictionaries/kok.json";
import mai from "@/dictionaries/mai.json";
import mni from "@/dictionaries/mni.json";
import ne from "@/dictionaries/ne.json";
import or from "@/dictionaries/or.json";
import pa from "@/dictionaries/pa.json";
import sa from "@/dictionaries/sa.json";
import sat from "@/dictionaries/sat.json";
import sd from "@/dictionaries/sd.json";
import ur from "@/dictionaries/ur.json";
import it from "@/dictionaries/it.json";
import ko from "@/dictionaries/ko.json";
import pt from "@/dictionaries/pt.json";
import th from "@/dictionaries/th.json";
import tr from "@/dictionaries/tr.json";
import zhcn from "@/dictionaries/zh-cn.json";
import zhtw from "@/dictionaries/zh-tw.json";
import id from "@/dictionaries/id.json";
import vi from "@/dictionaries/vi.json";
import fil from "@/dictionaries/fil.json";
import he from "@/dictionaries/he.json";
import fa from "@/dictionaries/fa.json";
import pl from "@/dictionaries/pl.json";
import uk from "@/dictionaries/uk.json";
import sv from "@/dictionaries/sv.json";
import no from "@/dictionaries/no.json";
import da from "@/dictionaries/da.json";
import fi from "@/dictionaries/fi.json";
import el from "@/dictionaries/el.json";
import hu from "@/dictionaries/hu.json";
import cs from "@/dictionaries/cs.json";
import ro from "@/dictionaries/ro.json";
import bg from "@/dictionaries/bg.json";
import sr from "@/dictionaries/sr.json";
import hr from "@/dictionaries/hr.json";
import sk from "@/dictionaries/sk.json";
import ms from "@/dictionaries/ms.json";

const dictionaries: Record<string, any> = {
    en, hi, ta, ar, ru, de, ja, fr, es, nl,
    bn, gu, kn, ml, mr, te, as, brx, doi, ks, kok, mai, mni, ne, or, pa, sa, sat, sd, ur,
    it, ko, pt, th, tr, "zh-cn": zhcn, "zh-tw": zhtw,
    id, vi, fil, he, fa, pl, uk, sv, no, da, fi, el, hu, cs, ro, bg, sr, hr, sk, ms
};

export type LanguageCode =
    | "en" | "hi" | "ta" | "ar" | "ru" | "de" | "ja" | "fr" | "es" | "nl"
    | "bn" | "gu" | "kn" | "ml" | "mr" | "te" | "as" | "brx" | "doi" | "ks"
    | "kok" | "mai" | "mni" | "ne" | "or" | "pa" | "sa" | "sat" | "sd" | "ur"
    | "it" | "ko" | "pt" | "th" | "tr" | "zh-cn" | "zh-tw"
    | "id" | "vi" | "fil" | "he" | "fa" | "pl" | "uk" | "sv" | "no" | "da"
    | "fi" | "el" | "hu" | "cs" | "ro" | "bg" | "sr" | "hr" | "sk" | "ms";

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
