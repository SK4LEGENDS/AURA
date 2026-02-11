"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useSettings } from "@/lib/settings-context";
import {
    Settings,
    Bell,
    Database,
    Edit3,
    Shield,
    User as UserIcon,
    X,
    Check,
    ChevronDown,
    Bot,
    Sparkles,
    Zap,
} from "lucide-react";
import { User, updateProfile } from "firebase/auth";

type SettingsDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    onClearChatHistory: () => void;
    onClearSavedData: () => void;
    onClearArchives: () => void;
    onViewArchives: () => void;
    onLogOut: () => void;
    user: User | null;
};

type SettingsTab = "general" | "notifications" | "data" | "security" | "account";

export function SettingsDialog({ isOpen, onClose, onClearChatHistory, onClearSavedData, onClearArchives, onViewArchives, onLogOut, user }: SettingsDialogProps) {
    const [activeTab, setActiveTab] = useState<SettingsTab>("general");
    const [mounted, setMounted] = useState(false);

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
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50">
            <div className="flex h-[600px] w-[800px] overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl dark:border-white/10 dark:bg-zinc-900">
                {/* Sidebar */}
                <div className="w-64 flex-shrink-0 border-r border-black/10 bg-slate-50 p-4 dark:border-white/10 dark:bg-zinc-900/50">
                    <button
                        onClick={onClose}
                        className="mb-6 rounded-lg p-2 text-(--text-secondary) transition hover:bg-black/5 hover:text-(--text-primary) dark:hover:bg-white/10"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <nav className="space-y-1">
                        <SidebarItem
                            icon={<Settings className="h-4 w-4" />}
                            label="General"
                            isActive={activeTab === "general"}
                            onClick={() => setActiveTab("general")}
                        />
                        <SidebarItem
                            icon={<Bell className="h-4 w-4" />}
                            label="Notifications"
                            isActive={activeTab === "notifications"}
                            onClick={() => setActiveTab("notifications")}
                        />
                        <SidebarItem
                            icon={<Database className="h-4 w-4" />}
                            label="Data controls"
                            isActive={activeTab === "data"}
                            onClick={() => setActiveTab("data")}
                        />
                        <SidebarItem
                            icon={<Shield className="h-4 w-4" />}
                            label="Security"
                            isActive={activeTab === "security"}
                            onClick={() => setActiveTab("security")}
                        />
                        <SidebarItem
                            icon={<UserIcon className="h-4 w-4" />}
                            label="Account"
                            isActive={activeTab === "account"}
                            onClick={() => setActiveTab("account")}
                        />
                    </nav>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto bg-white p-8 dark:bg-zinc-900">
                    {activeTab === "general" && <GeneralSettings />}
                    {activeTab === "data" && (
                        <DataSettings
                            onClearChatHistory={onClearChatHistory}
                            onClearSavedData={onClearSavedData}
                            onClearArchives={onClearArchives}
                            onViewArchives={onViewArchives}
                        />
                    )}
                    {activeTab === "security" && <SecuritySettings onLogOut={onLogOut} />}
                    {activeTab === "account" && <AccountSettings user={user} />}
                    {/* Placeholders for other tabs */}
                    {activeTab !== "general" && activeTab !== "data" && activeTab !== "security" && activeTab !== "account" && (
                        <div className="flex h-full items-center justify-center text-(--text-secondary)">
                            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} settings coming soon
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );

}

function SidebarItem({
    icon,
    label,
    isActive,
    onClick,
}: {
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                    ? "bg-black/5 text-(--text-primary) dark:bg-white/10"
                    : "text-(--text-secondary) hover:bg-black/5 hover:text-(--text-primary) dark:hover:bg-white/5"
            )}
        >
            {icon}
            <span>{label}</span>
        </button>
    );
}

