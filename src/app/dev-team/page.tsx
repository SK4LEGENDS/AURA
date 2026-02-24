"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n-context";
import { ArrowLeft, Github, Twitter, Linkedin, ExternalLink, Shield, Cpu, Zap, X, Terminal, Activity, Focus, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/landing/footer";

export default function DevTeamPage() {
    const { t } = useI18n();
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const architects = [
        {
            id: "kailash",
            name: t("devTeam.kailash.name"),
            role: t("devTeam.kailash.role"),
            bio: t("devTeam.kailash.bio"),
            image: "/dev-placeholder-1.png",
            specialty: "Neural Systems & Procedural Structuralism",
            icon: <Cpu className="w-5 h-5" />,
            isTactical: true,
            dossier: {
                status: t("devTeam.kailash.dossier.status"),
                clearance: t("devTeam.kailash.dossier.clearance"),
                metrics: t("devTeam.kailash.dossier.metrics", { returnObjects: true }) as unknown as string[],
                directives: t("devTeam.kailash.dossier.directives", { returnObjects: true }) as unknown as string[]
            }
        },
        {
            id: "kali-vignesh",
            name: t("devTeam.kaliVignesh.name"),
            role: t("devTeam.kaliVignesh.role"),
            bio: t("devTeam.kaliVignesh.bio"),
            image: "/dev-placeholder-2.png",
            specialty: "Frontend Architecture & UX Vision",
            icon: <Zap className="w-5 h-5" />,
            isTactical: false,
            dossier: {
                focus: t("devTeam.kaliVignesh.dossier.focus"),
                vision: t("devTeam.kaliVignesh.dossier.vision"),
                technical: t("devTeam.kaliVignesh.dossier.technical", { returnObjects: true }) as unknown as string[]
            }
        }
    ];

    const activeDev = architects.find(a => a.id === selectedId);

    return (
        <main className="min-h-screen bg-black text-white selection:bg-brand-primary/30">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[120px] -translate-y-1/2" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-brand-secondary/5 rounded-full blur-[120px] translate-y-1/2" />
            </div>

            {/* Navigation Header */}
            <nav className="relative z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="group flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        <span className="text-sm font-medium tracking-wide uppercase">{t("common.backToHome")}</span>
                    </Link>

                    <div />

                    <div className="w-24" />
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-3xl"
                    >
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
                            {t("devTeam.title")}
                            <span className="text-brand-primary">.</span>
                        </h1>
                        <p className="text-xl text-zinc-400 font-light leading-relaxed">
                            {t("devTeam.subtitle")}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Architects Grid */}
            <section className="pb-32">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {architects.map((dev, idx) => (
                            <motion.div
                                key={dev.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: idx * 0.2 }}
                                className="group relative"
                            >
                                <div className="absolute -inset-px bg-linear-to-b from-white/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-8 md:p-12 overflow-hidden h-full flex flex-col">
                                    <div className={cn(
                                        "absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition-opacity duration-500",
                                        dev.isTactical ? "text-brand-primary" : "text-brand-secondary"
                                    )}>
                                        {dev.icon}
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-8 items-start mb-auto">
                                        <div className={cn(
                                            "w-32 h-32 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden shrink-0 transition-colors duration-500",
                                            dev.isTactical ? "group-hover:border-brand-primary/50" : "group-hover:border-brand-secondary/50"
                                        )}>
                                            <div className="absolute inset-0 flex items-center justify-center text-zinc-700 font-bold text-4xl italic">
                                                {dev.name[0]}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <h3 className={cn(
                                                    "text-3xl font-bold tracking-tight text-white transition-colors",
                                                    dev.isTactical ? "group-hover:text-brand-primary" : "group-hover:text-brand-secondary"
                                                )}>
                                                    {dev.name}
                                                </h3>
                                                <p className={cn(
                                                    "text-sm font-bold uppercase tracking-widest mt-1",
                                                    dev.isTactical ? "text-brand-primary" : "text-brand-secondary"
                                                )}>
                                                    {dev.role}
                                                </p>
                                            </div>

                                            <div className="flex gap-4">
                                                <SocialLink
                                                    icon={<Github className="w-4 h-4" />}
                                                    brandColor={dev.isTactical ? "primary" : "secondary"}
                                                />
                                                <SocialLink
                                                    icon={<Twitter className="w-4 h-4" />}
                                                    brandColor={dev.isTactical ? "primary" : "secondary"}
                                                />
                                                <SocialLink
                                                    icon={<Linkedin className="w-4 h-4" />}
                                                    brandColor={dev.isTactical ? "primary" : "secondary"}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-12 space-y-6">
                                        <div className="space-y-2">
                                            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{t("common.specialty")}</p>
                                            <p className="text-lg text-white font-semibold">{dev.specialty}</p>
                                        </div>

                                        <div className="space-y-2">
                                            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{t("common.brief")}</p>
                                            <p className="text-zinc-400 leading-relaxed font-sans text-sm">
                                                {dev.bio}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-12 pt-8 border-t border-white/5 flex justify-end">
                                        <button
                                            onClick={() => setSelectedId(dev.id)}
                                            className={cn(
                                                "flex items-center gap-2 transition-colors text-sm font-medium group/btn cursor-pointer",
                                                dev.isTactical ? "text-zinc-500 hover:text-brand-primary" : "text-zinc-500 hover:text-brand-secondary"
                                            )}
                                        >
                                            {t("devTeam.viewProfile")}
                                            <ExternalLink className="w-3 h-3 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Dossier Modal Overlay */}
            <AnimatePresence>
                {selectedId && activeDev && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-6"
                    >
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-black/90 backdrop-blur-md"
                            onClick={() => setSelectedId(null)}
                        />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className={cn(
                                "relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[2.5rem] border bg-zinc-950 shadow-2xl flex flex-col md:flex-row",
                                activeDev.isTactical ? "border-brand-primary/30" : "border-brand-secondary/30"
                            )}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedId(null)}
                                className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors hover:bg-white/10"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Left Side: Profile Preview */}
                            <div className={cn(
                                "w-full md:w-80 shrink-0 p-8 md:p-12 border-b md:border-b-0 md:border-r border-white/5 flex flex-col items-center text-center",
                                activeDev.isTactical ? "bg-brand-primary/5" : "bg-brand-secondary/5"
                            )}>
                                <div className={cn(
                                    "w-32 h-32 rounded-3xl mb-6 flex items-center justify-center border",
                                    activeDev.isTactical ? "border-brand-primary/30 bg-brand-primary/10" : "border-brand-secondary/30 bg-brand-secondary/10"
                                )}>
                                    {activeDev.isTactical ? (
                                        <Shield className="w-12 h-12 text-brand-primary animate-pulse" />
                                    ) : (
                                        <Eye className="w-12 h-12 text-brand-secondary" />
                                    )}
                                </div>
                                <h3 className="text-2xl font-bold mb-2">{activeDev.name}</h3>
                                <p className={cn(
                                    "text-xs font-bold uppercase tracking-[0.2em] mb-8",
                                    activeDev.isTactical ? "text-brand-primary" : "text-brand-secondary"
                                )}>
                                    {activeDev.role}
                                </p>

                                <div className="space-y-4 w-full text-left">
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                                            <Activity className="w-3 h-3" />
                                            {t("devTeam.dossier.status")}
                                        </p>
                                        <p className={cn(
                                            "text-sm font-medium",
                                            activeDev.isTactical ? "text-brand-primary font-mono" : "text-white"
                                        )}>
                                            {activeDev.dossier.status || "ID-VERIFIED"}
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                                            <Terminal className="w-3 h-3" />
                                            {t("devTeam.dossier.clearance")}
                                        </p>
                                        <p className="text-sm font-medium text-white">
                                            {activeDev.dossier.clearance || "UNRESTRICTED"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Detailed Intelligence */}
                            <div className="flex-1 p-8 md:p-12 overflow-y-auto custom-scrollbar">
                                <div className="max-w-xl">
                                    <h2 className={cn(
                                        "text-xs font-bold uppercase tracking-[0.3em] mb-12 flex items-center gap-3",
                                        activeDev.isTactical ? "text-brand-primary" : "text-brand-secondary"
                                    )}>
                                        <div className={cn(
                                            "w-8 h-px",
                                            activeDev.isTactical ? "bg-brand-primary/30" : "bg-brand-secondary/30"
                                        )} />
                                        Intelligence Dossier
                                    </h2>

                                    {activeDev.isTactical ? (
                                        /* Tactical Variant */
                                        <div className="space-y-12">
                                            <div className="space-y-4">
                                                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                                    <Activity className="w-3 h-3 text-brand-primary" />
                                                    {t("devTeam.dossier.metrics")}
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {(activeDev.dossier.metrics as string[] || []).map((m, i) => (
                                                        <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/3 border border-white/5 font-mono text-xs text-zinc-300">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary shadow-[0_0_8px_rgba(255,107,0,0.5)]" />
                                                            {m}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                                    <Focus className="w-3 h-3 text-brand-primary" />
                                                    {t("devTeam.dossier.directives")}
                                                </h4>
                                                <div className="space-y-3">
                                                    {(activeDev.dossier.directives as string[] || []).map((d, i) => (
                                                        <div key={i} className="relative pl-6 py-2 border-l border-brand-primary/20">
                                                            <div className="absolute top-4 left-0 w-2 h-px bg-brand-primary" />
                                                            <p className="text-sm text-zinc-400 font-mono leading-relaxed">{d}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        /* Visionary Variant */
                                        <div className="space-y-12">
                                            <div className="space-y-4">
                                                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                                    <Focus className="w-3 h-3 text-brand-secondary" />
                                                    {t("devTeam.dossier.focus")}
                                                </h4>
                                                <p className="text-2xl font-light text-white leading-tight">
                                                    {activeDev.dossier.focus}
                                                </p>
                                            </div>

                                            <div className="space-y-4">
                                                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                                    <Eye className="w-3 h-3 text-brand-secondary" />
                                                    {t("devTeam.dossier.vision")}
                                                </h4>
                                                <p className="text-lg text-zinc-400 font-light leading-relaxed italic">
                                                    "{activeDev.dossier.vision}"
                                                </p>
                                            </div>

                                            <div className="space-y-4">
                                                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                                    <Zap className="w-3 h-3 text-brand-secondary" />
                                                    {t("devTeam.dossier.technical")}
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {(activeDev.dossier.technical as string[] || []).map((t, i) => (
                                                        <span key={i} className="px-3 py-1.5 rounded-full bg-brand-secondary/10 border border-brand-secondary/20 text-brand-secondary text-[10px] font-bold tracking-wider">
                                                            {t}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-20 flex items-center gap-4 text-zinc-600 text-[10px] tracking-widest font-bold uppercase">
                                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                                        End Of Protocol
                                        <div className="flex-1 h-px bg-zinc-900" />
                                        Secure Session Alpha
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer />
        </main>
    );
}

function SocialLink({ icon, brandColor }: { icon: React.ReactNode, brandColor: "primary" | "secondary" }) {
    return (
        <button className={cn(
            "w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 transition-all duration-300 cursor-pointer",
            brandColor === "primary" ? "hover:bg-brand-primary hover:text-white hover:border-brand-primary" : "hover:bg-brand-secondary hover:text-white hover:border-brand-secondary"
        )}>
            {icon}
        </button>
    );
}
