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
    Globe,
    Search,
} from "lucide-react";
import { User, updateProfile } from "firebase/auth";
import { useI18n, LanguageCode } from "@/lib/i18n-context";
import { useToast } from "@/lib/toast-context";

const languages: { code: LanguageCode; name: string; nativeName: string }[] = [
    { code: "en", name: "English", nativeName: "English" },
    { code: "hi", name: "Hindi", nativeName: "हिन्दी (Hindi)" },
    { code: "bn", name: "Bengali", nativeName: "বাংলা (Bengali)" },
    { code: "ta", name: "Tamil", nativeName: "தமிழ் (Tamil)" },
    { code: "te", name: "Telugu", nativeName: "తెలుగు (Telugu)" },
    { code: "mr", name: "Marathi", nativeName: "मराठी (Marathi)" },
    { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી (Gujarati)" },
    { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ (Kannada)" },
    { code: "ml", name: "Malayalam", nativeName: "മലയാളം (Malayalam)" },
    { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ (Odia)" },
    { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ (Punjabi)" },
    { code: "as", name: "Assamese", nativeName: "অসমীয়া (Assamese)" },
    { code: "mai", name: "Maithili", nativeName: "मैथिली (Maithili)" },
    { code: "kok", name: "Konkani", nativeName: "कोंकणी (Konkani)" },
    { code: "mni", name: "Manipuri", nativeName: "মৈতৈইলোন (Manipuri)" },
    { code: "doi", name: "Dogri", nativeName: "डोगरी (Dogri)" },
    { code: "ks", name: "Kashmiri", nativeName: "کٲशُر (Kashmiri)" },
    { code: "sd", name: "Sindhi", nativeName: "سنڌي (Sindhi)" },
    { code: "ur", name: "Urdu", nativeName: "اردو (Urdu)" },
    { code: "sa", name: "Sanskrit", nativeName: "संस्कृतम् (Sanskrit)" },
    { code: "ne", name: "Nepali", nativeName: "नेपाली (Nepali)" },
    { code: "brx", name: "Bodo", nativeName: "बर' (Bodo)" },
    { code: "sat", name: "Santali", nativeName: "ᱥᱟᱱᱛᱟᱲᱤ (Santali)" },
    { code: "ja", name: "Japanese", nativeName: "日本語 (Japanese)" },
    { code: "zh-cn", name: "Chinese (S)", nativeName: "简体中文 (Chinese Simplified)" },
    { code: "zh-tw", name: "Chinese (T)", nativeName: "繁體中文 (Chinese Traditional)" },
    { code: "ko", name: "Korean", nativeName: "한국어 (Korean)" },
    { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia (Indonesian)" },
    { code: "ms", name: "Malay", nativeName: "Bahasa Melayu (Malay)" },
    { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt (Vietnamese)" },
    { code: "fil", name: "Filipino", nativeName: "Filipino (Filipino)" },
    { code: "fr", name: "French", nativeName: "Français (French)" },
    { code: "de", name: "German", nativeName: "Deutsch (German)" },
    { code: "es", name: "Spanish", nativeName: "Español (Spanish)" },
    { code: "it", name: "Italian", nativeName: "Italiano (Italian)" },
    { code: "pt", name: "Portuguese", nativeName: "Português (Portuguese)" },
    { code: "ru", name: "Russian", nativeName: "Русский (Russian)" },
    { code: "sv", name: "Swedish", nativeName: "Svenska (Swedish)" },
    { code: "no", name: "Norwegian", nativeName: "Norsk (Norwegian)" },
    { code: "da", name: "Danish", nativeName: "Dansk (Danish)" },
    { code: "fi", name: "Finnish", nativeName: "Suomi (Finnish)" },
    { code: "pl", name: "Polish", nativeName: "Polski (Polish)" },
    { code: "uk", name: "Ukrainian", nativeName: "Українська (Ukrainian)" },
    { code: "tr", name: "Turkish", nativeName: "Türkçe (Turkish)" },
    { code: "th", name: "Thai", nativeName: "ไทย (Thai)" },
    { code: "el", name: "Greek", nativeName: "Ελληνικά (Greek)" },
    { code: "hu", name: "Hungarian", nativeName: "Magyar (Hungarian)" },
    { code: "cs", name: "Czech", nativeName: "Čeština (Czech)" },
    { code: "ro", name: "Romanian", nativeName: "Română (Romanian)" },
    { code: "bg", name: "Bulgarian", nativeName: "Български (Bulgarian)" },
    { code: "sr", name: "Serbian", nativeName: "Српски (Serbian)" },
    { code: "hr", name: "Croatian", nativeName: "Hrvatski (Croatian)" },
    { code: "sk", name: "Slovak", nativeName: "Slovenčina (Slovak)" },
    { code: "he", name: "Hebrew", nativeName: "עברית (Hebrew)" },
    { code: "fa", name: "Persian", nativeName: "فارسی (Persian)" },
    { code: "ar", name: "Arabic", nativeName: "العربية (Arabic)" },
    { code: "nl", name: "Dutch", nativeName: "Nederlands (Dutch)" },
];

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
    const { t, isRTL } = useI18n();
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
                <div className="w-64 shrink-0 border-r border-black/10 bg-slate-50 p-4 dark:border-white/10 dark:bg-zinc-900/50">
                    <button
                        onClick={onClose}
                        className="mb-6 rounded-lg p-2 text-(--text-secondary) transition hover:bg-black/5 hover:text-(--text-primary) dark:hover:bg-white/10"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <nav className="space-y-1">
                        <SidebarItem
                            icon={<Settings className="h-4 w-4" />}
                            label={t("settings.tabs.general")}
                            isActive={activeTab === "general"}
                            onClick={() => setActiveTab("general")}
                        />
                        <SidebarItem
                            icon={<Bell className="h-4 w-4" />}
                            label={t("settings.tabs.notifications")}
                            isActive={activeTab === "notifications"}
                            onClick={() => setActiveTab("notifications")}
                        />
                        <SidebarItem
                            icon={<Database className="h-4 w-4" />}
                            label={t("settings.tabs.data")}
                            isActive={activeTab === "data"}
                            onClick={() => setActiveTab("data")}
                        />
                        <SidebarItem
                            icon={<Shield className="h-4 w-4" />}
                            label={t("settings.tabs.security")}
                            isActive={activeTab === "security"}
                            onClick={() => setActiveTab("security")}
                        />
                        <SidebarItem
                            icon={<UserIcon className="h-4 w-4" />}
                            label={t("settings.tabs.account")}
                            isActive={activeTab === "account"}
                            onClick={() => setActiveTab("account")}
                        />
                    </nav>
                </div>

                <div className={cn("flex-1 overflow-y-auto bg-white p-8 dark:bg-zinc-900", isRTL && "font-arabic")}>
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
                            {t("settings.placeholders.comingSoon").replace("{tab}", activeTab.charAt(0).toUpperCase() + activeTab.slice(1))}
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

    const {
        uiLanguage, setUiLanguage,
        inputLanguage, setInputLanguage,
        outputLanguage, setOutputLanguage,
        t
    } = useI18n();

    const { showToast } = useToast();

    const [showColorPalette, setShowColorPalette] = useState(false);
    const [showAppearance, setShowAppearance] = useState(false);
    const [showAiModel, setShowAiModel] = useState(false);
    const [showUiLang, setShowUiLang] = useState(false);
    const [showInputLang, setShowInputLang] = useState(false);
    const [showOutputLang, setShowOutputLang] = useState(false);
    const [showModelConfirm, setShowModelConfirm] = useState(false);
    const [pendingModel, setPendingModel] = useState<string | null>(null);

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

    // Enforce model based on language settings
    useEffect(() => {
        if (outputLanguage !== "en") {
            if (aiModel !== "translategemma:4b") {
                setAiModel("translategemma:4b");
            }
        } else if (inputLanguage === "en" && aiModel === "translategemma:4b") {
            // Switch back to general purpose model for all-English context
            setAiModel("llama3.2");
        }
    }, [outputLanguage, inputLanguage, aiModel, setAiModel]);

    return (
        <div className="space-y-8">
            <h2 className="text-xl font-semibold text-(--text-primary)">{t("settings.tabs.general")}</h2>

            <div className="space-y-6">
                <div className="space-y-1 border-b border-black/5 pb-6 dark:border-white/5">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-(--text-primary)">{t("settings.appearance")}</span>
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
                        <span className="text-sm font-medium text-(--text-primary)">{t("settings.accentColor")}</span>
                        <button
                            onClick={() => setShowColorPalette(!showColorPalette)}
                            className="flex items-center gap-2 text-sm text-(--text-secondary) hover:text-(--text-primary)"
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
                                        accentColor === color && "ring-2 ring-(--text-primary) ring-offset-2 ring-offset-(--background)"
                                    )}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-3 border-b border-black/5 pb-6 dark:border-white/5">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-(--text-primary)">{t("settings.uiLanguage")}</span>
                        <div className="relative">
                            <button
                                onClick={() => setShowUiLang(!showUiLang)}
                                className="flex items-center gap-2 text-sm text-(--text-secondary) hover:text-(--text-primary)"
                            >
                                <Globe className="h-4 w-4" />
                                {languages.find(l => l.code === uiLanguage)?.nativeName}
                                <ChevronDown className={cn("h-4 w-4 transition-transform", showUiLang && "rotate-180")} />
                            </button>
                            {showUiLang && (
                                <Dropdown
                                    items={languages}
                                    selectedId={uiLanguage}
                                    onSelect={(id) => {
                                        setUiLanguage(id as LanguageCode);
                                        setShowUiLang(false);
                                    }}
                                    onClose={() => setShowUiLang(false)}
                                    searchable
                                />
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-3 border-b border-black/5 pb-6 dark:border-white/5">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-(--text-primary)">{t("settings.inputLanguage")}</span>
                        <div className="relative">
                            <button
                                onClick={() => setShowInputLang(!showInputLang)}
                                className="flex items-center gap-2 text-sm text-(--text-secondary) hover:text-(--text-primary)"
                            >
                                <Edit3 className="h-4 w-4" />
                                {languages.find(l => l.code === inputLanguage)?.nativeName}
                                <ChevronDown className={cn("h-4 w-4 transition-transform", showInputLang && "rotate-180")} />
                            </button>
                            {showInputLang && (
                                <Dropdown
                                    items={languages}
                                    selectedId={inputLanguage}
                                    onSelect={(id) => {
                                        setInputLanguage(id as LanguageCode);
                                        setShowInputLang(false);
                                    }}
                                    onClose={() => setShowInputLang(false)}
                                    searchable
                                />
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-3 border-b border-black/5 pb-6 dark:border-white/5">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-(--text-primary)">{t("settings.outputLanguage")}</span>
                        <div className="relative">
                            <button
                                onClick={() => setShowOutputLang(!showOutputLang)}
                                className="flex items-center gap-2 text-sm text-(--text-secondary) hover:text-(--text-primary)"
                            >
                                <Bot className="h-4 w-4" />
                                {languages.find(l => l.code === outputLanguage)?.nativeName}
                                <ChevronDown className={cn("h-4 w-4 transition-transform", showOutputLang && "rotate-180")} />
                            </button>
                            {showOutputLang && (
                                <Dropdown
                                    items={languages}
                                    selectedId={outputLanguage}
                                    onSelect={(id) => {
                                        setOutputLanguage(id as LanguageCode);
                                        // Auto-enforce translation model for non-English responses
                                        if (id !== "en") {
                                            setAiModel("translategemma:4b");
                                        } else if (inputLanguage === "en") {
                                            setAiModel("llama3.2");
                                        }
                                        setShowOutputLang(false);
                                    }}
                                    onClose={() => setShowOutputLang(false)}
                                    searchable
                                />
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-1 border-b border-black/5 pb-6 dark:border-white/5">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-(--text-primary)">AI Model</span>
                        <div className="relative">
                            <button
                                onClick={() => setShowAiModel(!showAiModel)}
                                className="flex items-center gap-2 text-sm text-(--text-secondary) hover:text-(--text-primary)"
                            >
                                {aiModel === "translategemma:4b" && <Sparkles className="h-4 w-4 text-emerald-500" />}
                                {aiModel === "phi3:mini" && <Bot className="h-4 w-4 text-green-500" />}
                                {aiModel === "llama3.2-vision" && <Sparkles className="h-4 w-4 text-blue-500" />}
                                {aiModel === "qwen2.5-math" && <Bot className="h-4 w-4 text-brand-primary" />}
                                {aiModel === "llama3.1" && <Zap className="h-4 w-4 text-indigo-500" />}
                                {aiModel === "deepseek-r1:7b" && <Bot className="h-4 w-4 text-red-500" />}
                                {aiModel === "qwen2.5-coder:7b" && <Bot className="h-4 w-4 text-cyan-500" />}
                                {aiModel === "qwen2.5:7b" && <Bot className="h-4 w-4 text-brand-primary" />}
                                {aiModel === "llama3.2" && <Bot className="h-4 w-4 text-blue-400" />}
                                {!["phi3:mini", "llama3.2-vision", "qwen2.5:7b", "llama3.1", "deepseek-r1:7b", "qwen2.5-coder:7b", "translategemma:4b", "llama3.2"].includes(aiModel) && <Bot className="h-4 w-4 text-(--text-secondary)" />}
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
                                                { id: "translategemma:4b", icon: Sparkles, color: "text-emerald-500" },
                                                { id: "llama3.2", icon: Bot, color: "text-blue-400" },
                                                { id: "phi3:mini", icon: Bot, color: "text-green-500" },
                                                { id: "llama3.2-vision", icon: Sparkles, color: "text-blue-500" },
                                                { id: "qwen2.5:7b", icon: Bot, color: "text-brand-primary" },
                                                { id: "llama3.1", icon: Zap, color: "text-indigo-500" },
                                                { id: "deepseek-r1:7b", icon: Bot, color: "text-red-500" },
                                                { id: "qwen2.5-coder:7b", icon: Bot, color: "text-cyan-500" },
                                            ].map((model) => (
                                                <button
                                                    key={model.id}
                                                    onClick={() => {
                                                        if (outputLanguage !== "en") {
                                                            setPendingModel(model.id);
                                                            setShowModelConfirm(true);
                                                            return;
                                                        }
                                                        setAiModel(model.id);
                                                        setShowAiModel(false);
                                                    }}
                                                    className={cn(
                                                        "flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-xs font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/5",
                                                        aiModel === model.id
                                                            ? "bg-black/10 text-(--text-primary) dark:bg-white/10"
                                                            : "text-(--text-secondary)"
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
                    <h3 className="text-sm font-medium text-(--text-secondary) uppercase tracking-wider">AI Preference</h3>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-(--text-primary)">Response Style</span>
                            <div className="flex rounded-lg bg-black/5 p-1 dark:bg-white/5">
                                {["Neutral", "Formal", "Friendly"].map((style) => (
                                    <button
                                        key={style}
                                        onClick={() => setResponseStyle(style as any)}
                                        className={cn(
                                            "rounded-md px-3 py-1 text-xs font-medium transition-colors",
                                            responseStyle === style
                                                ? "bg-white shadow-sm text-black dark:bg-white/10 dark:text-white"
                                                : "text-(--text-secondary) hover:text-(--text-primary)"
                                        )}
                                    >
                                        {style}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-(--text-primary)">Summary Level</span>
                            <div className="flex rounded-lg bg-black/5 p-1 dark:bg-white/5">
                                {["Short", "Detailed"].map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => setSummaryLevel(level as any)}
                                        className={cn(
                                            "rounded-md px-3 py-1 text-xs font-medium transition-colors",
                                            summaryLevel === level
                                                ? "bg-white shadow-sm text-black dark:bg-white/10 dark:text-white"
                                                : "text-(--text-secondary) hover:text-(--text-primary)"
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

            {showModelConfirm && createPortal(
                <div className="fixed inset-0 z-10000 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#1c1c1f] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 text-center">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
                                <Bot className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">{t("settings.placeholders.switchToEnglish")}</h3>
                            <p className="text-sm text-white/70 leading-relaxed">
                                {t("settings.placeholders.modelWarning")}
                            </p>
                        </div>
                        <div className="flex items-center justify-center gap-3 bg-white/5 px-6 py-4">
                            <button
                                onClick={() => {
                                    setShowModelConfirm(false);
                                    setPendingModel(null);
                                }}
                                className="flex-1 rounded-lg px-4 py-2 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors border border-white/10"
                            >
                                {t("settings.actions.cancel")}
                            </button>
                            <button
                                onClick={() => {
                                    if (pendingModel) {
                                        setUiLanguage("en");
                                        setInputLanguage("en");
                                        setOutputLanguage("en");
                                        setAiModel(pendingModel);
                                        setShowAiModel(false);
                                    }
                                    setShowModelConfirm(false);
                                    setPendingModel(null);
                                    showToast(t("settings.placeholders.resetToEnglish"), "info");
                                }}
                                className="flex-1 rounded-lg bg-blue-500/90 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20"
                            >
                                {t("settings.actions.proceed")}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}

function DataSettings({ onClearChatHistory, onClearSavedData, onClearArchives, onViewArchives }: {
    onClearChatHistory: () => void;
    onClearSavedData: () => void;
    onClearArchives: () => void;
    onViewArchives: () => void;
}) {
    const { t } = useI18n();
    return (
        <div className="space-y-8">
            <h2 className="text-xl font-semibold text-(--text-primary)">{t("settings.tabs.data")}</h2>

            <div className="space-y-6">
                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-(--text-secondary) uppercase tracking-wider">Chat & Data</h3>
                    <SettingRow label="Delete Chat history" value={t("settings.actions.clear")} action onClick={onClearChatHistory} />
                    <SettingRow label="Delete the data of saved data" value={t("settings.actions.clear")} action onClick={onClearSavedData} />
                </div>

                <div className="space-y-4 pt-2">
                    <h3 className="text-sm font-medium text-(--text-secondary) uppercase tracking-wider">Archives</h3>
                    <SettingRow label="Archived Files" value={t("settings.actions.view")} action onClick={onViewArchives} />
                    <SettingRow label="Delete Archive files" value={t("settings.actions.clear")} action onClick={onClearArchives} />
                </div>

                <div className="space-y-4 pt-2">
                    <h3 className="text-sm font-medium text-(--text-secondary) uppercase tracking-wider">Account</h3>
                    <SettingRow label={t("settings.actions.changePassword")} value={t("settings.actions.update")} action />
                    <SettingRow label="Delete Account" value={t("settings.actions.delete")} action variant="danger" />
                </div>
            </div>
        </div>
    );
}

function SecuritySettings({ onLogOut }: { onLogOut: () => void }) {
    const { t } = useI18n();
    return (
        <div className="space-y-8">
            <h2 className="text-xl font-semibold text-(--text-primary)">{t("settings.tabs.security")}</h2>

            <div className="space-y-6">
                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-(--text-secondary) uppercase tracking-wider">Session Management</h3>
                    <SettingRow label={t("settings.actions.logout")} value={t("settings.actions.logout")} action onClick={onLogOut} />
                    <SettingRow label="Log out from all devices" value={t("settings.actions.logout")} action variant="danger" />
                </div>
            </div>
        </div>
    );
}

function AccountSettings({ user }: { user: User | null }) {
    const { t } = useI18n();
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
        } catch (error) {
            console.error("Error updating profile:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <h2 className="text-xl font-semibold text-(--text-primary)">{t("settings.tabs.account")}</h2>

            <div className="space-y-6">
                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-(--text-secondary) uppercase tracking-wider">Profile</h3>

                    <div className="space-y-1 border-b border-black/5 pb-6 last:border-0 dark:border-white/5">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-(--text-primary)">Name</span>
                            {isEditingName ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        className="h-8 w-40 rounded-md border border-black/10 bg-transparent px-2 text-sm text-(--text-primary) outline-none focus:border-(--text-primary) dark:border-white/10"
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
                                    className="flex items-center gap-2 text-sm text-(--text-secondary) transition-colors hover:text-(--text-primary)"
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
                            <span className="text-sm font-medium text-(--text-primary)">Profile Photo</span>
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
                                <button className="rounded-md bg-black/5 px-3 py-1.5 text-sm text-(--text-primary) transition hover:bg-black/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10">
                                    {t("settings.actions.update")}
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
                <span className={cn("text-sm font-medium", variant === "danger" ? "text-red-400" : "text-(--text-primary)")}>
                    {label}
                </span>
                <button
                    onClick={onClick}
                    className={cn(
                        "flex items-center gap-2 text-sm transition-colors",
                        action
                            ? "rounded-md bg-black/5 px-3 py-1.5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10"
                            : "text-(--text-secondary) hover:text-(--text-primary)",
                        variant === "danger"
                            ? "text-red-400 hover:bg-red-500/10 hover:text-red-300"
                            : "text-(--text-primary)"
                    )}
                >
                    {value}
                    {!action && <ChevronDown className="h-4 w-4" />}
                </button>
            </div>
            {description && (
                <p className="max-w-md text-xs text-(--text-secondary) leading-relaxed">
                    {description}
                </p>
            )}
        </div>
    );
}

function Dropdown({ items, selectedId, onSelect, onClose, searchable = false }: {
    items: { code: string; name: string; nativeName: string }[] | { id: string; name?: string; icon?: any; color?: string }[];
    selectedId: string;
    onSelect: (id: string) => void;
    onClose: () => void;
    searchable?: boolean;
}) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredItems = items.filter((item: any) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        const label = (item.nativeName || item.id || item.code || "").toLowerCase();
        const englishName = (item.name || "").toLowerCase();
        return label.includes(query) || englishName.includes(query);
    });

    return (
        <>
            <div className="fixed inset-0 z-40" onClick={onClose} />
            <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-lg border border-black/10 bg-white shadow-xl dark:border-white/10 dark:bg-zinc-900">
                {searchable && (
                    <div className="sticky top-0 border-b border-black/5 bg-white p-2 dark:border-white/5 dark:bg-zinc-900">
                        <div className="relative">
                            <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-(--text-secondary)" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search languages..."
                                className="w-full rounded-md border border-black/10 bg-black/5 py-1.5 pl-8 pr-3 text-xs outline-none focus:border-(--text-primary) dark:border-white/10 dark:bg-white/5"
                                autoFocus
                            />
                        </div>
                    </div>
                )}
                <div className="max-h-60 overflow-y-auto p-1">
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item: any) => {
                            const id = item.code || item.id;
                            const label = item.nativeName || item.id || id;
                            return (
                                <button
                                    key={id}
                                    onClick={() => onSelect(id)}
                                    className={cn(
                                        "flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-xs font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/5",
                                        selectedId === id
                                            ? "bg-black/10 text-(--text-primary) dark:bg-white/10"
                                            : "text-(--text-secondary)"
                                    )}
                                >
                                    <span className="truncate">{label}</span>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        {item.icon && <item.icon className={cn("h-3 w-3", item.color)} />}
                                        {selectedId === id && <Check className="h-3 w-3" />}
                                    </div>
                                </button>
                            );
                        })
                    ) : (
                        <div className="px-3 py-4 text-center text-xs text-(--text-secondary)">
                            No results found
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
