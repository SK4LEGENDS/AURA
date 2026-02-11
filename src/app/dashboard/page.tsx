"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { ChatMessage, MessageReference as Reference, KnowledgeSource, ConfidenceInfo } from "@/types/chat";
import { Sidebar } from "@/components/sidebar";
import { ChatFeed } from "@/components/chat-feed";
import { ChatComposer } from "@/components/chat-composer";
import { UploadPanel } from "@/components/upload-panel";
import DarkVeil from "@/components/dark-veil";
import { ThemeToggle } from "@/components/theme-toggle";
import { ConfirmModal } from "@/components/confirm-modal";
import { ArchivesModal } from "@/components/archives-modal";
import { UserInsightsPanel, InsightsButton } from "@/components/user-insights";
import { SourcePanel } from "@/components/source-panel";
import { QueryHint } from "@/components/query-suggestions";
import { cn } from "@/lib/utils";
import { useSettings } from "@/lib/settings-context";
import { useChatSession } from "@/hooks/use-chat-session";
import { useAuth } from "@/hooks/use-auth";
import Image from "next/image";

export default function Dashboard() {
    const { user, loading: authLoading, signOut } = useAuth(true);
    const { accentColor, responseStyle, summaryLevel, aiModel } = useSettings();

    const {
        sessions,
        archives,
        activeSessionId,
        activeSession,
        hydrated,
        setActiveSessionId,
        upsertSession,
        handleNewChat,
        handleRenameSession,
        handleDeleteSession,
        handleArchiveSession,
        handleUnarchiveSession,
        handleDeleteArchivedSession,
        handleClearChatHistory,
        handleClearAllData,
        handleClearArchives
    } = useChatSession(user?.uid);

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const [prompt, setPrompt] = useState("");
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const [pendingUrl, setPendingUrl] = useState("");
    const [generatingSessionIds, setGeneratingSessionIds] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [references, setReferences] = useState<Reference[]>([]);
    const [isClearing, setIsClearing] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showClearHistoryModal, setShowClearHistoryModal] = useState(false);
    const [showClearDataModal, setShowClearDataModal] = useState(false);
    const [showArchivesModal, setShowArchivesModal] = useState(false);
    const [showInsightsPanel, setShowInsightsPanel] = useState(false);
    const [showSourcePanel, setShowSourcePanel] = useState(false);
    const [activeCitationIndex, setActiveCitationIndex] = useState<number | null>(null);
    const [activeReferences, setActiveReferences] = useState<Reference[]>([]);
    const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

    const chatInputRef = useRef<HTMLTextAreaElement>(null);

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // New Chat: Ctrl + K or Cmd + K
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                onNewChatClick();
            }

            // Quick Search / Focus Input: Ctrl + / or Cmd + /
            if ((e.ctrlKey || e.metaKey) && e.key === "/") {
                e.preventDefault();
                chatInputRef.current?.focus();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleNewChat]); // Logic depends on onNewChatClick -> handleNewChat

    // Sync pending URL when active session changes
    useEffect(() => {
        if (!activeSession) return;
        setPendingUrl(activeSession.sourceUrl ?? "");
        setPendingFile(null);
    }, [activeSessionId, activeSession]);

    // Warmup models on load
    useEffect(() => {
        fetch("/api/warmup").catch(err => console.error("Warmup failed:", err));
    }, []);

    // UI Handlers wrapping hook functions
    const onNewChatClick = () => {
        handleNewChat(generatingSessionIds);
        setPendingFile(null);
        setPendingUrl("");
        setReferences([]);
        setError(null);
    };

    const onConfirmDeleteSession = () => {
        if (sessionToDelete) {
            handleDeleteSession(sessionToDelete);
            setSessionToDelete(null);
            setShowDeleteModal(false);
        }
    };

    const onConfirmClearHistory = async () => {
        setIsClearing(true);
        await handleClearChatHistory();
        setPrompt("");
        setPendingFile(null);
        setPendingUrl("");
        setReferences([]);
        setError(null);
        setShowClearHistoryModal(false);
        setIsClearing(false);
    };

    const onConfirmClearData = async () => {
        setIsClearing(true);
        await handleClearAllData();
        setPrompt("");
        setPendingFile(null);
        setPendingUrl("");
        setReferences([]);
        setError(null);
        setShowClearDataModal(false);
        setIsClearing(false);
    };

    // Source & Chat Logic (remains mostly in page as it interacts with API/IO)
    const requireSession = () => {
        if (!activeSession) {
            setError("Create a chat to get started.");
            return false;
        }
        return true;
    };

    const handleFileSelect = (file: File | null) => {
        if (!requireSession()) return;
        setPendingFile(file);
        setPendingUrl("");
    };

    const handleUrlChange = (value: string) => {
        if (!requireSession()) return;
        setPendingUrl(value);
        setPendingFile(null);
    };

    const handleConfirmSource = async () => {
        if (!activeSession) return;

        setError(null);
        setGeneratingSessionIds(ids => [...ids, activeSession.id]);

        try {
            let targetSource: KnowledgeSource = null;
            let sourceName: string | undefined;
            let sourceUrl: string | undefined;
            let generatedTitle: string = "New Chat";

            if (pendingFile) {
                targetSource = "file";
                sourceName = pendingFile.name;

                // Generate chat title
                const fileNameWithoutExt = pendingFile.name.replace(/\.[^/.]+$/, "");
                generatedTitle = fileNameWithoutExt.length > 50
                    ? fileNameWithoutExt.substring(0, 50) + "..."
                    : fileNameWithoutExt;

                // Upload file
                const uploadFormData = new FormData();
                uploadFormData.append("chatId", activeSession.id);
                uploadFormData.append("type", "file");
                uploadFormData.append("file", pendingFile);

                const uploadResponse = await fetch("/api/upload", {
                    method: "POST",
                    body: uploadFormData,
                });

                const uploadResult = await uploadResponse.json();
                if (!uploadResponse.ok) {
                    throw new Error(uploadResult.error ?? "Failed to upload document");
                }

                // Update session
                upsertSession(activeSession.id, (session) => ({
                    ...session,
                    title: generatedTitle,
                    sourceType: "file",
                    sourceName,
                    sourceUrl: undefined,
                    indexed: true,
                }));

                setPendingFile(null);
            } else if (pendingUrl.trim()) {
                targetSource = "url";
                sourceUrl = pendingUrl;

                // Generate title
                try {
                    const urlObj = new URL(pendingUrl);
                    const hostname = urlObj.hostname.replace("www.", "");
                    const pathParts = urlObj.pathname.split("/").filter(p => p);
                    generatedTitle = pathParts.length > 0
                        ? `${hostname} - ${pathParts[pathParts.length - 1]} `
                        : hostname;

                    if (generatedTitle.length > 50) {
                        generatedTitle = generatedTitle.substring(0, 50) + "...";
                    }
                } catch {
                    generatedTitle = "Web Document";
                }

                // Upload URL
                const uploadFormData = new FormData();
                uploadFormData.append("chatId", activeSession.id);
                uploadFormData.append("type", "url");
                uploadFormData.append("url", pendingUrl);

                const uploadResponse = await fetch("/api/upload", {
                    method: "POST",
                    body: uploadFormData,
                });

                const uploadResult = await uploadResponse.json();
                if (!uploadResponse.ok) {
                    throw new Error(uploadResult.error ?? "Failed to upload URL");
                }

                // Update session
                upsertSession(activeSession.id, (session) => ({
                    ...session,
                    title: generatedTitle,
                    sourceType: "url",
                    sourceUrl,
                    sourceName: undefined,
                    indexed: true,
                }));
            }
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Failed to process source";
            setError(message);
        } finally {
            setGeneratingSessionIds(ids => ids.filter(id => id !== activeSession.id));
        }
    };

    const handleCancelSource = () => {
        setPendingFile(null);
        setPendingUrl("");
    };

    const handleRemoveSource = () => {
        if (!activeSession) return;
        upsertSession(activeSessionId, (session) => ({
            ...session,
            sourceType: null,
            sourceName: undefined,
            sourceUrl: undefined,
            indexed: false,
        }));
        setPendingFile(null);
        setPendingUrl("");
    };

    const determineSource = (): KnowledgeSource => {
        if (activeSession?.sourceType) return activeSession.sourceType;
        if (pendingFile) return "file";
        if (pendingUrl.trim()) return "url";
        return null;
    };

    const handleSend = async () => {
        if (!requireSession() || !activeSession) return;
        if (!prompt.trim()) return;
        const targetSource = determineSource();

        setError(null);
        setReferences([]);
        const now = new Date().toISOString();
        const userMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: "user",
            content: prompt.trim(),
            createdAt: now,
        };

        upsertSession(activeSession.id, (session) => ({
            ...session,
            messages: [...session.messages, userMessage],
            updatedAt: now,
        }));
        setPrompt("");
        setGeneratingSessionIds(ids => [...ids, activeSession.id]);

        try {
            // Step 1: Upload document if needed (auto-upload)
            if (targetSource && !activeSession.indexed) {
                const uploadFormData = new FormData();
                uploadFormData.append("chatId", activeSession.id);
                uploadFormData.append("type", targetSource);

                if (targetSource === "file") {
                    if (!pendingFile) {
                        throw new Error("File is required.");
                    }
                    uploadFormData.append("file", pendingFile);
                } else if (targetSource === "url") {
                    uploadFormData.append("url", pendingUrl || activeSession.sourceUrl || "");
                }

                const uploadResponse = await fetch("/api/upload", {
                    method: "POST",
                    body: uploadFormData,
                });

                const uploadResult = await uploadResponse.json();
                if (!uploadResponse.ok) {
                    throw new Error(uploadResult.error ?? "Failed to upload document");
                }

                // Mark session as indexed
                upsertSession(activeSession.id, (session) => ({
                    ...session,
                    sourceType: targetSource,
                    sourceName: targetSource === "file" ? pendingFile?.name : undefined,
                    sourceUrl: targetSource === "url" ? (pendingUrl || activeSession.sourceUrl) : undefined,
                    indexed: true,
                }));

                if (targetSource === "file") {
                    setPendingFile(null);
                }
            }

            // Step 2: Send chat
            const chatResponse = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chatId: activeSession.id,
                    message: userMessage.content,
                    responseStyle,
                    summaryLevel,
                    model: aiModel,
                }),
            });

            if (!chatResponse.ok) {
                const errorResult = await chatResponse.json();
                throw new Error(errorResult.error ?? "Request failed.");
            }

            if (!chatResponse.body) {
                throw new Error("No response body received.");
            }

            // Placeholder assistant message
            const assistantMessageId = crypto.randomUUID();
            const assistantMessage: ChatMessage = {
                id: assistantMessageId,
                role: "assistant",
                content: "",
                createdAt: new Date().toISOString(),
            };

            upsertSession(activeSession.id, (session) => ({
                ...session,
                messages: [...session.messages, assistantMessage],
            }));

            const reader = chatResponse.body.getReader();
            const decoder = new TextDecoder();
            let done = false;
            let accumulatedAnswer = "";

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                const chunkValue = decoder.decode(value, { stream: !done });
                const lines = chunkValue.split("\n").filter((line) => line.trim() !== "");

                for (const line of lines) {
                    try {
                        const data = JSON.parse(line);
                        if (data.type === "references") {
                            setReferences(data.data);
                            upsertSession(activeSession.id, (session) => ({
                                ...session,
                                messages: session.messages.map((msg) =>
                                    msg.id === assistantMessageId ? { ...msg, references: data.data } : msg
                                ),
                            }));
                        } else if (data.type === "confidence") {
                            // Handle confidence data from stream
                            const confidenceData: ConfidenceInfo = data.data;
                            upsertSession(activeSession.id, (session) => ({
                                ...session,
                                messages: session.messages.map((msg) =>
                                    msg.id === assistantMessageId ? { ...msg, confidence: confidenceData } : msg
                                ),
                            }));
                        } else if (data.type === "token") {
                            accumulatedAnswer += data.content;
                            upsertSession(activeSession.id, (session) => ({
                                ...session,
                                messages: session.messages.map((msg) =>
                                    msg.id === assistantMessageId ? { ...msg, content: accumulatedAnswer } : msg
                                ),
                            }));
                        } else if (data.type === "error") {
                            throw new Error(data.content);
                        }
                    } catch (e) {
                        console.error("Error parsing stream chunk:", e);
                    }
                }
            }

            upsertSession(activeSession.id, (session) => ({
                ...session,
                updatedAt: new Date().toISOString(),
            }));

        } catch (err) {
            const message = err instanceof Error ? err.message : "Unable to complete your request.";
            setError(message);
        } finally {
            setGeneratingSessionIds(ids => ids.filter(id => id !== activeSession.id));
        }
    };

    if (authLoading || !user || !hydrated || !activeSession) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[var(--background)] text-[var(--text-primary)]">
                Loading...
            </div>
        );
    }

    const showGreeting = activeSession.messages.length === 0;

    return (
        <div className="flex h-screen overflow-hidden text-[var(--text-primary)]">
            {/* Background */}
            <div className="fixed inset-0 -z-10">
                <DarkVeil accentColor={accentColor} />
            </div>

            <Sidebar
                sessions={sessions}
                activeSessionId={activeSessionId}
                collapsed={sidebarCollapsed}
                onSelect={(id) => {
                    setActiveSessionId(id);
                    setReferences([]);
                    setError(null);
                }}
                onNewChat={onNewChatClick}
                onRename={handleRenameSession}
                onDelete={(id) => {
                    setSessionToDelete(id);
                    setShowDeleteModal(true);
                }}
                onArchive={handleArchiveSession}
                onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
                onClearChatHistory={() => setShowClearHistoryModal(true)}
                onClearSavedData={() => setShowClearDataModal(true)}
                onClearArchives={handleClearArchives}
                onViewArchives={() => setShowArchivesModal(true)}
                onViewInsights={() => setShowInsightsPanel(true)}
                onLogOut={signOut}
                user={user}
            />

            <main className="relative flex flex-1 flex-col h-full overflow-hidden">
                <div className="absolute right-4 top-4 z-10">
                    <ThemeToggle />
                </div>

                <div className="flex flex-1 min-h-0 overflow-hidden">
                    <div className={cn("flex flex-1 flex-col items-center p-4 min-h-0", showGreeting && "justify-center")}>
                        {showGreeting ? (
                            <div className="mb-8 flex flex-col items-center gap-6">
                                <h1 className="text-3xl font-semibold text-[var(--text-primary)] dark:text-white">
                                    What are you working on?
                                </h1>
                            </div>
                        ) : (
                            <div className="flex flex-1 min-h-0 w-full flex-col pt-10">
                                <ChatFeed
                                    messages={activeSession.messages}
                                    loading={generatingSessionIds.includes(activeSession.id)}
                                    onCitationClick={(index, ref) => {
                                        const msg = activeSession.messages.find(m => m.references?.some(r => r.id === ref.id));
                                        if (msg && msg.references) {
                                            setActiveReferences(msg.references);
                                        }
                                        setActiveCitationIndex(index);
                                        setShowSourcePanel(true);
                                    }}
                                />
                            </div>
                        )}

                        <div className={cn("w-full max-w-3xl", !showGreeting && "mt-auto pb-6")}>
                            {error && (
                                <div className="mb-4 rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400 border border-red-500/20">
                                    {error}
                                </div>
                            )}

                            {showGreeting && (
                                <div className="mb-6 flex justify-center">
                                    <UploadPanel
                                        sourceType={activeSession.sourceType}
                                        sourceName={activeSession.sourceName}
                                        sourceUrl={activeSession.sourceUrl}
                                        disabled={activeSession.indexed || generatingSessionIds.includes(activeSession.id)}
                                        pendingUrl={pendingUrl}
                                        hasPendingFile={!!pendingFile}
                                        canRemove={false}
                                        onFileSelect={handleFileSelect}
                                        onUrlChange={handleUrlChange}
                                        onConfirm={handleConfirmSource}
                                        onCancel={handleCancelSource}
                                        onRemove={handleRemoveSource}
                                        error={!!error}
                                    />
                                </div>
                            )}

                            <ChatComposer
                                ref={chatInputRef}
                                prompt={prompt}
                                onPromptChange={setPrompt}
                                onSubmit={handleSend}
                                disabled={generatingSessionIds.includes(activeSession.id)}
                            />
                        </div>
                    </div>

                    <SourcePanel
                        isOpen={showSourcePanel}
                        onClose={() => setShowSourcePanel(false)}
                        references={activeReferences}
                        activeIndex={activeCitationIndex}
                        onSourceClick={(index) => setActiveCitationIndex(index)}
                    />
                </div>
            </main>

            <ConfirmModal
                isOpen={showDeleteModal}
                title="Delete Chat"
                message="Are you sure you want to delete this chat? This action cannot be undone."
                onConfirm={onConfirmDeleteSession}
                onCancel={() => setShowDeleteModal(false)}
            />

            <ConfirmModal
                isOpen={showClearHistoryModal}
                title="Delete All Chat History"
                message="Are you sure you want to delete all chat history? This action cannot be undone."
                onConfirm={onConfirmClearHistory}
                onCancel={() => setShowClearHistoryModal(false)}
                isLoading={isClearing}
            />

            <ConfirmModal
                isOpen={showClearDataModal}
                title="Reset Application Data"
                message="Are you sure you want to delete ALL data? This includes all chat history and uploaded documents from both the server and your device. This action cannot be undone."
                onConfirm={onConfirmClearData}
                onCancel={() => setShowClearDataModal(false)}
                isLoading={isClearing}
            />

            <ArchivesModal
                isOpen={showArchivesModal}
                onClose={() => setShowArchivesModal(false)}
                archives={archives}
                onUnarchive={handleUnarchiveSession}
                onDelete={handleDeleteArchivedSession}
            />

            {/* User Insights Panel */}
            <UserInsightsPanel
                userId={user?.uid || ""}
                isOpen={showInsightsPanel}
                onClose={() => setShowInsightsPanel(false)}
            />
        </div>
    );
}
