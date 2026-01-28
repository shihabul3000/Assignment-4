"use client";

import { Button } from "@/components/ui/Button";
import { Loader2, Calendar, Clock, User, Check, X } from "lucide-react";
import { useState } from "react";

// Mock Data
const MOCK_SESSIONS = [
    { id: 1, student: "Alice Freeman", date: "2024-03-25", time: "14:00 - 15:00", subject: "Mathematics", status: "PENDING", price: 25 },
    { id: 2, student: "Bob Smith", date: "2024-03-26", time: "10:00 - 11:30", subject: "Calculus", status: "CONFIRMED", price: 40 },
];

export default function TutorSessionsPage() {
    const [sessions, setSessions] = useState(MOCK_SESSIONS);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold font-heading text-slate-900 mb-8">My Sessions</h1>

            <div className="space-y-4">
                {sessions.map(session => (
                    <div key={session.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row justify-between gap-6 hover:shadow-md transition-shadow">
                        <div className="flex gap-4">
                            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                <User size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">{session.student}</h3>
                                <p className="text-sm text-primary font-medium">{session.subject}</p>
                                <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                                    <span className="flex items-center gap-1"><Calendar size={14} /> {session.date}</span>
                                    <span className="flex items-center gap-1"><Clock size={14} /> {session.time}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-3 justify-center">
                            <div className="text-right">
                                <span className="block font-bold text-slate-900">${session.price}</span>
                                <span className={`text-xs font-bold uppercase tracking-wide ${session.status === 'CONFIRMED' ? 'text-green-600' : 'text-yellow-600'}`}>
                                    {session.status} (COD)
                                </span>
                            </div>

                            {session.status === 'PENDING' && (
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50"><X size={16} className="mr-1" /> Decline</Button>
                                    <Button size="sm" className="bg-green-600 hover:bg-green-700"><Check size={16} className="mr-1" /> Accept</Button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
