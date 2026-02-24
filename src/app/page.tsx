"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

import { TargetAudience } from "@/components/landing/target-audience";
import { ComparisonSection } from "@/components/landing/comparison-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { SecuritySection } from "@/components/landing/security-section";
import { UseCases } from "@/components/landing/use-cases";
import { TrustSignals } from "@/components/landing/trust-signals";
import { FAQ } from "@/components/landing/faq";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";

import { HeroBackground } from "@/components/landing/hero-background";
import { BentoFeatures } from "@/components/landing/bento-features";
import { RealitySlider } from "@/components/landing/reality-slider";
import { VizPlayground } from "@/components/landing/viz-playground";

import { LanguageSwitcher } from "@/components/language-switcher";
import { useI18n } from "@/lib/i18n-context";

export default function LandingPage() {
  const { user, loading } = useAuth(false);
  const router = useRouter();
  const { t, isRTL } = useI18n();

  // Removed auto-redirection to dashboard to ensure entry point is always landing page
  /*
  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);
  */

  return (
    <div className={cn(
      "min-h-screen bg-black text-white selection:bg-brand-primary/30 font-sans",
      isRTL && "font-arabic"
    )}>
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl supports-backdrop-filter:bg-black/50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 relative">
              <Image
                src="/logo.png"
                alt="AURA Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-bold text-xl tracking-tight">{t("common.aura")}</span>
          </div>
          <div className="flex items-center gap-6">
            <LanguageSwitcher />
            <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              {t("common.signIn")}
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium px-4 py-2 bg-white text-black rounded-full hover:bg-zinc-200 transition-colors"
            >
              {t("common.getStarted")}
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
            className="text-6xl md:text-8xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-linear-to-b from-white via-white to-zinc-400 pb-4"
          >
            {t("landing.heroTitle")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            {t("landing.heroSubtitle")}
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
              {t("common.getStarted")}
              <ArrowRight className={cn("w-4 h-4 transition-transform", isRTL ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1")} />
            </Link>
            <Link
              href="/analytics"
              className="px-8 py-4 bg-zinc-900 border border-zinc-700 text-white rounded-full font-medium hover:bg-zinc-800 transition-all hover:border-brand-secondary/50 group"
            >
              {t("landing.viewAnalytics")}
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
      <Footer />
    </div>
  );
}
