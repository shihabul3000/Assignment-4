"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { bookings } from "@/features/bookings/data/mock"; // We might need to move mock data to a shared place?
// Let's just create inline mock or use service.

import { useEffect, useState } from "react";
import { bookingService } from "@/features/bookings/services/booking.service";
import { Booking } from "@/features/bookings/types";
import { Loader2, Calendar, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function DashboardOverview() {
    const { user } = useAuth();
    const [myBookings, setMyBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const data = await bookingService.getMyBookings();
            setMyBookings(data);
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-8"><Loader2 className="animate-spin" /></div>;

    const upcomingBookings = myBookings.filter(b => new Date(b.startTime) > new Date());

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold font-heading text-slate-900">Welcome back, {user?.name.split(' ')[0]}!</h1>
                    <p className="text-slate-500">Here's what's happening with your learning journey.</p>
                </div>
                <Link href="/tutors">
                    <Button>Find a Tutor</Button>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-medium text-slate-500">Total Sessions</h3>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{myBookings.length}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-medium text-slate-500">Upcoming</h3>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{upcomingBookings.length}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-medium text-slate-500">Hours Learned</h3>
                    <p className="text-3xl font-bold text-slate-900 mt-2">12.5</p>
                </div>
            </div>

            {/* Recent/Upcoming */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-slate-900">Upcoming Sessions</h2>
                    <Link href="/dashboard/bookings" className="text-sm text-primary hover:underline flex items-center gap-1">
                        View All <ArrowRight size={14} />
                    </Link>
                </div>

                {upcomingBookings.length > 0 ? (
                    <div className="space-y-4">
                        {upcomingBookings.map(booking => (
                            <div key={booking.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                                        {new Date(booking.startTime).getDate()}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">{booking.tutor?.user.name}</h4>
                                        <div className="flex items-center gap-3 text-sm text-slate-500">
                                            <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(booking.startTime).toDateString()}</span>
                                            <span className="flex items-center gap-1"><Clock size={14} /> {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold">
                                        {booking.status}
                                    </span>
                                    <Link href={`/dashboard/bookings/${booking.id}`}>
                                        <Button variant="outline" size="sm">Details</Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white p-8 rounded-xl border border-dashed border-slate-200 text-center">
                        <p className="text-slate-500 mb-4">No upcoming sessions scheduled.</p>
                        <Link href="/tutors">
                            <Button variant="outline">Browse Tutors</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
