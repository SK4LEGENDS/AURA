"use client";

import { useEffect, useRef } from "react";

/**
 * WarmupManager
 * 
 * This component triggers a background request to the /api/warmup endpoint
 * when the application loads. This ensures the LLM and embedding models
 * are loaded into memory (VRAM) before the user sends their first message.
 */
export function WarmupManager() {
    // Use a ref to ensure we only trigger this once per session/mount
    const hasTriggered = useRef(false);

    useEffect(() => {
        if (hasTriggered.current) return;

        const triggerWarmup = async () => {
            try {
                hasTriggered.current = true;
                // Fire and forget - we don't need to wait for the response
                // Use low priority to not block critical data fetching
                if ('requestIdleCallback' in window) {
                    requestIdleCallback(() => {
                        fetch("/api/warmup", { priority: "low" }).catch(err =>
                            console.debug("[WarmupManager] Warmup fetch failed (non-critical):", err)
                        );
                    });
                } else {
                    // Fallback for browsers without requestIdleCallback
                    setTimeout(() => {
                        fetch("/api/warmup").catch(err =>
                            console.debug("[WarmupManager] Warmup fetch failed (non-critical):", err)
                        );
                    }, 2000); // Delay by 2s to let main content load first
                }
            } catch (error) {
                // Ignore errors, this is an optimization
                console.debug("[WarmupManager] Error in warmup trigger:", error);
            }
        };

        triggerWarmup();
    }, []);

    // render nothing
    return null;
}
