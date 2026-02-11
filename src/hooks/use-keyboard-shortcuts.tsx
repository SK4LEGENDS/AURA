"use client";

import { useEffect, useCallback } from "react";

interface KeyboardShortcuts {
    onNewChat?: () => void;
    onSearch?: () => void;
    onHelp?: () => void;
    onEscape?: () => void;
    onToggleSidebar?: () => void;
}

/**
 * Global keyboard shortcuts hook
 * 
 * Shortcuts:
 * - Ctrl+N / Cmd+N: New chat
 * - Ctrl+K / Cmd+K: Focus search / new chat
 * - Ctrl+/ / Cmd+/: Open help
 * - Ctrl+B / Cmd+B: Toggle sidebar
 * - Escape: Close modals
 */
export function useKeyboardShortcuts({
    onNewChat,
    onSearch,
    onHelp,
    onEscape,
    onToggleSidebar,
}: KeyboardShortcuts) {
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        // Don't trigger shortcuts when typing in inputs
        const target = event.target as HTMLElement;
        const isInput = target.tagName === "INPUT" ||
            target.tagName === "TEXTAREA" ||
            target.isContentEditable;

        const isMod = event.ctrlKey || event.metaKey;

        // Escape - always works
        if (event.key === "Escape") {
            event.preventDefault();
            onEscape?.();
            return;
        }

        // Skip other shortcuts if in input (unless using modifier)
        if (isInput && !isMod) return;

        // Ctrl+N - New chat
        if (isMod && event.key === "n") {
            event.preventDefault();
            onNewChat?.();
            return;
        }

        // Ctrl+K - Search / focus
        if (isMod && event.key === "k") {
            event.preventDefault();
            onSearch?.();
            return;
        }

        // Ctrl+/ - Help
        if (isMod && event.key === "/") {
            event.preventDefault();
            onHelp?.();
            return;
        }

        // Ctrl+B - Toggle sidebar
        if (isMod && event.key === "b") {
            event.preventDefault();
            onToggleSidebar?.();
            return;
        }
    }, [onNewChat, onSearch, onHelp, onEscape, onToggleSidebar]);

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);
}

/**
 * Keyboard shortcut indicator component
 */
export function ShortcutHint({ keys, className }: { keys: string; className?: string }) {
    return (
        <kbd className= {`px-1.5 py-0.5 text-xs font-mono bg-zinc-200 dark:bg-zinc-700 rounded border border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-300 ${className || ""}`
}>
    { keys }
    </kbd>
    );
}
