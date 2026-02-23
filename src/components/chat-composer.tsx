"use client";

import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { ArrowUp, Mic, Square } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useSettings } from "@/lib/settings-context";

interface ChatComposerProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  onSubmit: () => void;
  onStop?: () => void;
  disabled: boolean;
}

export const ChatComposer = forwardRef<HTMLTextAreaElement, ChatComposerProps>(({
  prompt,
  onPromptChange,
  onSubmit,
  onStop,
  disabled,
}, ref) => {
  const { accentColor } = useSettings();
  const internalRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Expose internal ref to parent via forwarded ref
  useImperativeHandle(ref, () => internalRef.current!);

  useEffect(() => {
    if (internalRef.current) {
      internalRef.current.style.height = "auto";
      internalRef.current.style.height = `${internalRef.current.scrollHeight}px`;
    }
  }, [prompt]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto w-full max-w-3xl mb-6 relative z-10"
    >
      <div
        className="relative flex items-end gap-2 rounded-[32px] bg-white dark:bg-zinc-900 p-2 pl-4 border border-white/20 shadow-2xl transition-all duration-300 transform-gpu"
        style={isFocused ? {
          boxShadow: `0 0 40px ${accentColor}1A`, // 10% opacity
          borderColor: `${accentColor}4D`, // 30% opacity
          transform: "scale(1.01)"
        } : undefined}
      >

        <textarea
          ref={internalRef}
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Ask anything... (Ctrl + / to focus)"
          disabled={disabled}
          rows={1}
          className="max-h-[200px] min-h-[44px] flex-1 resize-none bg-transparent py-3 text-[16px] leading-relaxed text-[var(--text-primary)] dark:text-white placeholder-[var(--text-secondary)] placeholder:opacity-70 outline-none disabled:opacity-50"
        />

        <div className="flex items-center gap-1 pb-1">
          <AnimatePresence mode="wait">
            {disabled ? (
              <motion.button
                key="stop"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onStop}
                className="rounded-full p-2.5 text-white shadow-lg bg-red-500 hover:bg-red-600"
                title="Stop generation"
              >
                <Square size={20} fill="currentColor" strokeWidth={0} />
              </motion.button>
            ) : prompt.trim() ? (
              <motion.button
                key="send"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onSubmit}
                className="rounded-full p-2.5 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: `linear-gradient(to top right, ${accentColor}, ${accentColor}dd)`,
                  boxShadow: `0 10px 20px -5px ${accentColor}40`
                }}
              >
                <ArrowUp size={20} strokeWidth={2.5} />
              </motion.button>
            ) : (
              <motion.button
                key="mic"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="rounded-full p-2.5 text-[var(--text-secondary)] hover:bg-black/5 hover:text-[var(--text-primary)] dark:hover:bg-white/10 transition-colors"
                title="Use voice"
              >
                <Mic size={20} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
});

ChatComposer.displayName = "ChatComposer";
