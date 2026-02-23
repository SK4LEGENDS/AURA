"use client";

import { ChatSession } from "@/types/chat";
import { cn } from "@/lib/utils";
import {
  MessageSquarePlus,
  MoreHorizontal,
  Search,
  Settings,
  Trash,
  Share2,
  FolderDown,
  Edit3,
  HelpCircle,
  LogOut,
  ChevronRight,
  BarChart3,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { User } from "firebase/auth";
import { DropdownMenu, DropdownItem, DropdownSeparator } from "./dropdown-menu";
import { SettingsDialog } from "./settings-dialog";
import { HelpDialog } from "./help-dialog";
import { useSettings } from "@/lib/settings-context";
import { ChatSessionSkeleton } from "./skeleton";
import { useI18n } from "@/lib/i18n-context";

type SidebarProps = {
  sessions: ChatSession[];
  activeSessionId: string;
  collapsed: boolean;
  loading?: boolean;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onRename: (id: string, newTitle: string) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onToggleCollapse: () => void;
  onClearChatHistory: () => void;
  onClearSavedData: () => void;
  onClearArchives: () => void;
  onViewArchives: () => void;
  onViewInsights: () => void;
  onLogOut: () => void;
  user: User | null;
};

export function Sidebar({
  sessions,
  activeSessionId,
  collapsed,
  onSelect,
  onNewChat,
  onRename,
  onDelete,
  onArchive,
  onToggleCollapse,
  onClearChatHistory,
  onClearSavedData,
  onClearArchives,
  onViewArchives,
  onViewInsights,
  onLogOut,
  user,
  loading, // Added here
}: SidebarProps) {
  const { accentColor } = useSettings();
  const { t } = useI18n();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingId]);

  const startEditing = (session: ChatSession) => {
    setEditingId(session.id);
    setEditValue(session.title);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditValue("");
  };

  const saveEditing = (id: string) => {
    if (editValue.trim()) {
      onRename(id, editValue.trim());
    }
    setEditingId(null);
    setEditValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === "Enter") {
      saveEditing(id);
    } else if (e.key === "Escape") {
      cancelEditing();
    }
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 88 : 280 }}
      transition={{ type: "spring", stiffness: 200, damping: 25, mass: 1 }}
      className={cn(
        "relative flex h-screen flex-col bg-ui-background text-ui-text-primary z-20 shadow-2xl",
      )}
    >
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-6",
          collapsed && "justify-center px-0 flex-col gap-4"
        )}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleCollapse}
          className="relative h-10 w-10 shrink-0 overflow-hidden cursor-pointer rounded-xl bg-ui-surface shadow-sm"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          role="button"
        >
          <Image
            src="/logo-v2.png"
            alt="AURA"
            fill
            className="object-contain p-1.5"
          />
        </motion.div>

        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="text-xl font-bold tracking-wide bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(to right, ${accentColor}, ${accentColor}dd)`,
                filter: `drop-shadow(0 0 10px ${accentColor}40)`
              }}
            >
              AURA
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1 overflow-y-auto px-3 custom-scrollbar">
        <section className="space-y-2 mb-6">
          <div className="space-y-1">
            <button
              type="button"
              onClick={onNewChat}
              aria-label="Create new chat"
              className={cn(
                "group flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition-all duration-300 shadow-sm border border-transparent active:scale-[0.98]",
                "text-ui-text-primary hover:bg-ui-surface",
                collapsed && "justify-center px-0 bg-transparent shadow-none"
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center transition-transform group-hover:scale-110",
                  collapsed && "h-10 w-10 rounded-xl bg-black/5 dark:bg-white/10 shadow-sm text-[var(--text-primary)] dark:text-white"
                )}
              >
                <MessageSquarePlus className="h-5 w-5" />
              </div>
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                  >
                    {t("sidebar.newChat")}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Insights Button */}
            <button
              type="button"
              onClick={onViewInsights}
              aria-label="View your insights dashboard"
              className={cn(
                "group flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition-all duration-300 shadow-sm border border-transparent active:scale-[0.98]",
                "text-ui-text-primary hover:bg-ui-surface",
                collapsed && "justify-center px-0 bg-transparent shadow-none"
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center transition-transform group-hover:scale-110",
                  collapsed && "h-10 w-10 rounded-xl bg-black/5 dark:bg-white/10 shadow-sm text-[var(--text-primary)] dark:text-white"
                )}
              >
                <BarChart3 className="h-5 w-5" />
              </div>
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                  >
                    {t("sidebar.yourInsights")}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </section>

        <section className="py-2">
          <AnimatePresence>
            {!collapsed && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mb-3 text-[10px] uppercase tracking-[0.2em] text-[var(--text-secondary)] dark:text-white/40 font-bold pl-3"
              >
                {t("sidebar.recent")}
              </motion.p>
            )}
          </AnimatePresence>
          <nav className="space-y-1">
            {loading ? (
              // Loading skeletons
              Array.from({ length: 5 }).map((_, i) => (
                <ChatSessionSkeleton key={i} />
              ))
            ) : sessions.length === 0 && !collapsed ? (
              <div className="rounded-xl border border-dashed border-ui-border px-4 py-6 text-center">
                <p className="text-xs text-ui-text-secondary">{t("sidebar.noConversations")}</p>
              </div>
            ) : (
              !collapsed && sessions.map((session) => {
                const isEditing = editingId === session.id;

                if (isEditing && !collapsed) {
                  return (
                    <div
                      key={session.id}
                      className="flex w-full items-center gap-3 rounded-xl bg-black/5 dark:bg-white/10 px-3 py-2 border border-black/5 dark:border-white/5"
                    >
                      <div className="flex flex-1 flex-col">
                        <input
                          ref={inputRef}
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, session.id)}
                          onBlur={() => saveEditing(session.id)}
                          className="w-full bg-transparent text-sm font-medium text-[var(--text-primary)] dark:text-white outline-none placeholder:text-[var(--text-secondary)] dark:placeholder:text-white/30"
                          placeholder="Chat name"
                          aria-label="Rename chat"
                        />
                      </div>
                    </div>
                  );
                }

                return (
                  <button
                    key={session.id}
                    onClick={() => onSelect(session.id)}
                    aria-label={`Select chat ${session.title}`}
                    className={cn(
                      "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-all duration-200",
                      session.id === activeSessionId
                        ? "bg-ui-surface/60 shadow-sm border border-ui-border"
                        : "text-ui-text-secondary hover:bg-ui-surface",
                      collapsed && "justify-center px-0",
                    )}
                  >
                    {!collapsed && (
                      <>
                        <div className="flex flex-1 flex-col overflow-hidden">
                          <span className={cn(
                            "truncate font-medium transition-colors",
                            session.id === activeSessionId ? "text-[var(--text-primary)] dark:text-white" : "group-hover:text-[var(--text-primary)] dark:group-hover:text-white"
                          )}>
                            {session.title}
                          </span>
                          <span className="text-[10px] text-[var(--text-secondary)] dark:text-white/30 truncate">
                            {new Date(session.updatedAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className={cn(
                          "opacity-0 transition-opacity",
                          session.id === activeSessionId ? "opacity-100" : "group-hover:opacity-100"
                        )} onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu
                            side="right"
                            trigger={
                              <div
                                className="rounded-lg p-1 hover:bg-black/10 dark:hover:bg-white/20 transition-colors"
                                aria-label="Chat options"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </div>
                            }
                          >
                            <DropdownItem
                              icon={<Share2 className="h-4 w-4" />}
                              label={t("sidebar.share")}
                              onClick={() => { }}
                            />
                            <DropdownItem
                              icon={<Edit3 className="h-4 w-4" />}
                              label={t("sidebar.rename")}
                              onClick={() => startEditing(session)}
                            />
                            <DropdownSeparator />
                            <DropdownItem
                              icon={<FolderDown className="h-4 w-4" />}
                              label={t("sidebar.archive")}
                              onClick={() => onArchive(session.id)}
                            />
                            <DropdownItem
                              icon={<Trash className="h-4 w-4" />}
                              label={t("sidebar.delete")}
                              variant="danger"
                              onClick={() => onDelete(session.id)}
                            />
                          </DropdownMenu>
                        </div>
                      </>
                    )}
                  </button>
                );
              })
            )}
          </nav>
        </section>
      </div>

      <div
        className={cn(
          "flex items-center gap-3 px-4 py-4 m-2 rounded-2xl bg-ui-surface",
          collapsed && "justify-center p-2 m-0 rounded-none bg-transparent"
        )}
      >
        <DropdownMenu
          side="right"
          trigger={
            <div className="relative shrink-0 cursor-pointer transition-opacity hover:opacity-80">
              <div
                className="h-9 w-9 rounded-full ring-2 ring-white dark:ring-black flex items-center justify-center text-xs font-bold text-white shadow-sm"
                style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}80)` }}
              >
                {user?.displayName ? user.displayName.substring(0, 2).toUpperCase() : (user?.email?.substring(0, 2).toUpperCase() || "US")}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 inline-flex h-2.5 w-2.5 items-center justify-center rounded-full border border-white dark:border-black bg-emerald-500" />
            </div>
          }
        >
          <div className="flex items-center gap-3 px-2 py-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium text-white shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`,
                boxShadow: `0 4px 10px ${accentColor}40`
              }}
            >
              {user?.displayName ? user.displayName.substring(0, 2).toUpperCase() : (user?.email?.substring(0, 2).toUpperCase() || "US")}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium text-[var(--text-primary)] truncate">{user?.displayName || "User"}</span>
              <span className="text-xs text-[var(--text-secondary)] truncate">{user?.email || "No email"}</span>
            </div>
          </div>
          <DropdownSeparator />
          <DropdownItem
            icon={<Settings className="h-4 w-4" />}
            label={t("settings.title")}
            onClick={() => setIsSettingsOpen(true)}
          />
          <DropdownSeparator />
          <DropdownItem
            icon={<HelpCircle className="h-4 w-4" />}
            label={t("sidebar.help")}
            rightSlot={<ChevronRight className="h-4 w-4" />}
            onClick={() => setIsHelpOpen(true)}
          />
          <DropdownItem
            icon={<LogOut className="h-4 w-4" />}
            label={t("sidebar.logout")}
            onClick={onLogOut}
          />
        </DropdownMenu>

        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="flex flex-1 flex-col overflow-hidden"
            >
              <span className="text-sm font-semibold text-[var(--text-primary)] dark:text-white truncate">
                {user?.displayName || "User"}
              </span>
              <span className="text-[10px] text-[var(--text-secondary)] dark:text-white/50 truncate">
                {user?.email || "No email"}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {!collapsed && (
          <DropdownMenu
            side="right"
            align="right"
            trigger={
              <button
                type="button"
                className="ml-auto rounded-lg p-1.5 text-[var(--text-secondary)] dark:text-white/60 transition hover:bg-black/5 dark:hover:bg-white/10 hover:text-[var(--text-primary)] dark:hover:text-white"
              >
                <Settings className="h-4 w-4" />
              </button>
            }
          >
            <div className="flex items-center gap-3 px-2 py-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium text-white shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`,
                  boxShadow: `0 4px 10px ${accentColor}40`
                }}
              >
                {user?.displayName ? user.displayName.substring(0, 2).toUpperCase() : (user?.email?.substring(0, 2).toUpperCase() || "US")}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  {user?.displayName || "User Account"}
                </span>
                <span className="truncate text-xs text-[var(--text-secondary)]">
                  {user?.email || "Not logged in"}
                </span>
              </div>
            </div>
            <DropdownSeparator />
            <DropdownItem
              icon={<Settings className="h-4 w-4" />}
              label={t("settings.title")}
              onClick={() => setIsSettingsOpen(true)}
            />
            <DropdownSeparator />
            <DropdownItem
              icon={<HelpCircle className="h-4 w-4" />}
              label={t("sidebar.help")}
              rightSlot={<ChevronRight className="h-4 w-4" />}
              onClick={() => setIsHelpOpen(true)}
            />
            <DropdownItem
              icon={<LogOut className="h-4 w-4" />}
              label={t("sidebar.logout")}
              onClick={onLogOut}
            />
          </DropdownMenu>
        )}
      </div>

      <SettingsDialog
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onClearChatHistory={onClearChatHistory}
        onClearSavedData={onClearSavedData}
        onClearArchives={onClearArchives}
        onViewArchives={onViewArchives}
        onLogOut={onLogOut}
        user={user}
      />

      <HelpDialog
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </motion.aside >
  );
}
