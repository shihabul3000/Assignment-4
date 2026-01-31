"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/features/admin/services/admin.service";
import { Loader2, Calendar, Clock, User } from "lucide-react";
import { Booking } from "@/features/bookings/types";

export default function AdminBookingsPage() {

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await adminService.getBookings();
                setBookings(response.data?.bookings || []);
            } catch (error) {
                console.error("Failed to fetch bookings", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[50vh]">
                <Loader2 className="animate-spin text-primary h-8 w-8" />
            </div>
        );
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold font-heading text-slate-900 mb-8">System Bookings</h1>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date & Time</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tutor</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {bookings.map((b) => (
                            <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-1.5 text-slate-900 font-medium">
                                            <Calendar size={14} className="text-slate-400" />
                                            {new Date(b.dateTime).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-1">
                                            <Clock size={14} className="text-slate-400" />
                                            {new Date(b.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({b.duration}h)
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                            <User size={16} />
                                        </div>
                                        <div className="text-sm">
                                            <div className="font-medium text-slate-900">{b.tutor?.name}</div>
                                            <div className="text-slate-500 text-xs">{b.tutor?.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm">
                                        <div className="font-medium text-slate-900">{b.student?.name}</div>
                                        <div className="text-slate-500 text-xs">{b.student?.email}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${b.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                                        b.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-700'
                                        }`}>
                                        {b.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-bold text-slate-900">
                                    {b.duration * (b.tutor?.hourlyRate || 0)} BDT
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {bookings.length === 0 && (
                    <div className="p-12 text-center text-slate-500 italic">
                        No bookings recorded in the system.
                    </div>
                )}
            </div>
        </div>
    );
}
