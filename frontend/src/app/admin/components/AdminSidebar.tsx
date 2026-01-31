"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, BarChart, LogOut, Settings, Calendar, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from "@/components/ui/Button";

const sidebarItems = [
    { icon: Home, label: "Overview", href: "/admin" },
    { icon: Users, label: "Users", href: "/admin/users" },
    { icon: Calendar, label: "Bookings", href: "/admin/bookings" },
    { icon: Tag, label: "Categories", href: "/admin/categories" },
    { icon: BarChart, label: "Reports", href: "/admin/reports" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
];

interface AdminSidebarProps {
    className?: string;
    onLinkClick?: () => void;
}

export default function AdminSidebar({ className, onLinkClick }: AdminSidebarProps) {
    const pathname = usePathname();
    const { logout } = useAuth();

    return (
        <aside className={cn("w-64 bg-slate-900 text-white min-h-screen flex flex-col fixed h-full transition-transform", className)}>
            <div className="p-6 border-b border-slate-800">
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-xl font-bold font-heading">SkillBridge</span>
                    <span className="text-xs font-medium bg-red-500 text-white px-2 py-0.5 rounded-full">Admin</span>
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onLinkClick}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                isActive
                                    ? "bg-red-600 text-white"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={logout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                </Button>
            </div>
        </aside>
    );
}
