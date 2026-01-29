"use client";

import { useEffect, useState } from "react";
import { bookingService } from "@/features/bookings/services/booking.service";
import { Booking } from "@/features/bookings/types";
import { Loader2, Calendar, Clock, MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { BookingDetailsModal } from "@/features/bookings/components/BookingDetailsModal";
import toast from "react-hot-toast";

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [cancellingId, setCancellingId] = useState<string | null>(null);

    const fetchBookings = async () => {
        setLoading(true);
        const data = await bookingService.getMyBookings();
        setBookings(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleCancel = async (bookingId: string) => {
        if (!confirm("Are you sure you want to cancel this booking?")) return;

        setCancellingId(bookingId);
        const result = await bookingService.updateBookingStatus(bookingId, 'CANCELLED');

        if (result.success) {
            toast.success("Booking cancelled successfully");
            fetchBookings();
        } else {
            toast.error(result.message || "Failed to cancel booking");
        }
        setCancellingId(null);
    };

    if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>;

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold font-heading text-slate-900">My Bookings</h1>
                <Link href="/tutors">
                    <Button>Book New Session</Button>
                </Link>
            </div>

            <div className="space-y-4">
                {bookings.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
                        <h3 className="text-lg font-medium text-slate-900">No bookings found</h3>
                        <p className="text-slate-500 mt-2">Get started by finding a tutor.</p>
                        <Link href="/tutors" className="mt-4 inline-block">
                            <Button variant="outline">Browse Tutors</Button>
                        </Link>
                    </div>
                ) : (
                    bookings.map((booking) => (
                        <div key={booking.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                <div className="flex gap-4">
                                    <div className="h-16 w-16 rounded-xl bg-slate-100 flex flex-col items-center justify-center text-slate-700 border border-slate-200">
                                        <span className="text-xs font-bold uppercase">{new Date(booking.dateTime).toLocaleString('default', { month: 'short' })}</span>
                                        <span className="text-xl font-bold">{new Date(booking.dateTime).getDate()}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900">{booking.tutor?.name}</h3>
                                        <div className="flex flex-col gap-1 mt-1 text-sm text-slate-500">
                                            <div className="flex items-center gap-2">
                                                <Clock size={16} />
                                                {new Date(booking.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({booking.duration} hrs)
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-slate-900">
                                                    {(booking.tutor?.hourlyRate || 0) * booking.duration} BDT
                                                </span>
                                                <span className="text-xs text-slate-400">{booking.paymentMethod}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-3 justify-center">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                                        ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                                            booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}
                                    `}>
                                        {booking.status}
                                    </span>

                                    <div className="flex gap-2 w-full md:w-auto">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => handleCancel(booking.id)}
                                            disabled={booking.status !== 'PENDING' || cancellingId === booking.id}
                                        >
                                            {cancellingId === booking.id ? <Loader2 size={14} className="animate-spin mr-2" /> : null}
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => setSelectedBooking(booking)}
                                        >
                                            Details
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {selectedBooking && (
                <BookingDetailsModal
                    booking={selectedBooking}
                    onClose={() => setSelectedBooking(null)}
                />
            )}
        </div>
    );
}
