import TutorSidebar from "@/features/tutor/components/TutorSidebar";
import { RoleGuard } from "@/features/auth/components/RoleGuard";

export default function TutorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <RoleGuard allowedRoles={['TUTOR']}>
            <div className="min-h-screen bg-slate-50">
                <TutorSidebar />

                <main className="md:pl-64 min-h-screen transition-all">
                    {children}
                </main>
            </div>
        </RoleGuard>
    );
}
