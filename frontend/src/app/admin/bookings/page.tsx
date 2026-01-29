"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/features/admin/services/admin.service";
import { Loader2, Calendar, Clock, User, Hash } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await adminService.getBookings();
                setBookings(response.data.bookings);
            } catch (error) {
                toast.error("Failed to fetch bookings");
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
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold font-heading text-slate-900">All Bookings</h1>
                <div className="text-sm text-slate-500">{bookings.length} Total Bookings</div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-slate-900 font-medium">
                        <tr>
                            <th className="px-6 py-4 text-xs uppercase">Student</th>
                            <th className="px-6 py-4 text-xs uppercase">Tutor</th>
                            <th className="px-6 py-4 text-xs uppercase">Schedule</th>
                            <th className="px-6 py-4 text-xs uppercase">Status</th>
                            <th className="px-6 py-4 text-xs uppercase">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {bookings.map((b) => (
                            <tr key={b.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                            <User size={10} />
                                        </div>
                                        <span className="font-medium text-slate-900">{b.student?.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="h-6 w-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-400">
                                            <User size={10} />
                                        </div>
                                        <span className="font-medium text-slate-900">{b.tutor?.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-1 text-[11px]">
                                            <Calendar size={12} className="text-slate-400" />
                                            {new Date(b.dateTime).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-1 text-[11px]">
                                            <Clock size={12} className="text-slate-400" />
                                            {new Date(b.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
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
                                    {b.totalAmount} BDT
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
