"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/features/admin/services/admin.service";
import {
    Users,
    BookOpen,
    DollarSign,
    TrendingUp,
    Loader2,
    BarChart3,
    Activity,
    Lock,
    LucideIcon
} from "lucide-react";
import toast from "react-hot-toast";


interface ReportStats {
    users: {
        total: number;
        students: number;
        tutors: number;
        admins: number;
        banned: number;
        growth: string;
    };
    bookings: {
        total: number;
        pending: number;
        confirmed: number;
        completed: number;
        cancelled: number;
        fulfillmentRate: number;
    };
    revenue: {
        total: number;
        averageTicket: number;
        currency: string;
    };
    categories: Array<{
        name: string;
        count: number;
        growth: string;
    }>;
    platform: {
        health: string;
        uptime: string;
        latency: string;
    };
}

export default function AdminReportsPage() {
    const [stats, setStats] = useState<ReportStats | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const response = await adminService.getStats();
            setStats(response.data);
        } catch {
            toast.error("Failed to fetch platform statistics");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[50vh]">
                <Loader2 className="animate-spin text-primary h-8 w-8" />
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="p-8 text-center py-20 bg-white rounded-xl border border-slate-200">
                <h3 className="text-lg font-medium text-slate-900">Failed to load statistics</h3>
                <p className="text-slate-500 mt-2">There was an error connecting to the analytics engine.</p>
                <button
                    onClick={() => { setLoading(true); fetchStats(); }}
                    className="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold"
                >
                    Try Again
                </button>
            </div>
        );
    }

    const StatCard = ({ title, value, icon: Icon, color, subtitle, trend }: {
        title: string;
        value: string | number;
        icon: LucideIcon;
        color: string;
        subtitle: string;
        trend?: string;
    }) => (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${color} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon size={24} />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-xs font-bold ${parseFloat(trend) >= 0 ? 'text-green-500' : 'text-rose-500'}`}>
                        {parseFloat(trend) >= 0 ? '+' : ''}{trend}%
                        <TrendingUp size={14} />
                    </div>
                )}
            </div>
            <div className="space-y-1">
                <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
                <div className="text-3xl font-bold text-slate-900 tracking-tight">{value}</div>
                <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">{subtitle}</p>
            </div>
        </div>
    );

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold font-heading text-slate-900">Platform Analytics</h1>
                    <p className="text-slate-500 mt-1">Logical tracking of SkillBridge growth and performance.</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg px-4 py-2 flex items-center gap-3 shadow-sm">
                    <Activity size={16} className="text-green-500" />
                    <span className="text-sm font-bold text-slate-700 uppercase tracking-tighter">System: {stats.platform.health}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue"
                    value={`${stats.revenue.total.toLocaleString()} ${stats.revenue.currency}`}
                    icon={DollarSign}
                    color="bg-emerald-500"
                    subtitle={`Avg. ${stats.revenue.averageTicket} BDT/Session`}
                    trend="12.4"
                />
                <StatCard
                    title="Active Users"
                    value={stats.users.total}
                    icon={Users}
                    color="bg-blue-500"
                    subtitle={`${stats.users.students} Students / ${stats.users.tutors} Tutors`}
                    trend={stats.users.growth}
                />
                <StatCard
                    title="Sessions Completed"
                    value={stats.bookings.completed}
                    icon={BookOpen}
                    color="bg-indigo-500"
                    subtitle={`${stats.bookings.fulfillmentRate}% Success Rate`}
                    trend="8.1"
                />
                <StatCard
                    title="Moderation"
                    value={stats.users.banned}
                    icon={Lock}
                    color="bg-rose-500"
                    subtitle="Banned Accounts"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Resource Distribution</h3>
                            <p className="text-sm text-slate-500">How bookings are flowing across roles.</p>
                        </div>
                        <BarChart3 className="text-slate-300" size={24} />
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-bold text-slate-700">
                                <span>Platform Utilization (Completed/Total)</span>
                                <span>{stats.bookings.fulfillmentRate}%</span>
                            </div>
                            <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-indigo-500 transition-all duration-1000"
                                    style={{ width: `${stats.bookings.fulfillmentRate}%` }}
                                />
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-bold text-slate-900 mb-4">Top Performing Categories</h4>
                            <div className="space-y-4">
                                {stats.categories?.map((cat) => (
                                    <div key={cat.name} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-2 w-2 rounded-full bg-primary" />
                                            <span className="text-sm font-medium text-slate-700">{cat.name}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-xs font-bold text-slate-400">{cat.count} Bookings</span>
                                            <span className="text-xs font-bold text-green-500">+{cat.growth}%</span>
                                        </div>
                                    </div>
                                ))}
                                {(!stats.categories || stats.categories.length === 0) && (
                                    <p className="text-xs text-slate-400 italic">No category data available yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-xl shadow-slate-900/20 flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-bold mb-2">Platform Health</h3>
                        <p className="text-slate-400 text-sm">Real-time infrastructure reliability metrics.</p>
                    </div>

                    <div className="py-8 space-y-6">
                        <div className="flex justify-between items-center border-b border-white/10 pb-4">
                            <span className="text-slate-400 text-sm">System Uptime</span>
                            <span className="font-bold text-green-400">{stats.platform.uptime}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/10 pb-4">
                            <span className="text-slate-400 text-sm">Avg. API Latency</span>
                            <span className="font-bold text-blue-400">{stats.platform.latency}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/10 pb-4">
                            <span className="text-slate-400 text-sm">DB Clusters</span>
                            <span className="font-bold text-indigo-400">SYNCED</span>
                        </div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 flex items-center gap-4">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-medium text-slate-300">Global edge network active.</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
