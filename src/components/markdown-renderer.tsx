"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

/**
 * Markdown renderer with GitHub-flavored markdown and syntax highlighting
 */
export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        setIsDark(document.documentElement.classList.contains("dark"));
    }, []);

    return (
        <div className={cn("prose prose-sm dark:prose-invert max-w-none", className)}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    // Code blocks with syntax highlighting
                    code({ node, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || "");
                        const language = match ? match[1] : "";
                        const codeString = String(children).replace(/\n$/, "");

                        if (language) {
                            return (
                                <CodeHighlight
                                    code={codeString}
                                    language={language}
                                    isDark={isDark}
                                />
                            );
                        }

                        // Inline code
                        return (
                            <code
                                className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 text-pink-600 dark:text-pink-400 text-sm font-mono"
                                {...props}
                            >
                                {children}
                            </code>
                        );
                    },

                    // Links
                    a({ href, children }) {
                        return (
                            <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                {children}
                            </a>
                        );
                    },

                    // Tables
                    table({ children }) {
                        return (
                            <div className="overflow-x-auto my-4">
                                <table className="min-w-full border border-zinc-300 dark:border-zinc-700 rounded">
                                    {children}
                                </table>
                            </div>
                        );
                    },

                    th({ children }) {
                        return (
                            <th className="px-3 py-2 bg-zinc-100 dark:bg-zinc-800 text-left font-semibold border-b border-zinc-300 dark:border-zinc-700">
                                {children}
                            </th>
                        );
                    },

                    td({ children }) {
                        return (
                            <td className="px-3 py-2 border-b border-zinc-200 dark:border-zinc-700">
                                {children}
                            </td>
                        );
                    },

                    // Lists
                    ul({ children }) {
                        return <ul className="list-disc list-inside space-y-1 my-2">{children}</ul>;
                    },

                    ol({ children }) {
                        return <ol className="list-decimal list-inside space-y-1 my-2">{children}</ol>;
                    },

                    // Blockquotes
                    blockquote({ children }) {
                        return (
                            <blockquote className="border-l-4 border-blue-500 pl-4 my-4 italic text-zinc-600 dark:text-zinc-400">
                                {children}
                            </blockquote>
                        );
                    },

                    // Headings
                    h1({ children }) {
                        return <h1 className="text-xl font-bold mt-4 mb-2">{children}</h1>;
                    },
                    h2({ children }) {
                        return <h2 className="text-lg font-bold mt-3 mb-2">{children}</h2>;
                    },
                    h3({ children }) {
                        return <h3 className="text-base font-semibold mt-2 mb-1">{children}</h3>;
                    },

                    // Paragraphs
                    p({ children }) {
                        return <p className="my-2 leading-relaxed">{children}</p>;
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}

/**
 * Code block with copy button and syntax highlighting
 */
function CodeHighlight({ code, language, isDark }: { code: string; language: string; isDark: boolean }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group my-4 rounded-lg overflow-hidden">
            <div className="absolute top-0 left-0 px-2 py-1 text-xs font-mono bg-zinc-700 text-zinc-300 rounded-br">
                {language}
            </div>

            <button
                onClick={handleCopy}
                className={cn(
                    "absolute top-2 right-2 p-1.5 rounded transition-all",
                    "bg-zinc-700 hover:bg-zinc-600 text-zinc-300",
                    "opacity-0 group-hover:opacity-100"
                )}
                title={copied ? "Copied!" : "Copy code"}
            >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>

            <SyntaxHighlighter
                language={language}
                style={isDark ? oneDark : oneLight}
                customStyle={{
                    margin: 0,
                    padding: "2rem 1rem 1rem 1rem",
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                }}
            >
                {code}
            </SyntaxHighlighter>
        </div>
    );
}
