"use client";

import React, { useState } from "react";
import { Terminal, Copy, Check, Rocket, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const SNIPPETS = {
    chat: {
        title: "POST /api/chat",
        description: "Initiates a grounded chat session with streaming responses.",
        curl: `curl -X POST http://localhost:3000/api/chat \\
  -H "Content-Type: application/json" \\
  -d '{
    "message": "Explain Q3 profits",
    "chatId": "session_123",
    "settings": { "style": "concise" }
  }'`,
        js: `const response = await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({
    message: 'Explain Q3 profits',
    chatId: 'session_123'
  })
});`
    },
    upload: {
        title: "POST /api/upload",
        description: "Uploads and indexes a document into the local RAG engine.",
        curl: `curl -X POST http://localhost:3000/api/upload \\
  -F "file=@financials.pdf" \\
  -F "chatId=session_123"`,
        js: `const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('chatId', 'session_123');

await fetch('/api/upload', {
  method: 'POST',
  body: formData
});`
    }
};

export function APISandbox() {
    const [selected, setSelected] = useState<keyof typeof SNIPPETS>('chat');
    const [copying, setCopying] = useState(false);
    const [lang, setLang] = useState<'curl' | 'js'>('curl');

    const copyToClipboard = () => {
        navigator.clipboard.writeText(SNIPPETS[selected][lang]);
        setCopying(true);
        setTimeout(() => setCopying(false), 2000);
    };

    return (
        <div className="bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden group">
            <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Terminal className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-tight">API Sandbox</h4>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Developer Console Preview</p>
                    </div>
                </div>

                <div className="flex bg-black/40 p-1 rounded-lg border border-white/5 text-[10px] font-bold">
                    <button
                        onClick={() => setLang('curl')}
                        className={cn("px-3 py-1 rounded transition-colors", lang === 'curl' ? "bg-white/10 text-white" : "text-zinc-600 hover:text-zinc-300")}
                    >
                        CURL
                    </button>
                    <button
                        onClick={() => setLang('js')}
                        className={cn("px-3 py-1 rounded transition-colors", lang === 'js' ? "bg-white/10 text-white" : "text-zinc-600 hover:text-zinc-300")}
                    >
                        JS FETCH
                    </button>
                </div>
            </div>

            <div className="flex h-[320px]">
                {/* Sidebar */}
                <div className="w-1/3 border-r border-white/5 bg-white/[0.01]">
                    {(Object.keys(SNIPPETS) as Array<keyof typeof SNIPPETS>).map(key => (
                        <button
                            key={key}
                            onClick={() => setSelected(key)}
                            className={cn(
                                "w-full p-4 text-left border-b border-white/5 transition-all",
                                selected === key ? "bg-white/5 border-r-2 border-r-blue-500" : "hover:bg-white/[0.02]"
                            )}
                        >
                            <div className={cn("text-[10px] font-bold uppercase mb-1", selected === key ? "text-blue-400" : "text-zinc-600")}>
                                {key === 'chat' ? 'Inference' : 'Ingestion'}
                            </div>
                            <div className={cn("text-xs font-mono", selected === key ? "text-white" : "text-zinc-500")}>
                                {SNIPPETS[key].title.split(' ')[1]}
                            </div>
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 p-6 flex flex-col relative">
                    <div className="mb-4">
                        <p className="text-xs text-zinc-400 leading-relaxed italic border-l-2 border-blue-500/30 pl-3">
                            "{SNIPPETS[selected].description}"
                        </p>
                    </div>

                    <div className="flex-1 bg-black/60 rounded-xl border border-white/5 p-4 font-mono text-[11px] text-emerald-500/80 overflow-auto whitespace-pre relative">
                        {SNIPPETS[selected][lang]}

                        <button
                            onClick={copyToClipboard}
                            className="absolute top-2 right-2 p-2 bg-zinc-900 border border-white/10 rounded-lg hover:bg-zinc-800 transition-colors"
                        >
                            {copying ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-zinc-500" />}
                        </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 opacity-30 group-hover:opacity-100 transition-opacity">
                            <Rocket className="w-3 h-3 text-blue-400" />
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Local-Ready</span>
                        </div>
                        <div className="text-[10px] text-zinc-700 font-mono">localhost:3000/api/v1/...</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
