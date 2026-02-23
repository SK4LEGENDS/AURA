"use client";

import { motion } from "framer-motion";

export function HeroBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Orb 1: Purple - Moving */}
            <motion.div
                animate={{
                    x: [0, 100, -100, 0],
                    y: [0, -50, 50, 0],
                    scale: [1, 1.2, 0.9, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute top-[-20%] left-[20%] w-[800px] h-[800px] bg-brand-primary/20 rounded-full blur-[120px] opacity-40 mix-blend-screen"
            />

            {/* Orb 2: Blue - Moving */}
            <motion.div
                animate={{
                    x: [0, -70, 70, 0],
                    y: [0, 60, -60, 0],
                    scale: [1, 1.1, 0.9, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                }}
                className="absolute top-[10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[100px] opacity-40 mix-blend-screen"
            />

            {/* Orb 3: Cyan - Subtle Accent */}
            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.2, 0.3, 0.2],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute bottom-[-10%] left-[30%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] opacity-20 mix-blend-screen"
            />

            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />

            {/* Scanning Line */}
            <motion.div
                animate={{
                    top: ["-10%", "110%"],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-primary/50 to-transparent z-10 shadow-[0_0_20px_rgba(255,109,43,0.5)]"
            />

            {/* Data Particles */}
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{
                        x: Math.random() * 100 + "%",
                        y: Math.random() * 100 + "%",
                        opacity: 0
                    }}
                    animate={{
                        y: [null, "-20%"],
                        opacity: [0, 1, 0]
                    }}
                    transition={{
                        duration: Math.random() * 5 + 5,
                        repeat: Infinity,
                        delay: Math.random() * 5
                    }}
                    className="absolute w-1 h-1 bg-white rounded-full z-0"
                />
            ))}

            {/* Vignette */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-black opacity-80" />
        </div>
    );
}
