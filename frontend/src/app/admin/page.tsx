"use client";

import { useEffect, useState } from "react";
import { Users, BookOpen, UserCheck, Banknote, Loader2, AlertCircle } from "lucide-react";
import { adminService } from "@/features/admin/services/admin.service";
import { Button } from "@/components/ui/Button";

interface AdminStats {
    users: {
        total: number;
        students: number;
        tutors: number;
        admins: number;
    };
    bookings: {
        total: number;
        pending: number;
        confirmed: number;
        completed: number;
        cancelled: number;
    };
    revenue: {
        total: number;
        currency: string;
    };
    platform: {
        health: string;
        uptime: string;
        latency: string;
    };
}

export default function AdminDashboardOverview() {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);


    const fetchStats = async () => {
        setLoading(true);
        setError(false);
        try {
            const response = await adminService.getStats();
            setStats(response.data);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="p-8">
                <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl flex flex-col items-center gap-4 text-center">
                    <AlertCircle size={40} className="text-red-400" />
                    <div>
                        <h3 className="text-lg font-bold">Failed to load platform overview</h3>
                        <p className="text-sm opacity-80">Check your connection or try again later.</p>
                    </div>
                    <Button onClick={fetchStats} variant="outline" className="border-red-200 hover:bg-red-100">Try Again</Button>
                </div>
            </div>
        );
    }


    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold font-heading text-slate-900">Admin Dashboard</h1>
                    <p className="text-slate-500">Platform overview and management.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-sm font-medium text-slate-500 flex items-center gap-2">
                        <Users size={16} className="text-blue-500" /> Total Users
                    </h3>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stats?.users?.total?.toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-sm font-medium text-slate-500 flex items-center gap-2">
                        <UserCheck size={16} className="text-green-500" /> Active Tutors
                    </h3>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stats?.users?.tutors?.toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-sm font-medium text-slate-500 flex items-center gap-2">
                        <BookOpen size={16} className="text-primary" /> Total Bookings
                    </h3>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stats?.bookings?.total?.toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-sm font-medium text-slate-500 flex items-center gap-2">
                        <Banknote size={16} className="text-indigo-500" /> Revenue (Est)
                    </h3>
                    <p className="text-3xl font-bold text-slate-900 mt-2">
                        {stats?.revenue?.total >= 1000
                            ? `${(stats.revenue.total / 1000).toFixed(1)}k`
                            : stats?.revenue?.total} {stats?.revenue?.currency}
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                    <h2 className="font-bold text-lg text-slate-900">Platform Health</h2>
                    <span className="flex items-center gap-2 text-xs font-bold text-green-500 uppercase tracking-widest">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        {stats?.platform?.health}
                    </span>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50/30">
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Infrastructure Status</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-600">System Uptime</span>
                                <span className="font-bold text-slate-900">{stats?.platform?.uptime}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-600">API Latency</span>
                                <span className="font-bold text-slate-900">{stats?.platform?.latency}</span>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Global Status</h4>
                        <div className="p-4 bg-white rounded-lg border border-slate-100 flex items-center gap-4">
                            <div className="h-10 w-10 rounded bg-blue-50 flex items-center justify-center text-blue-500">
                                <AlertCircle size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">Cloud Sync Active</p>
                                <p className="text-[11px] text-slate-500">All edge nodes are synchronized.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
