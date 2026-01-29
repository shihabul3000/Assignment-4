"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { Loader2, Calendar, Clock, Banknote, Users, Clock3 } from "lucide-react";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";

export default function TutorDashboardOverview() {
    const { user } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [recentRequests, setRecentRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await apiClient.get('/tutors/dashboard/stats');
                if (response.data.success) {
                    setStats(response.data.data.stats);
                    setRecentRequests(response.data.data.recentRequests);
                }
            } catch (error) {
                console.error("Failed to fetch tutor stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center">
                <Loader2 className="animate-spin h-8 w-8 text-primary" />
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold font-heading text-slate-900">Hello, {user?.name.split(' ')[0]}</h1>
                    <p className="text-slate-500">Manage your sessions and students.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-medium text-slate-500 flex items-center gap-2"><Users size={16} /> Total Students</h3>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stats?.totalStudents || 0}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-medium text-slate-500 flex items-center gap-2"><Calendar size={16} /> Pending Requests</h3>
                    <p className="text-3xl font-bold text-slate-900 mt-2 text-yellow-600">{stats?.pendingRequests || 0}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-medium text-slate-500 flex items-center gap-2"><Banknote size={16} /> Monthly Earnings</h3>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stats?.monthlyEarnings || 0} BDT</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-medium text-slate-500 flex items-center gap-2"><Clock3 size={16} /> Hours Taught</h3>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stats?.hoursTaught || 0}</p>
                </div>
            </div>

            {/* Recent Requests Section */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                    <h2 className="font-bold text-lg text-slate-900">Recent Booking Requests</h2>
                </div>
                <div className="divide-y divide-slate-100">
                    {recentRequests.length === 0 ? (
                        <div className="p-6 text-center text-slate-500">
                            No new requests today.
                        </div>
                    ) : (
                        recentRequests.map((request: any) => (
                            <div key={request.id} className="p-4 hover:bg-slate-50 transition-colors flex justify-between items-center">
                                <div className="flex gap-3 items-center">
                                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                        <Users size={18} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">{request.student?.name}</p>
                                        <p className="text-xs text-slate-500">
                                            {new Date(request.dateTime).toLocaleDateString()} at {new Date(request.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-primary">{request.duration} hrs</p>
                                    <span className="text-[10px] font-bold uppercase text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded">Pending</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
