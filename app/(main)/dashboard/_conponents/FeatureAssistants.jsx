"use client";
import React from "react";
import { useUser } from "@stackframe/stack";
import { ExpertList } from "@/services/Options";
import Image from "next/image";
import Link from "next/link";
import UserInputDialog from "./UserInputDialog";

function FeatureAssistants() {
    const user = useUser();
    return(
        <div className="space-y-12">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="font-medium text-primary/80 uppercase tracking-widest text-sm mb-1">Interactive Coaching</h2>
                    <h2 className="text-4xl font-bold font-outfit text-white leading-tight">
                        Welcome Back, <span className="text-primary text-glow">{user?.displayName?.split(' ')[0]}</span>
                    </h2>
                </div>
                <Link href="/handler/account-settings" className="px-6 py-2 rounded-full border border-white/10 hover:bg-white/5 transition-all text-sm font-medium">
                    View Profile
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {ExpertList.map((options, index) => (
                    <UserInputDialog key={index} ExpertList={options}>
                        <div className="glass-card p-6 flex flex-col items-center group cursor-pointer h-full justify-between hover:scale-[1.02] active:scale-[0.98]">
                            <div className="relative mb-4">
                                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full group-hover:bg-primary/40 transition-all"></div>
                                <Image src={options.icon} alt={options.name}
                                    width={90}
                                    height={90}
                                    style={options.icon === '/debate.png' ? { maskImage: 'radial-gradient(circle, black 60%, transparent 95%)', WebkitMaskImage: 'radial-gradient(circle, black 60%, transparent 95%)' } : {}}
                                    className={`relative object-contain group-hover:rotate-6 transition-transform duration-500 ${options.icon === '/debate.png' ? 'mix-blend-screen' : ''}`}
                                />
                            </div>
                            <h2 className="text-center font-semibold text-white/90 group-hover:text-primary transition-colors">{options.name}</h2>
                            <p className="text-[10px] text-white/40 mt-2 text-center uppercase tracking-tighter">AI Expert</p>
                        </div>
                    </UserInputDialog>
                ))}
            </div>
        </div>
    )
}

export default FeatureAssistants;