"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { TargetAudience } from "@/components/landing/target-audience";
import { ComparisonSection } from "@/components/landing/comparison-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { SecuritySection } from "@/components/landing/security-section";
import { UseCases } from "@/components/landing/use-cases";
import { TrustSignals } from "@/components/landing/trust-signals";
import { FAQ } from "@/components/landing/faq";
import { CTA } from "@/components/landing/cta";

import { HeroBackground } from "@/components/landing/hero-background";
import { BentoFeatures } from "@/components/landing/bento-features";
import { RealitySlider } from "@/components/landing/reality-slider";
import { VizPlayground } from "@/components/landing/viz-playground";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

export default function LandingPage() {
  const { user, loading } = useAuth(false);
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);



  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500/30 font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl supports-[backdrop-filter]:bg-black/50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 relative">
              <Image
                src="/logo-v2.png"
                alt="AURA Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-bold text-xl tracking-tight">AURA</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium px-4 py-2 bg-white text-black rounded-full hover:bg-zinc-200 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 overflow-hidden">
        <HeroBackground />

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-6xl md:text-8xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-zinc-400"
          >
            Chat with your <br />
            Intelligence.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Aura transforms your documents into a secure, searchable knowledge base.
            Zero hallucinations, 100% source-grounded answers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/login"
              className="px-8 py-4 bg-white text-black rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2 group shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]"
            >
              Start for free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#playground"
              className="px-8 py-4 bg-zinc-900 border border-zinc-700 text-white rounded-full font-medium hover:bg-zinc-800 transition-all"
            >
              View Analytics
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Trust Signals */}
      <TrustSignals />

      {/* Capabilities (Bento) */}
      <BentoFeatures />

      {/* Target Audience */}
      <TargetAudience />

      {/* Hallucination vs Reality Slider */}
      <RealitySlider />

      {/* Live Visualization Playground */}
      <div id="playground">
        <VizPlayground />
      </div>

      {/* RAG Pipeline Explained */}
      <HowItWorks />


      {/* Security */}
      <SecuritySection />

      {/* Use Cases */}
      <UseCases />

      {/* FAQ */}
      <FAQ />

      {/* CTA */}
      <CTA />

      {/* Footer */}
      <footer className="py-12 bg-black border-t border-white/5 text-zinc-500 text-sm">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 relative grayscale opacity-70">
              <Image
                src="/logo-v2.png"
                alt="AURA Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-semibold text-zinc-300">AURA</span>
          </div>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
          <div>
            &copy; 2025 Aura Intelligence. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