function GeneralSettings() {
    const { theme, setTheme } = useTheme();
    const {
        accentColor,
        setAccentColor,
        responseStyle,
        setResponseStyle,
        summaryLevel,
        setSummaryLevel,
        aiModel,
        setAiModel
    } = useSettings();

    const [showColorPalette, setShowColorPalette] = useState(false);
    const [showAppearance, setShowAppearance] = useState(false);
    const [showAiModel, setShowAiModel] = useState(false);

    const colors = [
        "#ef4444", // red
        "#f97316", // orange
        "#f59e0b", // amber
        "#84cc16", // lime
        "#22c55e", // green
        "#06b6d4", // cyan
        "#3b82f6", // blue
        "#6366f1", // indigo
        "#a855f7", // purple
        "#d946ef", // fuchsia
        "#ec4899", // pink
        "#f43f5e", // rose
    ];

    return (
        <div className="space-y-8">
            <h2 className="text-xl font-semibold text-(--text-primary)">General</h2>

            <div className="space-y-6">
                <div className="space-y-1 border-b border-black/5 pb-6 dark:border-white/5">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-(--text-primary)">Appearance</span>
                        <button
                            onClick={() => setShowAppearance(!showAppearance)}
                            className="flex items-center gap-2 text-sm text-(--text-secondary) hover:text-(--text-primary)"
                        >
                            {theme === 'system' ? 'System' : theme === 'dark' ? 'Dark' : 'Light'}
                            <ChevronDown className={cn("h-4 w-4 transition-transform", showAppearance && "rotate-180")} />
                        </button>
                    </div>
                    {showAppearance && (
                        <div className="flex gap-2 pt-2 justify-end">
                            {['light', 'dark', 'system'].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setTheme(t)}
                                    className={cn(
                                        "rounded-md px-3 py-1 text-xs font-medium transition-colors capitalize",
                                        theme === t
                                            ? "bg-black/10 text-(--text-primary) dark:bg-white/10"
                                            : "text-(--text-secondary) hover:text-(--text-primary)"
                                    )}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-3 border-b border-black/5 pb-6 dark:border-white/5">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-[var(--text-primary)]">Accent color</span>
                        <button
                            onClick={() => setShowColorPalette(!showColorPalette)}
                            className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        >
                            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: accentColor }} />
                            Custom
                            <ChevronDown className={cn("h-4 w-4 transition-transform", showColorPalette && "rotate-180")} />
                        </button>
                    </div>
                    {showColorPalette && (
                        <div className="grid grid-cols-6 gap-2 pt-2">
                            {colors.map((color) => (
                                <button
                                    key={color}
                                    onClick={() => setAccentColor(color)}
                                    className={cn(
                                        "h-8 w-full rounded-md border border-black/10 transition hover:scale-105 dark:border-white/10",
                                        accentColor === color && "ring-2 ring-[var(--text-primary)] ring-offset-2 ring-offset-[var(--background)]"
                                    )}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    )}
                </div>



                <div className="space-y-1 border-b border-black/5 pb-6 dark:border-white/5">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-[var(--text-primary)]">AI Model</span>
                        <div className="relative">
                            <button
                                onClick={() => setShowAiModel(!showAiModel)}
                                className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                            >
                                {aiModel === "phi3:mini" && <Bot className="h-4 w-4 text-green-500" />}
                                {aiModel === "llama3.2-vision" && <Sparkles className="h-4 w-4 text-blue-500" />}
                                {aiModel === "qwen2-math" && <Bot className="h-4 w-4 text-purple-500" />}
                                {aiModel === "Llama 3" && <Bot className="h-4 w-4 text-purple-400" />}
                                {aiModel === "Mistral Large" && <Zap className="h-4 w-4 text-yellow-400" />}
                                {!["phi3:mini", "llama3.2-vision", "qwen2-math", "Llama 3", "Mistral Large"].includes(aiModel) && <Bot className="h-4 w-4 text-[var(--text-secondary)]" />}
                                {aiModel}
                                <ChevronDown className={cn("h-4 w-4 transition-transform", showAiModel && "rotate-180")} />
                            </button>

                            {showAiModel && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setShowAiModel(false)}
                                    />
                                    <div className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-lg border border-black/10 bg-white shadow-xl dark:border-white/10 dark:bg-zinc-900">
                                        <div className="max-h-60 overflow-y-auto p-1">
                                            {[
                                                { id: "phi3:mini", icon: Bot, color: "text-green-500" },
                                                { id: "llama3.2-vision", icon: Sparkles, color: "text-blue-500" },
                                                { id: "qwen2-math", icon: Bot, color: "text-purple-500" },
                                                { id: "Llama 3", icon: Bot, color: "text-purple-400" },
                                                { id: "Mistral Large", icon: Zap, color: "text-yellow-400" },
                                                { id: "Mixtral 8x7B", icon: Zap, color: "text-indigo-400" },
                                                { id: "Falcon 180B", icon: Bot, color: "text-red-400" },
                                                { id: "Stable Beluga", icon: Bot, color: "text-cyan-400" },
                                                { id: "Vicuna 33B", icon: Sparkles, color: "text-pink-400" },
                                                { id: "WizardLM", icon: Bot, color: "text-emerald-400" },
                                            ].map((model) => (
                                                <button
                                                    key={model.id}
                                                    onClick={() => {
                                                        setAiModel(model.id);
                                                        setShowAiModel(false);
                                                    }}
                                                    className={cn(
                                                        "flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-xs font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/5",
                                                        aiModel === model.id
                                                            ? "bg-black/10 text-[var(--text-primary)] dark:bg-white/10"
                                                            : "text-[var(--text-secondary)]"
                                                    )}
                                                >
                                                    <span>{model.id}</span>
                                                    <model.icon className={cn("h-3 w-3", model.color)} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-4 pt-2">
                    <h3 className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider">AI Preference</h3>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-[var(--text-primary)]">Response Style</span>
                            <div className="flex rounded-lg bg-black/5 p-1 dark:bg-white/5">
                                {["Neutral", "Formal", "Friendly"].map((style) => (
                                    <button
                                        key={style}
                                        onClick={() => setResponseStyle(style as any)}
                                        className={cn(
                                            "rounded-md px-3 py-1 text-xs font-medium transition-colors",
                                            responseStyle === style
                                                ? "bg-white shadow-sm text-black dark:bg-white/10 dark:text-white"
                                                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                        )}
                                    >
                                        {style}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-[var(--text-primary)]">Summary Level</span>
                            <div className="flex rounded-lg bg-black/5 p-1 dark:bg-white/5">
                                {["Short", "Detailed"].map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => setSummaryLevel(level as any)}
                                        className={cn(
                                            "rounded-md px-3 py-1 text-xs font-medium transition-colors",
                                            summaryLevel === level
                                                ? "bg-white shadow-sm text-black dark:bg-white/10 dark:text-white"
                                                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                        )}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

type DataSettingsProps = {
    onClearChatHistory: () => void;
    onClearSavedData: () => void;
    onClearArchives: () => void;
    onViewArchives: () => void;
};

function DataSettings({ onClearChatHistory, onClearSavedData, onClearArchives, onViewArchives }: DataSettingsProps) {
    return (
        <div className="space-y-8">
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">Data controls</h2>

            <div className="space-y-6">
                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider">Chat & Data</h3>
                    <SettingRow label="Delete Chat history" value="Clear" action onClick={onClearChatHistory} />
                    <SettingRow label="Delete the data of saved data" value="Clear" action onClick={onClearSavedData} />
                </div>

                <div className="space-y-4 pt-2">
                    <h3 className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider">Archives</h3>
                    <SettingRow label="Archived Files" value="View" action onClick={onViewArchives} />
                    <SettingRow label="Delete Archive files" value="Clear" action onClick={onClearArchives} />
                </div>

                <div className="space-y-4 pt-2">
                    <h3 className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider">Account</h3>
                    <SettingRow label="Change password" value="Update" action />
                    <SettingRow label="Delete Account" value="Delete" action variant="danger" />
                </div>
            </div>
        </div>
    );
}

function SecuritySettings({ onLogOut }: { onLogOut: () => void }) {
    return (
        <div className="space-y-8">
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">Security</h2>

            <div className="space-y-6">
                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider">Session Management</h3>
                    <SettingRow label="Log out" value="Log out" action onClick={onLogOut} />
                    <SettingRow label="Log out from all devices" value="Log out all" action variant="danger" />
                </div>
            </div>
        </div>
    );
}

function AccountSettings({ user }: { user: User | null }) {
    const { accentColor } = useSettings();
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState(user?.displayName || "");
    const [isLoading, setIsLoading] = useState(false);

    const handleUpdateName = async () => {
        if (!user || !newName.trim()) return;
        setIsLoading(true);
        try {
            await updateProfile(user, { displayName: newName });
            setIsEditingName(false);
            // Force refresh or let Firebase listener handle it (might require page reload or context update if not reactive)
            // For now, assume user object updates or requires reload. 
            // To be safe, we might update local state if 'user' prop doesn't auto-update immediately.
        } catch (error) {
            console.error("Error updating profile:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">Account</h2>

            <div className="space-y-6">
                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider">Profile</h3>

                    {/* Editable Name Row */}
                    <div className="space-y-1 border-b border-black/5 pb-6 last:border-0 dark:border-white/5">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-[var(--text-primary)]">Name</span>
                            {isEditingName ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        className="h-8 w-40 rounded-md border border-black/10 bg-transparent px-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--text-primary)] dark:border-white/10"
                                        autoFocus
                                    />
                                    <button
                                        onClick={handleUpdateName}
                                        disabled={isLoading}
                                        className="rounded-md bg-green-500/10 p-1.5 text-green-500 hover:bg-green-500/20"
                                    >
                                        <Check className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsEditingName(false);
                                            setNewName(user?.displayName || "");
                                        }}
                                        className="rounded-md bg-red-500/10 p-1.5 text-red-500 hover:bg-red-500/20"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => {
                                        setNewName(user?.displayName || "");
                                        setIsEditingName(true);
                                    }}
                                    className="flex items-center gap-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                                >
                                    {user?.displayName || "Set Name"}
                                    <Edit3 className="h-3 w-3" />
                                </button>
                            )}
                        </div>
                    </div>

                    <SettingRow label="Email" value={user?.email || "No email"} description="Read-only" />
                    <div className="space-y-1 border-b border-black/5 pb-6 last:border-0 dark:border-white/5">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-[var(--text-primary)]">Profile Photo</span>
                            <div className="flex items-center gap-3">
                                <div
                                    className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium text-white shadow-lg"
                                    style={{
                                        background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`,
                                        boxShadow: `0 4px 10px ${accentColor}40`
                                    }}
                                >
                                    {user?.displayName ? user.displayName.substring(0, 2).toUpperCase() : (user?.email?.substring(0, 2).toUpperCase() || "US")}
                                </div>
                                <button className="rounded-md bg-black/5 px-3 py-1.5 text-sm text-[var(--text-primary)] transition hover:bg-black/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10">
                                    Update
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SettingRow({
    label,
    value,
    description,
    action,
    variant = "default",
    onClick
}: {
    label: string;
    value: string;
    description?: string;
    action?: boolean;
    variant?: "default" | "danger";
    onClick?: () => void;
}) {
    return (
        <div className="space-y-1 border-b border-black/5 pb-6 last:border-0 dark:border-white/5">
            <div className="flex items-center justify-between">
                <span className={cn("text-sm font-medium", variant === "danger" ? "text-red-400" : "text-[var(--text-primary)]")}>
                    {label}
                </span>
                <button
                    onClick={onClick}
                    className={cn(
                        "flex items-center gap-2 text-sm transition-colors",
                        action
                            ? "rounded-md bg-black/5 px-3 py-1.5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10"
                            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
                        variant === "danger"
                            ? "text-red-400 hover:bg-red-500/10 hover:text-red-300"
                            : "text-[var(--text-primary)]"
                    )}
                >
                    {value}
                    {!action && <ChevronDown className="h-4 w-4" />}
                </button>
            </div>
            {description && (
                <p className="max-w-md text-xs text-[var(--text-secondary)] leading-relaxed">
                    {description}
                </p>
            )}
        </div>
    );
}

