"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { PasswordStrengthMeter } from "@/components/password-strength-meter";
import { Check, ChevronRight, Lock, Shield, Server } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";

export default function LoginPage() {
    const { t, isRTL } = useI18n();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Step 2 State
    const [step, setStep] = useState<1 | 2>(1);
    const [workspaceName, setWorkspaceName] = useState("");
    const [useCase, setUseCase] = useState<string | null>(null);

    const router = useRouter();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isSignUp) {
                if (step === 1) {
                    // Create Account
                    await createUserWithEmailAndPassword(auth, email, password);
                    // Move to Step 2
                    setStep(2);
                } else {
                    // Complete Setup
                    if (auth.currentUser) {
                        await updateProfile(auth.currentUser, {
                            displayName: workspaceName || "User"
                        });
                    }
                    router.push("/dashboard");
                }
            } else {
                // Sign In
                await signInWithEmailAndPassword(auth, email, password);
                router.push("/dashboard");
            }
        } catch (err: any) {
            setError(err.message.replace("Firebase: ", ""));
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsSignUp(!isSignUp);
        setError(null);
        setStep(1);
    };

    return (
        <div className={cn(
            "min-h-screen flex items-center justify-center bg-zinc-950 text-white relative overflow-hidden font-sans selection:bg-brand-primary/30",
            isRTL ? "font-arabic" : ""
        )} dir={isRTL ? "rtl" : "ltr"}>
            {/* Subtle Value Reminder: Data Stream Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-px h-full bg-linear-to-b from-transparent via-white/5 to-transparent animate-pulse delay-75" />
                <div className="absolute top-0 left-2/4 w-px h-full bg-linear-to-b from-transparent via-white/5 to-transparent animate-pulse delay-150" />
                <div className="absolute top-0 left-3/4 w-px h-full bg-linear-to-b from-transparent via-white/5 to-transparent animate-pulse delay-300" />

                {/* Floating "Document" Silhouettes */}
                <div className="absolute top-20 right-20 w-32 h-40 border border-white/5 rounded-lg bg-white/1 blur-sm -rotate-6 animate-float" />
                <div className="absolute bottom-40 left-20 w-32 h-40 border border-white/5 rounded-lg bg-white/1 blur-sm rotate-12 animate-float-delayed" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md p-8 bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-10 relative"
            >
                <div className="text-center mb-8">
                    <div className="relative w-14 h-14 mx-auto mb-6">
                        <div className="absolute inset-0 bg-brand-primary/20 blur-xl rounded-full" />
                        <Image
                            src="/logo.png"
                            alt="AURA"
                            fill
                            className="object-contain relative z-10"
                            priority
                        />
                    </div>

                    <h2 className="text-2xl font-semibold tracking-tight text-white mb-2">
                        {isSignUp
                            ? (step === 1 ? t("auth.initWorkspace") : t("auth.configEnv"))
                            : t("auth.welcomeBack")
                        }
                    </h2>
                    <p className="text-sm text-zinc-400">
                        {isSignUp
                            ? (step === 1 ? t("auth.initSub") : t("auth.configSub"))
                            : t("auth.authSub")
                        }
                    </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-5">
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: isRTL ? -20 : 20 }}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">{t("auth.emailLabel")}</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary/50 focus:border-brand-primary/50 transition-all placeholder:text-zinc-700 text-sm"
                                        placeholder="operator@aura.system"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">{t("auth.passLabel")}</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary/50 focus:border-brand-primary/50 transition-all placeholder:text-zinc-700 text-sm"
                                        placeholder="••••••••••••"
                                        required
                                    />
                                    {isSignUp && password.length > 0 && (
                                        <PasswordStrengthMeter password={password} />
                                    )}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: isRTL ? 20 : -20 }}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">{t("auth.workspaceNameLabel")}</label>
                                    <input
                                        type="text"
                                        value={workspaceName}
                                        onChange={(e) => setWorkspaceName(e.target.value)}
                                        className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary/50 focus:border-brand-primary/50 transition-all placeholder:text-zinc-700 text-sm"
                                        placeholder="e.g. Research Protocol Alpha"
                                        required={step === 2}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">{t("auth.useCaseLabel")}</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {["Research", "Development", "Legal", "Personal"].map((item) => (
                                            <button
                                                key={item}
                                                type="button"
                                                onClick={() => setUseCase(item)}
                                                className={cn(
                                                    "px-3 py-2 rounded-md text-xs font-medium border transition-all text-left",
                                                    useCase === item
                                                        ? "bg-brand-primary/10 border-brand-primary/50 text-brand-primary"
                                                        : "bg-black/20 border-white/5 text-zinc-500 hover:bg-white/5"
                                                )}
                                            >
                                                {item}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {error && (
                        <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                            <div className="w-1 h-1 bg-red-400 rounded-full" />
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-sm rounded-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-zinc-400 border-t-zinc-950 rounded-full animate-spin" />
                                {t("auth.processing")}
                            </span>
                        ) : (
                            <>
                                {isSignUp
                                    ? (step === 1 ? t("auth.initWorkspace") : t("auth.completeSetup"))
                                    : t("auth.authenticate")
                                }
                                <ChevronRight className={cn("w-4 h-4 opacity-50", isRTL ? "rotate-180" : "")} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center gap-4">
                    <button
                        onClick={toggleMode}
                        className="text-xs text-zinc-400 hover:text-white transition-colors"
                    >
                        {isSignUp
                            ? t("auth.alreadyHaveEnv")
                            : t("auth.newToAura")
                        }
                    </button>

                    {/* Trust Indicators */}
                    <div className="flex items-center gap-4 text-[10px] text-zinc-600 uppercase tracking-widest font-medium">
                        <span className="flex items-center gap-1.5">
                            <Lock className="w-3 h-3" /> {t("auth.e2e")}
                        </span>
                        <span className="w-px h-3 bg-zinc-800" />
                        <span className="flex items-center gap-1.5">
                            <Shield className="w-3 h-3" /> {t("auth.isolated")}
                        </span>
                    </div>

                    <Link href="/" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors pt-4">
                        {isRTL ? "→" : "←"} {t("common.backToHome")}
                    </Link>
                </div>
            </motion.div>

            {/* CSS for custom float animation */}
            <style jsx global>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(-6deg); }
                    50% { transform: translateY(-20px) rotate(-6deg); }
                }
                @keyframes float-delayed {
                    0%, 100% { transform: translateY(0) rotate(12deg); }
                    50% { transform: translateY(-15px) rotate(12deg); }
                }
                .animate-float { animation: float 10s ease-in-out infinite; }
                .animate-float-delayed { animation: float-delayed 12s ease-in-out infinite reverse; }
            `}</style>
        </div>
    );
}
