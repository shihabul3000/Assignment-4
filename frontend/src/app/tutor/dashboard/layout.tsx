"use client";

import { useState } from "react";
import TutorSidebar from "@/features/tutor/components/TutorSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { RoleGuard } from "@/features/auth/components/RoleGuard";

export default function TutorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <RoleGuard allowedRoles={['TUTOR']}>
            <div className="min-h-screen bg-slate-50">
                {/* Desktop Sidebar */}
                <TutorSidebar className="hidden md:flex" />

                {/* Mobile Sidebar Overlay */}
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 z-50 md:hidden">
                        <div
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <TutorSidebar
                            className="fixed inset-y-0 left-0 z-50 w-64 shadow-xl animate-in slide-in-from-left duration-300"
                            onLinkClick={() => setIsMobileMenuOpen(false)}
                        />
                    </div>
                )}

                <main className="md:pl-64 min-h-screen transition-all flex flex-col">
                    <DashboardHeader onMenuClick={() => setIsMobileMenuOpen(true)} />
                    <div className="flex-1 p-4 md:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </RoleGuard>
    );
}
