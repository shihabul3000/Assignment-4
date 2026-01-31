"use client";

import Link from "next/link";
import { Menu, BookOpen } from "lucide-react";

interface DashboardHeaderProps {
    onMenuClick: () => void;
}

export default function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
    return (
        <header className="sticky top-0 z-40 flex h-16 items-center border-b bg-white px-4 shadow-sm md:hidden">
            <button
                onClick={onMenuClick}
                className="mr-4 text-slate-500 hover:text-slate-700 focus:outline-none"
            >
                <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold font-heading text-slate-900">SkillBridge</span>
            </div>
        </header>
    );
}
