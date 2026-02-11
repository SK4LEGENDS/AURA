"use client";

import { KnowledgeSource } from "@/types/chat";
import { ChangeEvent, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useSettings } from "@/lib/settings-context";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Link, FileText, CheckCircle, XCircle, AlertCircle } from "lucide-react";

type UploadPanelProps = {
  sourceType: KnowledgeSource;
  sourceName?: string;
  sourceUrl?: string;
  disabled: boolean;
  pendingUrl: string;
  hasPendingFile: boolean;
  canRemove: boolean;
  onFileSelect: (file: File | null) => void;
  onUrlChange: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  onRemove: () => void;
  error?: boolean;
};

export function UploadPanel({
  sourceType,
  sourceName,
  sourceUrl,
  disabled,
  pendingUrl,
  hasPendingFile,
  canRemove,
  onFileSelect,
  onUrlChange,
  onConfirm,
  onCancel,
  onRemove,
  error,
}: UploadPanelProps) {
  const { accentColor } = useSettings();
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    onFileSelect(file ?? null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || sourceType || pendingUrl) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleCancel = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onCancel();
    setIsDragging(false);
  };

  const showButtons = !sourceType && (!!pendingUrl || hasPendingFile) && !disabled;

  return (
    <motion.section
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full max-w-2xl rounded-[32px] border border-white/20 dark:border-white/5 bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden p-1"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-white/5 pointer-events-none" />

      <div className="relative p-6 sm:p-8">
        <header className="flex flex-col gap-2 mb-8 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs uppercase tracking-[0.4em] font-bold"
            style={{ color: accentColor }}
          >
            Knowledge Base
          </motion.p>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-[var(--text-primary)] to-[var(--text-secondary)] dark:from-white dark:to-white/60">
            {sourceType ? "Source Active" : "Add Context"}
          </h2>
          {!sourceType && (
            <div className="space-y-2">
              <p className="text-sm text-[var(--text-secondary)] dark:text-white/50">
                Upload documents or provide a URL to enhance the AI's knowledge base.
              </p>
              <div className="flex flex-wrap justify-center gap-2 text-[10px] text-[var(--text-secondary)]/70 dark:text-white/30 uppercase tracking-wider font-medium">
                <span>PDF</span>
                <span>•</span>
                <span>Word</span>
                <span>•</span>
                <span>Excel</span>
                <span>•</span>
                <span>PowerPoint</span>
                <span>•</span>
                <span>TXT</span>
              </div>
            </div>
          )}
        </header>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* File Upload Zone */}
          <div className="relative group">
            {/* Spinning Border Container */}
            {disabled && hasPendingFile && !sourceType && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.3 }}
                className="absolute -inset-[2px] rounded-2xl overflow-hidden z-0"
              >
                <motion.div
                  className="absolute inset-[-100%]"
                  style={{
                    background: `conic-gradient(from 90deg at 50% 50%, transparent 0%, ${accentColor} 50%, transparent 100%)`,
                  }}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 2,
                    ease: "linear",
                    repeat: Infinity,
                  }}
                />
              </motion.div>
            )}

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "relative z-10 flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300 h-full",
                // Base state (glassmorphism)
                !disabled && !hasPendingFile && "bg-white/40 dark:bg-black/40 backdrop-blur-md hover:bg-white/30 dark:hover:bg-white/5",
                // Dragging state
                isDragging && "border-solid bg-white/50 dark:bg-white/10 scale-105",
                // Disabled / Inactive (Other is processing)
                (disabled || (pendingUrl && !hasPendingFile)) && !hasPendingFile && "opacity-40 cursor-not-allowed grayscale bg-white dark:bg-[#09090b]",
                // File Selected / Processing state - OPEN OPAQUE (No Opacity)
                hasPendingFile && disabled && "border-solid border-transparent shadow-lg bg-white dark:bg-[#09090b]",
                // File Selected / Ready state
                hasPendingFile && !disabled && "border-solid border-transparent shadow-lg bg-white/80 dark:bg-black/60"
              )}
              style={{
                borderColor: hasPendingFile || isDragging ? (disabled ? "transparent" : accentColor) : undefined,
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".doc,.docx,.ppt,.pptx,.pdf,.txt,.md,.mdx,.rtf,.csv,.json,.xlsx,.xls,.log"
                onChange={handleFileChange}
                disabled={disabled || !!sourceType || !!pendingUrl}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-20"
              />

              <div className={cn(
                "relative p-4 rounded-full bg-black/5 dark:bg-white/5 transition-colors group-hover:bg-white/80 dark:group-hover:bg-white/10",
                hasPendingFile && "bg-blue-500/10 text-blue-500"
              )}>
                {hasPendingFile ? <CheckCircle className="w-8 h-8" /> : <Upload className="w-8 h-8 opacity-60" />}
              </div>

              <div className="space-y-1">
                <p className="font-semibold text-sm">
                  {disabled && hasPendingFile && !sourceType ? "Uploading..." : (hasPendingFile ? "File Selected" : "Upload Document")}
                </p>
                <p className="text-xs text-[var(--text-secondary)] dark:text-white/40 max-w-[140px] mx-auto leading-relaxed">
                  {disabled && hasPendingFile && !sourceType ? "Processing content" : (hasPendingFile ? "Ready to process" : "Drag & drop or click to browse")}
                </p>
              </div>
            </motion.div>
          </div>

          {/* URL Input Zone */}
          <div className="relative group">
            {/* Spinning Border Container */}
            {disabled && !!pendingUrl && !hasPendingFile && !sourceType && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.3 }}
                className="absolute -inset-[2px] rounded-2xl overflow-hidden z-0"
              >
                <motion.div
                  className="absolute inset-[-100%]"
                  style={{
                    background: `conic-gradient(from 90deg at 50% 50%, transparent 0%, ${accentColor} 50%, transparent 100%)`,
                  }}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 2,
                    ease: "linear",
                    repeat: Infinity,
                  }}
                />
              </motion.div>
            )}

            <motion.div
              whileHover={{ scale: 1.02 }}
              className={cn(
                "relative z-10 flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-black/5 dark:border-white/10 p-8 text-center transition-all duration-300 h-full",
                // Base state
                !disabled && !hasPendingFile && !pendingUrl && "bg-white/40 dark:bg-black/40 backdrop-blur-md hover:bg-white/30 dark:hover:bg-white/5 hover:border-black/10 dark:hover:border-white/20",
                // Disabled / Inactive (Other is processing)
                (disabled || sourceType === "file" || hasPendingFile) && !(!!pendingUrl && disabled) && "opacity-40 cursor-not-allowed grayscale bg-white dark:bg-[#09090b]",
                // URL Valid / Processing - OPEN OPAQUE (No Opacity)
                !!pendingUrl && !hasPendingFile && disabled && "border-solid border-transparent shadow-lg bg-white dark:bg-[#09090b]",
                !!pendingUrl && !hasPendingFile && !disabled && !error && "border-solid border-transparent shadow-lg bg-white/80 dark:bg-black/60",
                // Error State
                !!pendingUrl && !hasPendingFile && !disabled && error && "border-solid border-red-500/50 shadow-lg bg-red-500/5 dark:bg-red-900/10"
              )}
              style={{
                borderColor: !!pendingUrl && !hasPendingFile ? (disabled ? "transparent" : accentColor) : undefined,
              }}
            >
              <div className={cn(
                "relative p-4 rounded-full bg-black/5 dark:bg-white/5 transition-colors",
                !!pendingUrl && !hasPendingFile && !error && ((disabled && !sourceType) ? "bg-blue-500/10 text-blue-500" : "bg-emerald-500/10 text-emerald-500"),
                !!pendingUrl && !hasPendingFile && error && "bg-red-500/10 text-red-500"
              )}>
                {!!pendingUrl && !hasPendingFile ? (error ? <AlertCircle className="w-8 h-8" /> : <CheckCircle className="w-8 h-8" />) : <Link className="w-8 h-8 opacity-60" />}
              </div>

              <div className="w-full space-y-3 z-10">
                <p className="font-semibold text-sm">
                  {disabled && !!pendingUrl && !hasPendingFile && !sourceType ? "Processing URL..." : (!!pendingUrl && !hasPendingFile ? "URL Ready" : "Add Link")}
                </p>
                <input
                  type="url"
                  placeholder="Paste URL here..."
                  value={pendingUrl}
                  onChange={(event) => onUrlChange(event.target.value)}
                  disabled={disabled || !!sourceType || hasPendingFile}
                  className="w-full text-center bg-transparent border-b border-black/10 dark:border-white/10 pb-1 text-sm focus:outline-none focus:border-black/30 dark:focus:border-white/30 transition-colors placeholder:text-black/30 dark:placeholder:text-white/20"
                />
              </div>
            </motion.div>
          </div>
        </div>

        <AnimatePresence>
          {showButtons && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 flex justify-center gap-3"
            >
              <button
                onClick={handleCancel}
                className="px-6 py-2.5 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-8 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                style={{ backgroundColor: accentColor }}
              >
                Analyze Context
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {sourceType && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 flex justify-center"
            >
              <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10 p-4 max-w-full">
                <div className="flex items-center gap-4 relative z-10">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 shrink-0">
                      {sourceType === 'file' ? <FileText size={18} /> : <Link size={18} />}
                    </div>
                    <div className="flex flex-col min-w-0 text-left">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        Active Context
                      </span>
                      <span className="text-sm font-medium truncate max-w-[200px] sm:max-w-[300px]" title={sourceType === "file" ? sourceName : sourceUrl}>
                        {sourceType === "file" ? sourceName : sourceUrl}
                      </span>
                    </div>
                  </div>

                  {canRemove && (
                    <button
                      onClick={onRemove}
                      className="p-2 rounded-lg text-red-500/70 hover:text-red-500 hover:bg-red-500/10 transition-colors shrink-0"
                      title="Remove source"
                    >
                      <XCircle size={20} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.section >
  );
}
