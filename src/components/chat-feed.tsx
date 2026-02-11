"use client";

import { ChatMessage, ConfidenceInfo } from "@/types/chat";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useSettings } from "@/lib/settings-context";
import { GraphRenderer, GraphData } from "./graph-renderer";
import { CitationHighlight } from "./citation-highlight";
import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert, ShieldQuestion, Info, Copy, Check, ThumbsUp, ThumbsDown, RefreshCw } from "lucide-react";
import { hasCitations } from "@/lib/citation-parser";

import { MessageReference } from "@/types/chat";
import { MessageSkeleton } from "./skeleton";

type ChatFeedProps = {
  messages: ChatMessage[];
  loading: boolean;
  onCitationClick?: (index: number, reference: MessageReference) => void;
};

import { cleanAndParseJson } from "@/lib/json-parser";

// Remove citations like [1], [2] from text
function removeCitations(text: string): string {
  return text.replace(/\s*\[\d+\]/g, '').replace(/\s{2,}/g, ' ').trim();
}

// Copy button component
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const cleanText = removeCitations(text);
    await navigator.clipboard.writeText(cleanText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "ml-2 p-1.5 rounded-md transition-all inline-flex items-center gap-1",
        "hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200",
        "opacity-0 group-hover:opacity-100",
        copied && "text-emerald-400"
      )}
      title={copied ? "Copied!" : "Copy without citations"}
    >
      {copied ? (
        <Check className="w-3.5 h-3.5" />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
    </button>
  );
}

