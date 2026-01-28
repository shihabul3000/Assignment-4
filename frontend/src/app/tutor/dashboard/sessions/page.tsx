"use client";

import { Button } from "@/components/ui/Button";
import { Loader2, Calendar, Clock, User, Check, X } from "lucide-react";
import { useState, useEffect } from "react";
import { bookingService } from "@/features/bookings/services/booking.service";
import { Booking } from "@/features/bookings/types";

export default function TutorSessionsPage() {
    const [sessions, setSessions] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        setLoading(true);
        const data = await bookingService.getMyBookings();
        setSessions(data);
        setLoading(false);
    };

    const handleAccept = async (bookingId: string) => {
        setUpdating(bookingId);
        const result = await bookingService.updateBookingStatus(bookingId, 'CONFIRMED');
        if (result.success) {
            setSessions(prev => prev.map(s => s.id === bookingId ? { ...s, status: 'CONFIRMED' } : s));
        } else {
            alert(result.message || 'Failed to accept booking');
        }
        setUpdating(null);
    };

    const handleDecline = async (bookingId: string) => {
        setUpdating(bookingId);
        const result = await bookingService.updateBookingStatus(bookingId, 'CANCELLED');
        if (result.success) {
            setSessions(prev => prev.map(s => s.id === bookingId ? { ...s, status: 'CANCELLED' } : s));
        } else {
            alert(result.message || 'Failed to decline booking');
        }
        setUpdating(null);
    };

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center">
                <Loader2 className="animate-spin h-8 w-8 text-primary" />
            </div>
        );
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold font-heading text-slate-900 mb-8">My Sessions</h1>

            <div className="space-y-4">
                {sessions.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                        No sessions found.
                    </div>
                )}
                {sessions.map(session => (
                    <div key={session.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row justify-between gap-6 hover:shadow-md transition-shadow">
                        <div className="flex gap-4">
                            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                <User size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">{session.student?.name || session.student?.user?.name || 'Unknown Student'}</h3>
                                <p className="text-sm text-primary font-medium">Session with Tutor</p>
                                <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                                    <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(session.startTime || session.dateTime || Date.now()).toLocaleDateString()}</span>
                                    <span className="flex items-center gap-1"><Clock size={14} /> {new Date(session.startTime || session.dateTime || Date.now()).toLocaleTimeString()} - {new Date(session.endTime || Date.now()).toLocaleTimeString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-3 justify-center">
                            <div className="text-right">
                                <span className="block font-bold text-slate-900">${session.tutor?.hourlyRate || 0}</span>
                                <span className={`text-xs font-bold uppercase tracking-wide ${
                                    session.status === 'CONFIRMED' ? 'text-green-600' : 
                                    session.status === 'CANCELLED' ? 'text-red-600' : 
                                    'text-yellow-600'
                                }`}>
                                    {session.status} (COD)
                                </span>
                            </div>

                            {session.status === 'PENDING' && (
                                <div className="flex gap-2">
                                    <Button 
                                        size="sm" 
                                        variant="outline" 
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => handleDecline(session.id)}
                                        disabled={updating === session.id}
                                    >
                                        {updating === session.id ? <Loader2 size={16} className="mr-1 animate-spin" /> : <X size={16} className="mr-1" />} 
                                        Decline
                                    </Button>
                                    <Button 
                                        size="sm" 
                                        className="bg-green-600 hover:bg-green-700"
                                        onClick={() => handleAccept(session.id)}
                                        disabled={updating === session.id}
                                    >
                                        {updating === session.id ? <Loader2 size={16} className="mr-1 animate-spin" /> : <Check size={16} className="mr-1" />} 
                                        Accept
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
