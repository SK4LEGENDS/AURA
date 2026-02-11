"use client";

import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";

mermaid.initialize({
    startOnLoad: true,
    theme: "dark",
    themeVariables: {
        primaryColor: "#a855f7",
        primaryTextColor: "#fff",
        primaryBorderColor: "#a855f7",
        lineColor: "#52525b",
        secondaryColor: "#3b82f6",
        tertiaryColor: "#10b981",
    },
    securityLevel: "loose",
});

interface MermaidProps {
    chart: string;
}

export const MermaidDiagram: React.FC<MermaidProps> = ({ chart }) => {
    const mermaidRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (mermaidRef.current) {
            mermaid.contentLoaded();
        }
    }, [chart]);

    return (
        <div className="mermaid-container my-12 p-8 bg-zinc-950 rounded-3xl border border-white/5 overflow-x-auto select-none">
            <div ref={mermaidRef} className="mermaid flex justify-center">
                {chart}
            </div>
        </div>
    );
};
