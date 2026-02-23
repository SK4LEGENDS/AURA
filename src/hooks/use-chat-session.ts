
import { useState, useEffect, useCallback, useMemo } from 'react';
import { ChatSession, ChatMessage } from '@/types/chat';

const storageKey = 'papaya-rag-sessions';
const archivesKey = 'papaya-rag-archives';

const createSession = (label?: string): ChatSession => {
    const now = new Date().toISOString();
    return {
        id: crypto.randomUUID(),
        title: label ?? 'Papaya chat',
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

    const storageKey = useMemo(() => userId ? `papaya-rag-sessions-${userId}` : 'papaya-rag-sessions', [userId]);
    const archivesKey = useMemo(() => userId ? `papaya-rag-archives-${userId}` : 'papaya-rag-archives', [userId]);

    // Migration & Initial Load
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (!userId) return;

        // 1. Check for legacy data to migrate
        const legacyKeys = [
            userId ? `lavender-rag-sessions-${userId}` : 'lavender-rag-sessions',
            userId ? `aura-rag-sessions-${userId}` : 'aura-rag-sessions',
            'rag-sessions' // very old fallback
        ];

        const legacyArchivesKeys = [
            userId ? `lavender-rag-archives-${userId}` : 'lavender-rag-archives',
            userId ? `aura-rag-archives-${userId}` : 'aura-rag-archives'
        ];

        let migratedSessions: ChatSession[] = [];
        let migratedArchives: ChatSession[] = [];

        legacyKeys.forEach(key => {
            const legacyData = localStorage.getItem(key);
            if (legacyData) {
                try {
                    const parsed = JSON.parse(legacyData) as ChatSession[];
                    migratedSessions = [...migratedSessions, ...parsed];
                    localStorage.removeItem(key); // Clean up
                } catch (e) {
                    console.error(`Failed to migrate legacy key ${key}:`, e);
                }
            }
        });

        legacyArchivesKeys.forEach(key => {
            const legacyData = localStorage.getItem(key);
            if (legacyData) {
                try {
                    const parsed = JSON.parse(legacyData) as ChatSession[];
                    migratedArchives = [...migratedArchives, ...parsed];
                    localStorage.removeItem(key); // Clean up
                } catch (e) {
                    console.error(`Failed to migrate legacy archives key ${key}:`, e);
                }
            }
        });

        // 2. Load from current storage
        const saved = localStorage.getItem(storageKey);
        const savedArchives = localStorage.getItem(archivesKey);

        let finalSessions: ChatSession[] = [];
        let finalArchives: ChatSession[] = migratedArchives;

        if (saved) {
            try {
                finalSessions = JSON.parse(saved) as ChatSession[];
            } catch (error) {
                console.error('Failed to parse saved sessions:', error);
            }
        }

        // Merge migrated data if current is empty or just has a default empty chat
        if (migratedSessions.length > 0) {
            // Filter out default empty chats from current sessions if we have real history to restore
            const currentHasRealContent = finalSessions.some(s => s.messages.length > 0);
            if (!currentHasRealContent) {
                finalSessions = migratedSessions;
            } else {
                // If the user already started new chats, merge them (avoiding duplicates)
                const existingIds = new Set(finalSessions.map(s => s.id));
                const newMigrated = migratedSessions.filter(s => !existingIds.has(s.id));
                finalSessions = [...finalSessions, ...newMigrated];
            }
        }

        if (savedArchives) {
            try {
                const parsedArchives = JSON.parse(savedArchives) as ChatSession[];
                const existingArchiveIds = new Set(finalArchives.map(s => s.id));
                const newArchives = parsedArchives.filter(s => !existingArchiveIds.has(s.id));
                finalArchives = [...finalArchives, ...newArchives];
            } catch (e) {
                console.error('Failed to parse archives:', e);
            }
        }

        // 3. Final state update
        if (finalSessions.length) {
            setSessions(finalSessions);
            setActiveSessionId(finalSessions[0].id);
        } else {
            const initial = createSession('New Chat');
            setSessions([initial]);
            setActiveSessionId(initial.id);
        }

        setArchives(finalArchives);
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
