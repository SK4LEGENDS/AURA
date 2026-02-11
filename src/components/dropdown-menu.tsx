"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

type DropdownMenuProps = {
    trigger: ReactNode;
    children: ReactNode;
    align?: "left" | "right";
    side?: "bottom" | "right";
};

export function DropdownMenu({
    trigger,
    children,
    align = "right",
    side = "bottom"
}: DropdownMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState<{ top?: number; left: number; bottom?: number }>({ top: 0, left: 0 });

    useEffect(() => {
        const updatePosition = () => {
            if (triggerRef.current) {
                const rect = triggerRef.current.getBoundingClientRect();
                let top: number | undefined = 0;
                let left = 0;
                let bottom: number | undefined;

                if (side === "bottom") {
                    top = rect.bottom + 4;
                    left = align === "right" ? rect.right : rect.left;
                } else if (side === "right") {
                    left = rect.right + 8;
                    // If trigger is in the bottom half of the viewport, align bottom
                    if (rect.top > window.innerHeight / 2) {
                        bottom = window.innerHeight - rect.bottom;
                        top = undefined;
                    } else {
                        top = rect.top;
                    }
                }

                setPosition({ top, left, bottom });
            }
        };

        if (isOpen) {
            updatePosition();
            window.addEventListener("resize", updatePosition);
            window.addEventListener("scroll", updatePosition, true);
        }

        return () => {
            window.removeEventListener("resize", updatePosition);
            window.removeEventListener("scroll", updatePosition, true);
        };
    }, [isOpen, side, align]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (triggerRef.current && triggerRef.current.contains(event.target as Node)) {
                return;
            }
            const menu = document.getElementById("dropdown-portal-content");
            if (menu && menu.contains(event.target as Node)) {
                return;
            }
            setIsOpen(false);
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <>
            <div ref={triggerRef} onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
            {isOpen && createPortal(
                <div
                    id="dropdown-portal-content"
                    style={{ top: position.top, left: position.left, bottom: position.bottom }}
                    className={cn(
                        "fixed z-[9999] min-w-[180px] overflow-hidden rounded-xl border border-black/10 bg-[var(--sidebar)] p-1 shadow-xl backdrop-blur-xl dark:border-white/10",
                        side === "bottom" && (align === "right" ? "-translate-x-full" : ""),
                        // For side="right", we don't need translation if we calculated left correctly
                    )}
                >
                    {children}
                </div>,
                document.body
            )}
        </>
    );
}

type DropdownItemProps = {
    icon?: ReactNode;
    label: string;
    onClick?: () => void;
    className?: string;
    variant?: "default" | "danger";
    rightSlot?: ReactNode;
};

export function DropdownItem({
    icon,
    label,
    onClick,
    className,
    variant = "default",
    rightSlot,
}: DropdownItemProps) {
    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                onClick?.();
            }}
            className={cn(
                "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors",
                variant === "default"
                    ? "text-[var(--text-secondary)] hover:bg-black/5 hover:text-[var(--text-primary)] dark:hover:bg-white/10"
                    : "text-red-400 hover:bg-red-500/10 hover:text-red-300",
                className
            )}
        >
            {icon && <span className="h-4 w-4 [&>svg]:h-full [&>svg]:w-full">{icon}</span>}
            <span className="flex-1 text-left">{label}</span>
            {rightSlot && <span className="text-[var(--text-secondary)]">{rightSlot}</span>}
        </button>
    );
}

export function DropdownSeparator() {
    return <div className="my-1 h-px bg-black/5 dark:bg-white/10" />;
}
