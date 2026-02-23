"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

type ToastType = "info" | "success" | "warning" | "error";

interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

interface ToastContextType {
    toasts: Toast[];
    showToast: (message: string, type?: ToastType, duration?: number) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const showToast = useCallback((message: string, type: ToastType = "info", duration = 4000) => {
        const id = crypto.randomUUID();
        setToasts((prev) => [...prev, { id, message, type, duration }]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, [removeToast]);

    return (
        <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
            {children}
            <ToastContainer />
        </ToastContext.Provider>
    );
}

function ToastContainer() {
    const context = useContext(ToastContext);
    if (!context) return null;

    return (
        <div className="fixed bottom-6 right-6 z-10001 flex flex-col gap-3 pointer-events-none">
            {context.toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} />
            ))}
        </div>
    );
}

import { motion, AnimatePresence } from "framer-motion";
import { Info, CheckCircle2, AlertTriangle, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

function ToastItem({ toast }: { toast: Toast }) {
    const context = useContext(ToastContext);

    const icons = {
        info: <Info className="h-4 w-4 text-blue-400" />,
        success: <CheckCircle2 className="h-4 w-4 text-green-400" />,
        warning: <AlertTriangle className="h-4 w-4 text-orange-400" />,
        error: <AlertCircle className="h-4 w-4 text-red-400" />,
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={cn(
                "pointer-events-auto flex items-center gap-3 min-w-[320px] max-w-md rounded-xl border border-white/10 p-4 shadow-2xl backdrop-blur-md",
                "bg-zinc-900/90 text-white"
            )}
        >
            <div className="shrink-0">{icons[toast.type]}</div>
            <p className="flex-1 text-sm font-medium leading-relaxed">{toast.message}</p>
            <button
                onClick={() => context?.removeToast(toast.id)}
                className="ml-2 shrink-0 text-white/40 hover:text-white"
            >
                <X className="h-4 w-4" />
            </button>
        </motion.div>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}
