"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTA() {
    return (
        <section className="py-32 bg-black relative overflow-hidden">
            {/* Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full blur-[120px]" />

            <div className="container mx-auto px-6 relative z-10 text-center">
                <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">
                    Ready to unlock your <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                        Collective Intelligence?
                    </span>
                </h2>
                <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
                    Join forward-thinking teams using Aura to make better decisions, faster.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/login"
                        className="px-10 py-5 bg-white text-black text-lg font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] flex items-center gap-2"
                    >
                        Get Started Now
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link
                        href="#"
                        className="px-10 py-5 bg-zinc-900 border border-zinc-800 text-white text-lg font-medium rounded-full hover:bg-zinc-800 transition-colors"
                    >
                        Contact Sales
                    </Link>
                </div>
            </div>
        </section>
    );
}
