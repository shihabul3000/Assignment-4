import StudentSidebar from "@/features/student/components/StudentSidebar";

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-50">
            <StudentSidebar />

            <main className="md:pl-64 min-h-screen transition-all">
                {/* Mobile Header could go here */}
                {children}
            </main>
        </div>
    );
}
