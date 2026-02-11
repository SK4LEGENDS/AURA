import { Terminal } from "lucide-react";

export function TrustSignals() {
    return (
        <section className="py-12 border-y border-white/5 bg-zinc-950/50 backdrop-blur-md">
            <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 text-zinc-500 grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-500">
                <span className="flex items-center gap-2 font-semibold">
                    <Terminal className="w-5 h-5" /> Engineering-Led
                </span>
                <span className="flex items-center gap-2 font-semibold">
                    Research-Driven
                </span>
                <span className="flex items-center gap-2 font-semibold">
                    Production-Ready
                </span>
                <span className="flex items-center gap-2 font-semibold">
                    SOC 2 Compliant
                </span>
            </div>
        </section>
    );
}
