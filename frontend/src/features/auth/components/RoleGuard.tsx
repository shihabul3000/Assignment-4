"use client";

import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { UserRole } from "../types";

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles: UserRole[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
    const { user, isLoading, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                router.push("/login");
            } else if (user && !allowedRoles.includes(user.role)) {
                // Redirect to their own dashboard if they have the wrong role
                if (user.role === 'ADMIN') router.push('/admin');
                else if (user.role === 'TUTOR') router.push('/tutor/dashboard');
                else router.push('/dashboard');
            }
        }
    }, [user, isLoading, isAuthenticated, allowedRoles, router]);

    if (isLoading || !isAuthenticated || (user && !allowedRoles.includes(user.role))) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return <>{children}</>;
}
