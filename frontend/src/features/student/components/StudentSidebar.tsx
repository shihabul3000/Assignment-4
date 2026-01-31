"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, User, LogOut, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from "@/components/ui/Button";

const sidebarItems = [
    { icon: Home, label: "Overview", href: "/dashboard" },
    { icon: Calendar, label: "My Bookings", href: "/dashboard/bookings" },
    { icon: User, label: "Profile", href: "/dashboard/profile" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

interface StudentSidebarProps {
    className?: string; // Allow overriding styles (e.g., removing 'hidden')
    onLinkClick?: () => void; // Allow closing menu on mobile when a link is clicked
}

export default function StudentSidebar({ className, onLinkClick }: StudentSidebarProps) {
    const pathname = usePathname();
    const { logout } = useAuth();

    return (
        <aside className={cn("w-64 bg-white border-r border-slate-200 min-h-screen flex flex-col fixed h-full transition-transform", className)}>
            <div className="p-6 border-b border-slate-200">
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-xl font-bold font-heading text-slate-900">SkillBridge</span>
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">Student</span>
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onLinkClick} // Close menu on mobile
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-200">
                <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" onClick={logout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                </Button>
            </div>
        </aside>
    );
}