// Message actions component (thumbs, copy)
function MessageActions({ text, onFeedback }: { text: string; onFeedback?: (type: "up" | "down") => void }) {
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const cleanText = removeCitations(text);
    await navigator.clipboard.writeText(cleanText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFeedback = (type: "up" | "down") => {
    setFeedback(type);
    onFeedback?.(type);
  };

  return (
    <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
      {/* Copy */}
      <button
        onClick={handleCopy}
        className={cn(
          "p-1.5 rounded-md transition-colors",
          "hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400",
          copied && "text-emerald-500"
        )}
        title={copied ? "Copied!" : "Copy response"}
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>

      {/* Thumbs Up */}
      <button
        onClick={() => handleFeedback("up")}
        className={cn(
          "p-1.5 rounded-md transition-colors",
          "hover:bg-zinc-200 dark:hover:bg-zinc-700",
          feedback === "up" ? "text-emerald-500" : "text-zinc-500 dark:text-zinc-400"
        )}
        title="Good response"
      >
        <ThumbsUp className="w-4 h-4" />
      </button>

      {/* Thumbs Down */}
      <button
        onClick={() => handleFeedback("down")}
        className={cn(
          "p-1.5 rounded-md transition-colors",
          "hover:bg-zinc-200 dark:hover:bg-zinc-700",
          feedback === "down" ? "text-red-500" : "text-zinc-500 dark:text-zinc-400"
        )}
        title="Poor response"
      >
        <ThumbsDown className="w-4 h-4" />
      </button>
    </div>
  );
}

const parseMessageContent = (content: string) => {
  // 1. Try to extract JSON from SPECIAL MARKER (Priority)
  // Support both closed and unclosed markers
  const markerRegex = /<<<GRAPH_JSON>>>\s*([\s\S]*?)(?:<<<GRAPH_JSON>>>|$)/;
  let match = content.match(markerRegex);
  let jsonData = null;
  let fullMatch = "";

  if (match && match[1].trim()) {
    fullMatch = match[0];
    jsonData = cleanAndParseJson(content); // Pass full content so parser can use its own marker logic
  } else {
    // 2. Try to extract JSON from markdown code block (Fallback)
    const jsonBlockRegex = /```json\s*([\s\S]*?)\s*```/;
    match = content.match(jsonBlockRegex);
    if (match) {
      fullMatch = match[0];
      jsonData = cleanAndParseJson(content);
    }
  }

  // If we found valid graph data
  if (jsonData && jsonData.graph) {
    // Determine what text to show: everything except the JSON block
    const textContent = content.replace(fullMatch, "").trim();
    return { text: textContent, graph: jsonData.graph as GraphData };
  }

  // 3. Last fallback: Try to parse the whole message if it looks like JSON but no markers
  if (content.trim().startsWith('{') && content.trim().endsWith('}')) {
    const jsonData = cleanAndParseJson(content);
    if (jsonData && jsonData.graph) {
      return { text: "", graph: jsonData.graph as GraphData };
    }
  }

  return { text: content, graph: null };
};

// Confidence Badge Component
function ConfidenceBadge({ confidence }: { confidence: ConfidenceInfo }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const hoverRef = useRef(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const config = {
    high: {
      icon: ShieldCheck,
      bgColor: "bg-emerald-100 dark:bg-emerald-500/20",
      textColor: "text-emerald-700 dark:text-emerald-400",
      borderColor: "border-emerald-300 dark:border-emerald-500/30",
      label: "High Confidence",
    },
    medium: {
      icon: ShieldQuestion,
      bgColor: "bg-amber-100 dark:bg-amber-500/20",
      textColor: "text-amber-700 dark:text-amber-400",
      borderColor: "border-amber-300 dark:border-amber-500/30",
      label: "Medium Confidence",
    },
    low: {
      icon: ShieldAlert,
      bgColor: "bg-red-100 dark:bg-red-500/20",
      textColor: "text-red-700 dark:text-red-400",
      borderColor: "border-red-300 dark:border-red-500/30",
      label: "Low Confidence",
    },
  };

  const { icon: Icon, bgColor, textColor, borderColor, label } = config[confidence.level];

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    hoverRef.current = true;
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    hoverRef.current = false;
    // Small delay to allow moving between badge and tooltip
    closeTimeoutRef.current = setTimeout(() => {
      if (!hoverRef.current) {
        setShowTooltip(false);
      }
    }, 150);
  };

  return (
    <div className="relative inline-block">
      <button
        className={cn(
          "flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border transition-all cursor-default",
          bgColor,
          textColor,
          borderColor,
          "hover:scale-105"
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Icon className="w-3.5 h-3.5" />
        <span>{label}</span>
        <Info className="w-3 h-3 opacity-60" />
      </button>

      {/* Tooltip - stays open while interacting */}
      {showTooltip && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          className="absolute left-0 bottom-full mb-2 z-[100] w-64 p-3 rounded-lg bg-zinc-800 border border-zinc-700 shadow-xl text-xs"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="font-semibold mb-2 text-white">Confidence Breakdown</div>
          <div className="space-y-1.5 text-zinc-300">
            <div className="flex justify-between">
              <span>Retrieval Match:</span>
              <span className="font-mono">{(confidence.retrievalConfidence * 100).toFixed(0)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Consistency:</span>
              <span className="font-mono">{(confidence.consistencyConfidence * 100).toFixed(0)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Query Coverage:</span>
              <span className="font-mono">{(confidence.coverageConfidence * 100).toFixed(0)}%</span>
            </div>
            <div className="border-t border-zinc-600 pt-1.5 mt-2 flex justify-between font-semibold text-white">
              <span>Overall:</span>
              <span className="font-mono">{(confidence.overallConfidence * 100).toFixed(0)}%</span>
            </div>
          </div>
          <p className="mt-2 text-zinc-400 italic">{confidence.explanation}</p>

          {/* Arrow pointing down */}
          <div className="absolute left-4 bottom-0 translate-y-full w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-zinc-700"></div>
        </motion.div>
      )}
    </div>
  );
}

export function ChatFeed({ messages, loading, onCitationClick }: ChatFeedProps) {
  const endRef = useRef<HTMLDivElement>(null);
  const { accentColor } = useSettings();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="flex w-full flex-1 flex-col overflow-y-auto">
      <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col space-y-6 p-4 pb-32">
        {messages.length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center text-center text-sm text-[var(--text-secondary)] dark:text-white/60">
            <p className="font-semibold text-[var(--text-primary)] dark:text-white">
              Drop a prompt ✨
            </p>
            <p className="mt-2 max-w-sm text-xs">
              Load a single document or URL, then start chatting. Responses stay
              grounded in your source.
            </p>
          </div>
        )}

        {messages.map((message) => {
          const { text, graph } = parseMessageContent(message.content);
          const isUser = message.role === "user";

          return (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={message.id}
              className={cn(
                "flex w-full",
                isUser ? "justify-end" : "justify-start"
              )}
            >
              {!isUser && (
                <div
                  className="mr-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white shadow-sm"
                  style={{ backgroundColor: accentColor }}
                >
                  A
                </div>
              )}

              <div
                className={cn(
                  "relative max-w-[85%] text-sm leading-relaxed",
                  isUser
                    ? "rounded-2xl px-5 py-3 text-white shadow-sm"
                    : "pt-1 text-[var(--text-primary)] dark:text-gray-100"
                )}
                style={
                  isUser
                    ? { backgroundColor: "#27272a" } // Dark grey for user bubble
                    : undefined
                }
              >
                {text ? (
                  isUser ? (
                    <p className="whitespace-pre-line">{text}</p>
                  ) : (
                    // Assistant messages: render with citation highlighting
                    <div className="whitespace-pre-line group relative">
                      {hasCitations(text) && message.references ? (
                        <CitationHighlight
                          text={text}
                          references={message.references}
                          onCitationClick={onCitationClick}
                        />
                      ) : (
                        <span>{text}</span>
                      )}

                      {/* Message actions - copy, thumbs up/down */}
                      <MessageActions text={text} />
                    </div>
                  )
                ) : (
                  <span className="animate-pulse text-xs italic opacity-70">
                    Thinking...
                  </span>
                )}
                {graph && <GraphRenderer graph={graph} />}

                {/* Confidence Badge for assistant messages */}
                {!isUser && message.confidence && (
                  <div className="mt-3 pt-2 border-t border-zinc-700/50">
                    <ConfidenceBadge confidence={message.confidence} />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}

        {loading && <MessageSkeleton />}

        <div ref={endRef} />
      </div>
    </div>
  );
}
