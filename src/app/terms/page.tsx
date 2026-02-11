import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-purple-500/30 font-sans p-8 md:p-12">
            <div className="max-w-3xl mx-auto">
                <header className="mb-12">
                    <Link href="/" className="inline-flex items-center text-zinc-400 hover:text-white transition-colors mb-6 text-sm">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-400">
                        Terms of Service
                    </h1>
                    <p className="text-zinc-500 mt-4">Last Updated: December 28, 2025</p>
                </header>

                <article className="prose prose-invert prose-zinc max-w-none">
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                        <p className="text-zinc-300 mb-4">
                            By accessing or using Aura Intelligence, you agree to be bound by these Terms of Service. If you do not agree, you must not use our services.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-4">2. Usage License</h2>
                        <p className="text-zinc-300 mb-4">
                            Aura grants you a limited, non-exclusive, non-transferable license to use the platform for your internal business or personal purposes, subject to these terms.
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-zinc-300">
                            <li>You must not reverse engineer the underlying AI models.</li>
                            <li>You must not use the platform for any illegal or malicious activities.</li>
                            <li>You are responsible for all content uploaded to your workspace.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-4">3. Data Ownership & Liability</h2>
                        <p className="text-zinc-300 mb-4">
                            You retain all rights to the data you upload. Aura claims no ownership over your documents or the vectors generated from them.
                        </p>
                        <p className="text-zinc-300 mb-4">
                            **Disclaimer:** The Aura platform uses generative AI. While we strive for accuracy (Zero Hallucination with RAG), we do not guarantee that all responses will be perfectly accurate. You should verify critical information.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Termination</h2>
                        <p className="text-zinc-300 mb-4">
                            We reserve the right to suspend or terminate your access if you violate these terms or abuse the service API limits.
                        </p>
                    </section>
                </article>

                <footer className="mt-16 pt-8 border-t border-white/10 text-zinc-500 text-sm">
                    <p>Questions? Contact us at <Link href="/contact" className="text-white hover:underline">legal@aura.system</Link></p>
                </footer>
            </div>
        </div>
    );
}
