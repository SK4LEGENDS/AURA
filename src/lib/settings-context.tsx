"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useTheme } from "next-themes";

type ResponseStyle = "Neutral" | "Formal" | "Friendly";
type SummaryLevel = "Short" | "Detailed";

type SettingsContextType = {
    accentColor: string;
    setAccentColor: (color: string) => void;
    responseStyle: ResponseStyle;
    setResponseStyle: (style: ResponseStyle) => void;
    summaryLevel: SummaryLevel;
    setSummaryLevel: (level: SummaryLevel) => void;

    aiModel: string;
    setAiModel: (model: string) => void;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [accentColor, setAccentColor] = useState("#fb923c");
    const [responseStyle, setResponseStyle] = useState<ResponseStyle>("Neutral");
    const [summaryLevel, setSummaryLevel] = useState<SummaryLevel>("Short");
    const [aiModel, setAiModel] = useState<string>("translategemma:4b");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Load from localStorage
        const savedAccent = localStorage.getItem("auraAccentColor");
        const savedResponseStyle = localStorage.getItem("auraResponseStyle");
        const savedSummaryLevel = localStorage.getItem("auraSummaryLevel");

        const savedAiModel = localStorage.getItem("auraAiModel");

        if (savedAccent) setAccentColor(savedAccent);
        if (savedResponseStyle) setResponseStyle(savedResponseStyle as ResponseStyle);
        if (savedSummaryLevel) setSummaryLevel(savedSummaryLevel as SummaryLevel);

        if (savedAiModel) setAiModel(savedAiModel);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        localStorage.setItem("auraAccentColor", accentColor);
        localStorage.setItem("auraResponseStyle", responseStyle);
        localStorage.setItem("auraSummaryLevel", summaryLevel);

        localStorage.setItem("auraAiModel", aiModel);

        // Apply accent color to CSS variable
        document.documentElement.style.setProperty("--accent-color", accentColor);

        // Helper to convert hex to rgb for rgba usage
        const hexToRgb = (hex: string) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
        };
        const rgb = hexToRgb(accentColor);
        if (rgb) {
            document.documentElement.style.setProperty("--accent-color-rgb", rgb);
        }
    }, [accentColor, responseStyle, summaryLevel, aiModel, mounted]);

    return (
        <SettingsContext.Provider
            value={{
                accentColor,
                setAccentColor,
                responseStyle,
                setResponseStyle,
                summaryLevel,
                setSummaryLevel,

                aiModel,
                setAiModel,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error("useSettings must be used within a SettingsProvider");
    }
    return context;
}
