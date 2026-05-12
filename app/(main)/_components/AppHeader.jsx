'use client';

import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { UserButton } from "@stackframe/stack";

function AppHeader() {
    return (
        <div className="p-4 glass-card border-b border-white/5 flex justify-between items-center sticky top-0 z-50">
            <Link href="/dashboard" className="flex items-center gap-2 group transition-all active:scale-95">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
                    <Sparkles className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-bold font-outfit tracking-tighter text-white text-glow">Voce.AI</span>
            </Link>

            <div className="flex items-center gap-4">
                <UserButton />
            </div>
        </div>
    );
}

export default AppHeader;
