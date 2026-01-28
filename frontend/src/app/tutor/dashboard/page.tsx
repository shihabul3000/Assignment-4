"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { Loader2, Calendar, Clock, DollarSign, Users } from "lucide-react";

export default function TutorDashboardOverview() {
    const { user } = useAuth();

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
                    <p className="text-3xl font-bold text-slate-900 mt-2">12</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-medium text-slate-500 flex items-center gap-2"><Calendar size={16} /> Pending Requests</h3>
                    <p className="text-3xl font-bold text-slate-900 mt-2 text-yellow-600">3</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-medium text-slate-500 flex items-center gap-2"><DollarSign size={16} /> Monthly Earnings</h3>
                    <p className="text-3xl font-bold text-slate-900 mt-2">$450</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-medium text-slate-500 flex items-center gap-2"><Clock size={16} /> Hours Taught</h3>
                    <p className="text-3xl font-bold text-slate-900 mt-2">24</p>
                </div>
            </div>

            {/* Recent Requests Placeholder */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                    <h2 className="font-bold text-lg text-slate-900">Recent Booking Requests</h2>
                </div>
                <div className="p-6 text-center text-slate-500">
                    No new requests today.
                </div>
            </div>
        </div>
    );
}
