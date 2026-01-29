"use client";

import { Users, BookOpen, UserCheck, Banknote } from "lucide-react";

export default function AdminDashboardOverview() {
    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold font-heading text-slate-900">Admin Dashboard</h1>
                    <p className="text-slate-500">Platform overview and management.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-medium text-slate-500 flex items-center gap-2"><Users size={16} /> Total Users</h3>
                    <p className="text-3xl font-bold text-slate-900 mt-2">1,250</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-medium text-slate-500 flex items-center gap-2"><UserCheck size={16} /> Active Tutors</h3>
                    <p className="text-3xl font-bold text-slate-900 mt-2">156</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-medium text-slate-500 flex items-center gap-2"><BookOpen size={16} /> Total Bookings</h3>
                    <p className="text-3xl font-bold text-slate-900 mt-2">8,500</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-medium text-slate-500 flex items-center gap-2"><Banknote size={16} /> Revenue (Est)</h3>
                    <p className="text-3xl font-bold text-slate-900 mt-2">120k BDT</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                    <h2 className="font-bold text-lg text-slate-900">System Activity</h2>
                </div>
                <div className="p-6 text-center text-slate-500">
                    System logs would appear here.
                </div>
            </div>
        </div>
    );
}
