import AdminSidebar from "./components/AdminSidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-50">
            <AdminSidebar />

            <main className="md:pl-64 min-h-screen transition-all">
                {children}
            </main>
        </div>
    );
}
