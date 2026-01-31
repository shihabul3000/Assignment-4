"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { useEffect, useState } from "react";
import { Loader2, Calendar, Clock, ArrowRight, BookOpen, Clock3, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { apiClient } from "@/lib/apiClient";
import { Booking } from "@/features/bookings/types";

interface StudentStats {
    totalSessions: number;
    upcomingSessionsCount: number;
    hoursLearned: number;
}

export default function DashboardOverview() {
    const { user } = useAuth();
    const [stats, setStats] = useState<StudentStats | null>(null);
    const [upcomingSessions, setUpcomingSessions] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await apiClient.get('/bookings/stats');
                if (response.data.success) {
                    setStats(response.data.data.stats);
                    setUpcomingSessions(response.data.data.upcomingSessions);
                }
            } catch (error) {
                console.error("Failed to fetch student stats", error);
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
                    <h1 className="text-2xl font-bold font-heading text-slate-900">Welcome back, {user?.name.split(' ')[0]}!</h1>
                    <p className="text-slate-500">Here&apos;s what&apos;s happening with your learning journey.</p>
                </div>
                <Link href="/tutors">
                    <Button className="bg-primary hover:bg-primary/90">Find a Tutor</Button>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><BookOpen size={20} /></div>
                        <h3 className="text-sm font-medium text-slate-500">Total Sessions</h3>
                    </div>
                    <p className="text-3xl font-bold text-slate-900">{stats?.totalSessions || 0}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600"><Calendar size={20} /></div>
                        <h3 className="text-sm font-medium text-slate-500">Upcoming</h3>
                    </div>
                    <p className="text-3xl font-bold text-slate-900">{stats?.upcomingSessionsCount || 0}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-50 rounded-lg text-green-600"><Clock3 size={20} /></div>
                        <h3 className="text-sm font-medium text-slate-500">Hours Learned</h3>
                    </div>
                    <p className="text-3xl font-bold text-slate-900">{stats?.hoursLearned || 0}</p>
                </div>
            </div>

            {/* Upcoming Sessions Section */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <LayoutDashboard size={20} className="text-slate-400" />
                        <h2 className="text-lg font-bold text-slate-900">Upcoming Sessions</h2>
                    </div>
                    <Link href="/dashboard/bookings" className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
                        View All <ArrowRight size={14} />
                    </Link>
                </div>

                {upcomingSessions.length > 0 ? (
                    <div className="grid gap-4">
                        {upcomingSessions.map(booking => (
                            <div key={booking.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-primary/30 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-slate-50 flex flex-col items-center justify-center border border-slate-100">
                                        <span className="text-[10px] uppercase font-bold text-slate-400 leading-none">
                                            {booking.dateTime ? new Date(booking.dateTime).toLocaleDateString([], { month: 'short' }) : 'N/A'}
                                        </span>
                                        <span className="text-lg font-bold text-slate-900 leading-tight">
                                            {booking.dateTime ? new Date(booking.dateTime).getDate() : '-'}
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{booking.tutor?.name}</h4>
                                        <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                                            <span className="flex items-center gap-1.5"><Clock size={14} className="text-slate-400" /> {booking.dateTime ? new Date(booking.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</span>
                                            <span className="flex items-center gap-1.5"><BookOpen size={14} className="text-slate-400" /> {booking.duration} hrs</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${booking.status === 'CONFIRMED' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                                        }`}>
                                        {booking.status}
                                    </span>
                                    <Link href="/dashboard/bookings">
                                        <Button variant="ghost" size="sm" className="hover:bg-primary/5 hover:text-primary">Details</Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-slate-50/50 p-12 rounded-2xl border border-dashed border-slate-200 text-center">
                        <div className="mx-auto w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-4 text-slate-400">
                            <Calendar size={24} />
                        </div>
                        <h3 className="text-slate-900 font-bold mb-1">No upcoming sessions</h3>
                        <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">You don&apos;t have any sessions scheduled. Start learning something new today!</p>
                        <Link href="/tutors">
                            <Button className="bg-primary hover:bg-primary/90 font-bold px-6">Browse Tutors</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
