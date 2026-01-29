"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { Loader2, Calendar, Clock, Banknote, Users, Clock3, CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";
import { bookingService } from "@/features/bookings/services/booking.service";
import toast from "react-hot-toast";

export default function TutorDashboardOverview() {
    const { user } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [recentRequests, setRecentRequests] = useState<any[]>([]);
    const [confirmedSessions, setConfirmedSessions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionId, setActionId] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            const [statsRes, bookingsRes] = await Promise.all([
                apiClient.get('/tutors/dashboard/stats'),
                bookingService.getMyBookings()
            ]);

            if (statsRes.data.success) {
                setStats(statsRes.data.data.stats);
                setRecentRequests(statsRes.data.data.recentRequests);
            }

            setConfirmedSessions(bookingsRes.filter((b: any) => b.status === 'CONFIRMED'));
        } catch (error) {
            console.error("Failed to fetch tutor dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleStatusUpdate = async (id: string, status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED') => {
        setActionId(id);
        const result = await bookingService.updateBookingStatus(id, status);
        if (result.success) {
            toast.success(`Booking ${status.toLowerCase()} successfully`);
            fetchData();
        } else {
            toast.error(result.message || "Action failed");
        }
        setActionId(null);
    };

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[50vh]">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Active Sessions */}
                <div className="space-y-4">
                    <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                        <CheckCircle size={20} className="text-green-500" /> Active Sessions
                    </h2>
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
                        {confirmedSessions.length === 0 ? (
                            <div className="p-12 text-center text-slate-500 text-sm italic">
                                No active sessions at the moment.
                            </div>
                        ) : (
                            confirmedSessions.map((session: any) => (
                                <div key={session.id} className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                                    <div className="flex gap-3">
                                        <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                                            <Users size={18} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 text-sm">{session.student?.name}</p>
                                            <p className="text-[11px] text-slate-500">
                                                {new Date(session.dateTime).toLocaleDateString()} at {new Date(session.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="text-right mr-3">
                                            <p className="text-xs font-bold text-slate-900">{session.duration} hrs</p>
                                            <p className="text-[10px] text-slate-500">{session.totalAmount} BDT</p>
                                        </div>
                                        <button
                                            onClick={() => handleStatusUpdate(session.id, 'COMPLETED')}
                                            disabled={actionId === session.id}
                                            className="h-8 px-3 rounded-lg bg-primary text-white text-[11px] font-bold hover:bg-primary/90 disabled:opacity-50 flex items-center"
                                        >
                                            {actionId === session.id ? <Loader2 size={14} className="animate-spin" /> : "Complete"}
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Pending Requests */}
                <div className="space-y-4">
                    <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                        <Calendar size={20} className="text-yellow-500" /> Pending Requests
                    </h2>
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
                        {recentRequests.length === 0 ? (
                            <div className="p-12 text-center text-slate-500 text-sm italic">
                                No new requests.
                            </div>
                        ) : (
                            recentRequests.map((request: any) => (
                                <div key={request.id} className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                                    <div className="flex gap-3">
                                        <div className="h-10 w-10 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-500">
                                            <Users size={18} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 text-sm">{request.student?.name}</p>
                                            <p className="text-[11px] text-slate-500 line-clamp-1 italic">"{request.notes || "No notes"}"</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleStatusUpdate(request.id, 'CONFIRMED')}
                                            className="h-8 w-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100"
                                            title="Accept"
                                        >
                                            <CheckCircle size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(request.id, 'CANCELLED')}
                                            className="h-8 w-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100"
                                            title="Decline"
                                        >
                                            <XCircle size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

