"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { bookingService } from "@/features/bookings/services/booking.service";
import { Booking, BookingFilterParams } from "@/features/bookings/types";
import { Loader2, Calendar, Clock, MapPin, ExternalLink, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { BookingDetailsModal } from "@/features/bookings/components/BookingDetailsModal";
import toast from "react-hot-toast";
import { ReviewModal } from "@/features/bookings/components/ReviewModal";

const STATUS_OPTIONS = [
    { value: "", label: "All Statuses" },
    { value: "PENDING", label: "Pending" },
    { value: "CONFIRMED", label: "Confirmed" },
    { value: "COMPLETED", label: "Completed" },
    { value: "CANCELLED", label: "Cancelled" },
];

export default function BookingsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // State
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [reviewingBooking, setReviewingBooking] = useState<Booking | null>(null);
    const [cancellingId, setCancellingId] = useState<string | null>(null);
    const [showFilters, setShowFilters] = useState(false);

    // Filter states
    const [status, setStatus] = useState(searchParams.get("status") || "");
    const [startDate, setStartDate] = useState(searchParams.get("startDate") || "");
    const [endDate, setEndDate] = useState(searchParams.get("endDate") || "");

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        const filters: BookingFilterParams = {};
        if (status) filters.status = status as BookingFilterParams["status"];
        if (startDate) filters.startDate = startDate;
        if (endDate) filters.endDate = endDate;

        const data = await bookingService.getMyBookings(filters);
        setBookings(data);
        setLoading(false);
    }, [status, startDate, endDate]);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    // Update URL query params
    const updateUrlParams = useCallback(() => {
        const params = new URLSearchParams();
        if (status) params.set("status", status);
        if (startDate) params.set("startDate", startDate);
        if (endDate) params.set("endDate", endDate);

        const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
        router.push(newUrl, { scroll: false });
    }, [status, startDate, endDate, router]);

    useEffect(() => {
        updateUrlParams();
    }, [updateUrlParams]);

    const handleClearFilters = () => {
        setStatus("");
        setStartDate("");
        setEndDate("");
    };

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

    const hasActiveFilters = status || startDate || endDate;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CONFIRMED':
                return 'bg-green-100 text-green-700';
            case 'COMPLETED':
                return 'bg-blue-100 text-blue-700';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-700';
            case 'CANCELLED':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    if (loading && bookings.length === 0) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>;

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <h1 className="text-2xl font-bold font-heading text-slate-900">My Bookings</h1>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2"
                    >
                        <Filter className="h-4 w-4" />
                        Filters
                        {hasActiveFilters && (
                            <span className="ml-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {[status, startDate, endDate].filter(Boolean).length}
                            </span>
                        )}
                    </Button>
                    <Link href="/tutors">
                        <Button>Book New Session</Button>
                    </Link>
                </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6 shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Status Filter */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                {STATUS_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Start Date */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">From Date</label>
                            <Input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>

                        {/* End Date */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">To Date</label>
                            <Input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                min={startDate}
                            />
                        </div>
                    </div>

                    {/* Filter Actions */}
                    <div className="flex gap-3 mt-4">
                        <Button onClick={() => { fetchBookings(); setShowFilters(false); }}>
                            Apply Filters
                        </Button>
                        {hasActiveFilters && (
                            <Button variant="ghost" onClick={handleClearFilters} className="flex items-center gap-2">
                                <X className="h-4 w-4" />
                                Clear All
                            </Button>
                        )}
                    </div>
                </div>
            )}

            {/* Active Filters Display */}
            {hasActiveFilters && !showFilters && (
                <div className="flex flex-wrap items-center gap-2 mb-6">
                    <span className="text-sm text-slate-600">Active filters:</span>
                    {status && (
                        <span className="inline-flex items-center gap-1 bg-white px-2 py-1 rounded text-sm border">
                            Status: {STATUS_OPTIONS.find(o => o.value === status)?.label}
                            <button onClick={() => setStatus("")} className="text-slate-400 hover:text-slate-600">
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    )}
                    {startDate && (
                        <span className="inline-flex items-center gap-1 bg-white px-2 py-1 rounded text-sm border">
                            From: {new Date(startDate).toLocaleDateString()}
                            <button onClick={() => setStartDate("")} className="text-slate-400 hover:text-slate-600">
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    )}
                    {endDate && (
                        <span className="inline-flex items-center gap-1 bg-white px-2 py-1 rounded text-sm border">
                            To: {new Date(endDate).toLocaleDateString()}
                            <button onClick={() => setEndDate("")} className="text-slate-400 hover:text-slate-600">
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    )}
                    <button onClick={handleClearFilters} className="text-sm text-primary hover:underline ml-auto">
                        Clear all
                    </button>
                </div>
            )}

            {/* Results Count */}
            <div className="mb-4">
                <p className="text-slate-600">
                    {loading ? "Loading..." : `${bookings.length} booking${bookings.length !== 1 ? 's' : ''} found`}
                </p>
            </div>

            <div className="space-y-4">
                {bookings.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
                        <h3 className="text-lg font-medium text-slate-900">No bookings found</h3>
                        <p className="text-slate-500 mt-2">
                            {hasActiveFilters
                                ? "Try adjusting your filters to see more results."
                                : "Get started by finding a tutor."}
                        </p>
                        {hasActiveFilters ? (
                            <Button onClick={handleClearFilters} className="mt-4">
                                Clear Filters
                            </Button>
                        ) : (
                            <Link href="/tutors" className="mt-4 inline-block">
                                <Button variant="outline">Browse Tutors</Button>
                            </Link>
                        )}
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
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(booking.status)}`}>
                                        {booking.status}
                                    </span>

                                    <div className="flex gap-2 w-full md:w-auto">
                                        {booking.status === 'PENDING' && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1"
                                                onClick={() => handleCancel(booking.id)}
                                                disabled={cancellingId === booking.id}
                                            >
                                                {cancellingId === booking.id ? <Loader2 size={14} className="animate-spin mr-2" /> : null}
                                                Cancel
                                            </Button>
                                        )}

                                        {booking.status === 'COMPLETED' && (
                                            <Button
                                                variant="default"
                                                size="sm"
                                                className="flex-1 bg-primary hover:bg-primary/90"
                                                onClick={() => setReviewingBooking(booking)}
                                            >
                                                Leave Review
                                            </Button>
                                        )}

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

            {reviewingBooking && (
                <ReviewModal
                    bookingId={reviewingBooking.id}
                    tutorName={reviewingBooking.tutor?.name || "Tutor"}
                    onClose={() => setReviewingBooking(null)}
                    onSuccess={() => {
                        setReviewingBooking(null);
                        fetchBookings();
                    }}
                />
            )}
        </div>
    );
}
