
import { useState, useEffect, useCallback, useMemo } from 'react';
import { ChatSession, ChatMessage } from '@/types/chat';

const storageKey = 'lavender-rag-sessions';
const archivesKey = 'lavender-rag-archives';

const createSession = (label?: string): ChatSession => {
    const now = new Date().toISOString();
    return {
        id: crypto.randomUUID(),
        title: label ?? 'Lavender chat',
        createdAt: now,
        updatedAt: now,
        sourceType: null,
        indexed: false,
        messages: [],
    };
};

export function useChatSession(userId?: string) {
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [activeSessionId, setActiveSessionId] = useState<string>('');
    const [archives, setArchives] = useState<ChatSession[]>([]);
    const [hydrated, setHydrated] = useState(false);

    const storageKey = useMemo(() => userId ? `lavender-rag-sessions-${userId}` : 'lavender-rag-sessions', [userId]);
    const archivesKey = useMemo(() => userId ? `lavender-rag-archives-${userId}` : 'lavender-rag-archives', [userId]);

    // Initial Load
    useEffect(() => {
        if (typeof window === 'undefined') return;
        // If userId is undefined (loading), don't load yet or load default? 
        // Better to wait.
        if (!userId) return;

        const saved = localStorage.getItem(storageKey);
        const savedArchives = localStorage.getItem(archivesKey);

        if (saved) {
            try {
                const parsed = JSON.parse(saved) as ChatSession[];
                if (parsed.length) {
                    setSessions(parsed);
                    setActiveSessionId(parsed[0].id);
                } else {
                    const initial = createSession('New Chat');
                    setSessions([initial]);
                    setActiveSessionId(initial.id);
                }
            } catch (error) {
                console.error('Failed to parse saved sessions:', error);
                const initial = createSession('New Chat');
                setSessions([initial]);
                setActiveSessionId(initial.id);
            }
        } else {
            const initial = createSession('New Chat');
            setSessions([initial]);
            setActiveSessionId(initial.id);
        }

        if (savedArchives) {
            try {
                setArchives(JSON.parse(savedArchives));
            } catch (e) {
                console.error('Failed to parse archives:', e);
            }
        }

        setHydrated(true);
    }, [storageKey, archivesKey, userId]);

    // Persistence
    useEffect(() => {
        if (!hydrated || !userId) return;
        localStorage.setItem(storageKey, JSON.stringify(sessions));
        localStorage.setItem(archivesKey, JSON.stringify(archives));
    }, [sessions, archives, hydrated, storageKey, archivesKey, userId]);

    const activeSession = useMemo(
        () => sessions.find((session) => session.id === activeSessionId),
        [sessions, activeSessionId]
    );

    const upsertSession = useCallback(
        (sessionId: string, updater: (session: ChatSession) => ChatSession) => {
            setSessions((prev) =>
                prev.map((session) =>
                    session.id === sessionId ? updater(session) : session
                )
            );
        },
        []
    );

    const handleNewChat = useCallback((excludeIds: string[] = []) => {
        // Check if the current active session is empty. If so, just stay there.
        // Or if ANY existing session is empty and has the default title, reuse it.
        const emptySession = sessions.find(s =>
            s.messages.length === 0 &&
            s.title === 'New Chat' &&
            !s.sourceType &&
            !excludeIds.includes(s.id)
        );

        if (emptySession) {
            setActiveSessionId(emptySession.id);
            return emptySession;
        }

        const fresh = createSession('New Chat');
        setSessions((prev) => [fresh, ...prev]);
        setActiveSessionId(fresh.id);
        return fresh;
    }, [sessions]);

    const handleRenameSession = useCallback((sessionId: string, newTitle: string) => {
        const trimmed = newTitle.trim();
        if (!trimmed) return;
        upsertSession(sessionId, (session) => ({
            ...session,
            title: trimmed,
            updatedAt: new Date().toISOString(),
        }));
    }, [upsertSession]);

    const handleDeleteSession = useCallback(async (sessionId: string) => {
        try {
            await fetch('/api/chat', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chatId: sessionId }),
            });
        } catch (error) {
            console.error('Failed to delete chat from server:', error);
        }

        setSessions((prev) => {
            const filtered = prev.filter((session) => session.id !== sessionId);
            if (filtered.length === 0) {
                const fallback = createSession('New Chat');
                setActiveSessionId(fallback.id);
                return [fallback];
            }
            if (sessionId === activeSessionId) {
                setActiveSessionId(filtered[0].id);
            }
            return filtered;
        });
    }, [activeSessionId]);

    const handleArchiveSession = useCallback((sessionId: string) => {
        const sessionToArchive = sessions.find((s) => s.id === sessionId);
        if (!sessionToArchive) return;

        setArchives((prev) => [sessionToArchive, ...prev]);

        setSessions((prev) => {
            const filtered = prev.filter((s) => s.id !== sessionId);
            if (filtered.length === 0) {
                const fallback = createSession('New Chat');
                setActiveSessionId(fallback.id);
                return [fallback];
            }
            if (sessionId === activeSessionId) {
                setActiveSessionId(filtered[0].id);
            }
            return filtered;
        });
    }, [sessions, activeSessionId]);

    const handleUnarchiveSession = useCallback((sessionId: string) => {
        const sessionToRestore = archives.find((s) => s.id === sessionId);
        if (!sessionToRestore) return;

        setSessions((prev) => [sessionToRestore, ...prev]);
        setArchives((prev) => prev.filter((s) => s.id !== sessionId));
        setActiveSessionId(sessionToRestore.id);
    }, [archives]);

    const handleDeleteArchivedSession = useCallback((sessionId: string) => {
        setArchives((prev) => prev.filter((s) => s.id !== sessionId));
    }, []);

    const handleClearChatHistory = useCallback(async () => {
        try {
            await fetch('/api/chat', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ all: true }),
            });
        } catch (error) {
            console.error('Failed to clear chat history from server:', error);
        }

        const newSession = createSession('New Chat');
        setSessions([newSession]);
        setActiveSessionId(newSession.id);
        return newSession;
    }, []);

    const handleClearAllData = useCallback(async () => {
        try {
            await fetch('/api/chat', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ all: true }),
            });
        } catch (error) {
            console.error('Failed to clear data from server:', error);
        }

        if (userId) {
            localStorage.removeItem(storageKey);
            localStorage.removeItem(archivesKey);
        }

        const newSession = createSession('New Chat');
        setSessions([newSession]);
        setArchives([]);
        setActiveSessionId(newSession.id);
        return newSession;
    }, [userId, storageKey, archivesKey]);

    const handleClearArchives = useCallback(() => {
        setArchives([]);
    }, []);

    return {
        sessions,
        archives,
        activeSessionId,
        activeSession,
        hydrated,
        setSessions,
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
    };
}
