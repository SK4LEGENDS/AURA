"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
    Github,
    Twitter,
    Linkedin,
    ArrowRight,
    Send,
    Terminal,
    BookOpen,
    Shield,
    Users,
    Globe,
    Zap,
    BarChart3
} from "lucide-react";
import { useI18n } from "@/lib/i18n-context";
import { cn } from "@/lib/utils";

interface FooterLink {
    label: string;
    href: string;
    icon?: React.ReactNode;
}

interface FooterSection {
    title: string;
    links: FooterLink[];
}

export function Footer() {
    const { t, isRTL } = useI18n();

    const currentYear = new Date().getFullYear();

    const footerSections: FooterSection[] = [
        {
            title: t("landing.footer.product"),
            links: [
                { label: t("landing.capabilities"), href: "#capabilities" },
                { label: t("landing.useCases.title"), href: "#use-cases" },
                { label: t("landing.security.title"), href: "#security" },
                { label: t("landing.faq.title"), href: "#faq" },
            ]
        },
        {
            title: t("landing.footer.news"),
            links: [
                { label: t("landing.footer.news1"), href: "/news/v1-2-4-release", icon: <Globe className="w-3.5 h-3.5" /> },
                { label: t("landing.footer.news2"), href: "/news/llama-3-2-integration", icon: <Zap className="w-3.5 h-3.5" /> },
                { label: t("landing.footer.news3"), href: "/news/global-language-expansion", icon: <Globe className="w-3.5 h-3.5" /> },
            ]
        },
        {
            title: t("landing.footer.resources"),
            links: [
                { label: t("docs.title"), href: "/docs", icon: <BookOpen className="w-3.5 h-3.5" /> },
                { label: t("docs.apiRef"), href: "/docs/api-reference", icon: <Terminal className="w-3.5 h-3.5" /> },
                { label: t("docs.i18nTitle"), href: "/docs/internationalization", icon: <Globe className="w-3.5 h-3.5" /> },
                { label: t("docs.aiIntelligence"), href: "/docs/ai-intelligence", icon: <Zap className="w-3.5 h-3.5" /> },
                { label: t("docs.visualizations"), href: "/docs/visualizations", icon: <BarChart3 className="w-3.5 h-3.5" /> },
                { label: t("landing.footer.community"), href: "https://github.com", icon: <Github className="w-3.5 h-3.5" /> },
            ]
        },
        {
            title: t("landing.footer.company"),
            links: [
                { label: t("landing.footer.devTeam"), href: "/dev-team", icon: <Users className="w-3.5 h-3.5" /> },
                { label: t("common.contact"), href: "/contact", icon: <Send className="w-3.5 h-3.5" /> },
            ]
        }
    ];

    return (
        <footer className="relative bg-black pt-24 pb-12 overflow-hidden border-t border-white/5">
            {/* Background Decorative Blurs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-brand-primary/50 to-transparent opacity-30" />
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">

                    {/* Brand Column */}
                    <div className="lg:col-span-4 space-y-6">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 relative">
                                <Image
                                    src="/logo.png"
                                    alt="AURA Logo"
                                    fill
                                    className="object-contain transition-transform group-hover:scale-110"
                                />
                            </div>
                            <span className="font-bold text-2xl tracking-tighter text-white">
                                {t("common.aura")}
                                <span className="text-brand-primary">.</span>
                            </span>
                        </Link>
                        <p className="text-zinc-400 text-lg leading-relaxed max-w-sm">
                            {t("landing.footer.slogan")}
                        </p>
                        <div className="flex items-center gap-4">
                            <SocialLink href="#" icon={<Twitter className="w-5 h-5" />} />
                            <SocialLink href="#" icon={<Github className="w-5 h-5" />} />
                            <SocialLink href="#" icon={<Linkedin className="w-5 h-5" />} />
                        </div>

                    </div>

                    {/* Links Columns */}
                    {footerSections.map((section, idx) => (
                        <div key={idx} className="lg:col-span-2 space-y-6">
                            <h4 className="text-white font-bold tracking-wider text-sm uppercase">
                                {section.title}
                            </h4>
                            <ul className="space-y-4">
                                {section.links.map((link, lIdx) => (
                                    <li key={lIdx}>
                                        <Link
                                            href={link.href}
                                            className="text-zinc-500 hover:text-brand-primary transition-colors flex items-center gap-2 group"
                                        >
                                            {link.icon && <span className="text-zinc-600 group-hover:text-brand-primary transition-colors">{link.icon}</span>}
                                            <span className="text-sm">{link.label}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>


                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-zinc-500 text-sm">
                    <div className="flex items-center gap-2">
                        <span>&copy; {currentYear} {t("common.aura")} Intelligence.</span>
                        <span className="hidden md:inline text-zinc-800">|</span>
                        <span className="flex items-center gap-1.5 hover:text-brand-primary transition-colors cursor-default">
                            {t("landing.footer.devTeam")}
                        </span>
                    </div>

                    <div className="flex items-center gap-8">
                        <Link href="/privacy" className="hover:text-white transition-colors">{t("common.privacy")}</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">{t("common.terms")}</Link>
                        <Link href="/contact" className="hover:text-white transition-colors">{t("common.contact")}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
    return (
        <a
            href={href}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-zinc-400 hover:bg-brand-primary hover:text-white hover:border-brand-primary hover:scale-110 hover:-translate-y-1 transition-all duration-300"
            target="_blank"
            rel="noopener noreferrer"
        >
            {icon}
        </a>
    );
}
