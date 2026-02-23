"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import {
    X,
    Keyboard,
    Book,
    MessageCircle,
    FileText,
    ExternalLink,
    Command
} from "lucide-react";

import { useI18n } from "@/lib/i18n-context";

type HelpDialogProps = {
    isOpen: boolean;
    onClose: () => void;
};

export function HelpDialog({ isOpen, onClose }: HelpDialogProps) {
    const [mounted, setMounted] = useState(false);
    const { t } = useI18n();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!mounted) return null;
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 p-4">
            <div className="flex max-h-[85vh] w-[600px] flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl dark:border-white/10 dark:bg-zinc-900">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-black/5 px-6 py-4 dark:border-white/5">
                    <h2 className="text-xl font-bold text-(--text-primary)">{t("help.title")}</h2>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-(--text-secondary) transition hover:bg-black/5 hover:text-(--text-primary) dark:hover:bg-white/10"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-8">

                        {/* Keyboard Shortcuts */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-2 text-(--text-primary)">
                                <div className="rounded-lg bg-slate-50 p-2 dark:bg-zinc-800">
                                    <Keyboard className="h-5 w-5" />
                                </div>
                                <h3 className="font-semibold">{t("help.shortcuts.title")}</h3>
                            </div>
                            <div className="grid gap-3">
                                <ShortcutRow keys={["Ctrl", "K"]} label={t("help.shortcuts.newChat")} />
                                <ShortcutRow keys={["Ctrl", "/"]} label={t("help.shortcuts.quickSearch")} />
                                <ShortcutRow keys={["Esc"]} label={t("help.shortcuts.closeDialogs")} />
                            </div>
                        </section>

                        <div className="h-px w-full bg-black/5 dark:bg-white/5" />

                        {/* Resources */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-2 text-(--text-primary)">
                                <div className="rounded-lg bg-slate-50 p-2 dark:bg-zinc-800">
                                    <Book className="h-5 w-5" />
                                </div>
                                <h3 className="font-semibold">{t("help.resources.title")}</h3>
                            </div>
                            <div className="grid gap-3">
                                <ResourceLink
                                    icon={<FileText className="h-4 w-4" />}
                                    label={t("help.resources.docsLabel")}
                                    description={t("help.resources.docsDesc")}
                                    href="/docs"
                                />
                                <ResourceLink
                                    icon={<MessageCircle className="h-4 w-4" />}
                                    label={t("help.resources.supportLabel")}
                                    description={t("help.resources.supportDesc")}
                                    href="#"
                                />
                                <ResourceLink
                                    icon={<ExternalLink className="h-4 w-4" />}
                                    label={t("help.resources.privacyLabel")}
                                    description={t("help.resources.privacyDesc")}
                                    href="/privacy"
                                />
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}

function ShortcutRow({ keys, label }: { keys: string[]; label: string }) {
    return (
        <div className="flex items-center justify-between rounded-lg border border-black/5 bg-slate-50 px-3 py-2 dark:border-white/5 dark:bg-zinc-800/50">
            <span className="text-sm font-medium text-(--text-secondary)">{label}</span>
            <div className="flex gap-1">
                {keys.map((key) => (
                    <kbd
                        key={key}
                        className="min-w-6 rounded bg-white px-1.5 py-0.5 text-center text-xs font-bold text-black border border-black/10 shadow-sm"
                    >
                        {key}
                    </kbd>
                ))}
            </div>
        </div>
    );
}

function ResourceLink({
    icon,
    label,
    description,
    href
}: {
    icon: React.ReactNode;
    label: string;
    description: string;
    href: string;
}) {
    return (
        <a
            href={href}
            className="group flex items-center justify-between rounded-xl border border-black/5 bg-transparent p-3 transition-all hover:bg-black/5 hover:border-black/10 dark:border-white/5 dark:hover:bg-white/5 dark:hover:border-white/10"
        >
            <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-(--text-secondary) transition-colors group-hover:text-(--text-primary) dark:bg-zinc-800">
                    {icon}
                </div>
                <div>
                    <h4 className="text-sm font-medium text-(--text-primary)">{label}</h4>
                    <p className="text-xs text-(--text-secondary)">{description}</p>
                </div>
            </div>
            <ExternalLink className="h-4 w-4 text-(--text-secondary) opacity-0 transition-all group-hover:opacity-100" />
        </a>
    );
}
