"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { ChatSession } from "@/types/chat";
import { X, RefreshCw, Trash2, Search, Calendar } from "lucide-react";

interface ArchivesModalProps {
    isOpen: boolean;
    onClose: () => void;
    archives: ChatSession[];
    onUnarchive: (id: string) => void;
    onDelete: (id: string) => void;
}

export function ArchivesModal({
    isOpen,
    onClose,
    archives,
    onUnarchive,
    onDelete,
}: ArchivesModalProps) {
    const [mounted, setMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !isOpen) return null;

    const filteredArchives = archives.filter(session =>
        session.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="flex h-[600px] w-[700px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#1c1c1f] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                    <h2 className="text-xl font-semibold text-white">Archived Chats</h2>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Search */}
                <div className="border-b border-white/10 px-6 py-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                        <input
                            type="text"
                            placeholder="Search archives..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-xl bg-black/20 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/40 outline-none ring-1 ring-white/10 focus:ring-white/20"
                        />
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-6">
                    {filteredArchives.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center text-center text-white/40">
                            <p>No archived chats found</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredArchives.map((session) => (
                                <div
                                    key={session.id}
                                    className="group flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-4 transition-colors hover:bg-white/10"
                                >
                                    <div className="flex flex-1 flex-col gap-1 overflow-hidden pr-4">
                                        <h3 className="truncate font-medium text-white">
                                            {session.title}
                                        </h3>
                                        <div className="flex items-center gap-2 text-xs text-white/40">
                                            <Calendar className="h-3 w-3" />
                                            <span>{new Date(session.updatedAt).toLocaleDateString()}</span>
                                            <span>•</span>
                                            <span>{session.messages.length} messages</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                                        <button
                                            onClick={() => onUnarchive(session.id)}
                                            className="rounded-lg p-2 text-white/60 hover:bg-white/10 hover:text-white"
                                            title="Unarchive"
                                        >
                                            <RefreshCw className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(session.id)}
                                            className="rounded-lg p-2 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                                            title="Delete permanently"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}
