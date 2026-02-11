"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

type PasswordStrengthMeterProps = {
    password: string;
};

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
    const [strength, setStrength] = useState(0);

    useEffect(() => {
        let score = 0;
        if (!password) {
            setStrength(0);
            return;
        }

        if (password.length > 8) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[^A-Za-z0-9]/.test(password)) score += 1;

        setStrength(score);
    }, [password]);

    const getStrengthLabel = () => {
        switch (strength) {
            case 0: return "Enter password";
            case 1: return "Weak";
            case 2: return "Fair";
            case 3: return "Good";
            case 4: return "Strong";
            default: return "";
        }
    };

    const getStrengthColor = () => {
        switch (strength) {
            case 1: return "bg-red-500";
            case 2: return "bg-yellow-500";
            case 3: return "bg-blue-500";
            case 4: return "bg-green-500";
            default: return "bg-zinc-700";
        }
    };

    if (!password) return null;

    return (
        <div className="space-y-2 mt-2">
            <div className="flex gap-1 h-1">
                {[1, 2, 3, 4].map((level) => (
                    <div
                        key={level}
                        className={cn(
                            "h-full w-full rounded-full transition-all duration-300",
                            strength >= level ? getStrengthColor() : "bg-zinc-800"
                        )}
                    />
                ))}
            </div>
            <p className={cn("text-xs text-right font-medium transition-colors",
                strength === 1 ? "text-red-400" :
                    strength === 2 ? "text-yellow-400" :
                        strength === 3 ? "text-blue-400" :
                            strength === 4 ? "text-green-400" : "text-zinc-500"
            )}>
                {getStrengthLabel()}
            </p>
        </div>
    );
}
