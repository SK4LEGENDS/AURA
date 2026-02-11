import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-purple-500/30 font-sans p-8 md:p-12">
            <div className="max-w-3xl mx-auto">
                <header className="mb-12">
                    <Link href="/" className="inline-flex items-center text-zinc-400 hover:text-white transition-colors mb-6 text-sm">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-400">
                        Privacy Policy
                    </h1>
                    <p className="text-zinc-500 mt-4">Last Updated: December 28, 2025</p>
                </header>

                <article className="prose prose-invert prose-zinc max-w-none">
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
                        <p className="text-zinc-300 mb-4">
                            At Aura Intelligence ("we", "our", or "us"), we prioritize the privacy and security of your data.
                            This Privacy Policy explains how we collect, use, disclosure, and safeguard your information when you access our platform.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-4">2. Data Isolation & Security</h2>
                        <p className="text-zinc-300 mb-4">
                            Aura is designed as a privacy-first RAG (Retrieval-Augmented Generation) platform.
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-zinc-300">
                            <li><strong>Zero-Retention Inference:</strong> We do not use your data to train our foundational models.</li>
                            <li><strong>Isolated Tenancy:</strong> Your documents and vector embeddings are stored in isolated namespaces, accessible only by your workspace.</li>
                            <li><strong>Encryption:</strong> All data is encrypted at rest (AES-256) and in transit (TLS 1.3).</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-4">3. Information We Collect</h2>
                        <p className="text-zinc-300 mb-4">
                            We collect only the minimum information required to operate the service:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-zinc-300">
                            <li><strong>Account Information:</strong> Email address and authentication credentials.</li>
                            <li><strong>Workspace Data:</strong> Documents you explicitly upload for processing.</li>
                            <li><strong>Usage Metrics:</strong> Anonymized telemetry to improve system performance (e.g., latency, error rates).</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Your Rights</h2>
                        <p className="text-zinc-300 mb-4">
                            You maintain full ownership of your data. You may export or permanently delete your workspace and all associated vectors at any time from the settings dashboard.
                        </p>
                    </section>
                </article>

                <footer className="mt-16 pt-8 border-t border-white/10 text-zinc-500 text-sm">
                    <p>Questions? Contact us at <Link href="/contact" className="text-white hover:underline">security@aura.system</Link></p>
                </footer>
            </div>
        </div>
    );
}
