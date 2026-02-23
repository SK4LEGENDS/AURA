"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { docSections } from "../content";

export default function DocContent({ slug }: { slug: string }) {
    const section = docSections[slug];

    if (!section) return null;

    const Icon = section.icon;

    return (
        <div className="container mx-auto px-4 max-w-5xl py-12">
            <Link
                href="/docs"
                className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white mb-8 transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Overview
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex items-center gap-4 mb-6">
                    <div className="h-12 w-12 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                        <Icon className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-white tracking-tight">{section.title}</h1>
                        <p className="text-neutral-400 mt-1">{section.description}</p>
                    </div>
                </div>

                <div className="h-px w-full bg-white/10 mb-10" />

                <div className="prose prose-invert prose-lg max-w-none">
                    {section.content}
                </div>
            </motion.div>
        </div>
    );
}
