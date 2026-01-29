"use client";

import { Booking } from "../types";
import { Button } from "@/components/ui/Button";
import { X, Calendar, Clock, User, Mail, DollarSign, FileText, CheckCircle, AlertCircle, XCircle } from "lucide-react";

// Helper for native date formatting
const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
};

const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
};

interface BookingDetailsModalProps {
    booking: Booking;
    onClose: () => void;
}

export const BookingDetailsModal = ({ booking, onClose }: BookingDetailsModalProps) => {
    const statusConfig = {
        PENDING: { icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100", label: "Pending" },
        CONFIRMED: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-50", border: "border-green-100", label: "Confirmed" },
        CANCELLED: { icon: XCircle, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100", label: "Cancelled" },
        COMPLETED: { icon: CheckCircle, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100", label: "Completed" },
    };

    const config = statusConfig[booking.status];
    const StatusIcon = config.icon;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h2 className="text-xl font-bold text-slate-900 font-heading">Booking Details</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Status Banner */}
                    <div className={`flex items-center gap-3 p-4 rounded-xl border ${config.bg} ${config.border}`}>
                        <StatusIcon className={config.color} size={24} />
                        <div>
                            <p className={`font-bold ${config.color}`}>{config.label}</p>
                            <p className="text-sm text-slate-500">Booking ID: {booking.id}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Session Info */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Session Info</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-slate-700">
                                    <div className="p-2 bg-slate-100 rounded-lg text-slate-500"><Calendar size={18} /></div>
                                    <div>
                                        <p className="text-xs text-slate-400 leading-none mb-1">Date</p>
                                        <p className="font-medium">{formatDate(booking.dateTime)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-slate-700">
                                    <div className="p-2 bg-slate-100 rounded-lg text-slate-500"><Clock size={18} /></div>
                                    <div>
                                        <p className="text-xs text-slate-400 leading-none mb-1">Time & Duration</p>
                                        <p className="font-medium">
                                            {formatTime(booking.dateTime)} ({booking.duration} {booking.duration === 1 ? 'hour' : 'hours'})
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-slate-700">
                                    <div className="p-2 bg-slate-100 rounded-lg text-slate-500"><FileText size={18} /></div>
                                    <div>
                                        <p className="text-xs text-slate-400 leading-none mb-1">Total (COD)</p>
                                        <p className="font-medium">{(booking.tutor?.hourlyRate || 0) * booking.duration} BDT</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tutor Info */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Tutor Info</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-slate-700">
                                    <div className="p-2 bg-blue-50 rounded-lg text-blue-500"><User size={18} /></div>
                                    <div>
                                        <p className="text-xs text-slate-400 leading-none mb-1">Name</p>
                                        <p className="font-medium">{booking.tutor?.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-slate-700">
                                    <div className="p-2 bg-blue-50 rounded-lg text-blue-500"><Mail size={18} /></div>
                                    <div>
                                        <p className="text-xs text-slate-400 leading-none mb-1">Email</p>
                                        <p className="font-medium truncate max-w-[150px]">{booking.tutor?.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2 pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-wider">
                            <FileText size={16} />
                            Notes
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl text-slate-600 text-sm leading-relaxed border border-slate-100 italic">
                            {booking.notes || "No notes provided for this session."}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                    <Button onClick={onClose} variant="ghost">Close</Button>
                </div>
            </div>
        </div>
    );
};
