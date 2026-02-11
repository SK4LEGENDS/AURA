"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
    className?: string;
}

/**
 * Base skeleton component with shimmer animation
 */
export function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-700",
                className
            )}
        />
    );
}

/**
 * Skeleton for chat messages
 */
export function MessageSkeleton() {
    return (
        <div className="flex gap-4 animate-pulse">
            {/* Avatar */}
            <div className="w-8 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-700 shrink-0" />

            {/* Content */}
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
            </div>
        </div>
    );
}

/**
 * Skeleton for chat session list items
 */
export function ChatSessionSkeleton() {
    return (
        <div className="flex items-center gap-3 px-3 py-2.5 animate-pulse">
            <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
            </div>
        </div>
    );
}

/**
 * Skeleton for document upload/processing
 */
export function DocumentSkeleton() {
    return (
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 animate-pulse">
            <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                </div>
            </div>
            <Skeleton className="h-2 w-full mt-3 rounded-full" />
        </div>
    );
}

/**
 * Skeleton for analytics cards
 */
export function AnalyticsCardSkeleton() {
    return (
        <div className="p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 animate-pulse">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-24" />
        </div>
    );
}

/**
 * Skeleton for the full chat feed
 */
export function ChatFeedSkeleton() {
    return (
        <div className="space-y-6 p-4">
            <MessageSkeleton />
            <div className="flex gap-4 justify-end animate-pulse">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                </div>
                <div className="w-8 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-700 shrink-0" />
            </div>
            <MessageSkeleton />
        </div>
    );
}

/**
 * Loading spinner
 */
export function Spinner({ className }: { className?: string }) {
    return (
        <div className={cn("animate-spin", className)}>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <circle
                    className="opacity-25"
                    cx="12" cy="12" r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                />
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
            </svg>
        </div>
    );
}
