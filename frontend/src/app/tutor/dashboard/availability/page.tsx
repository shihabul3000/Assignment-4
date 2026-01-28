"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Check, Plus } from "lucide-react";
import toast from "react-hot-toast";

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function AvailabilityPage() {
    const [schedule, setSchedule] = useState<Record<string, boolean>>(
        DAYS.reduce((acc, day) => ({ ...acc, [day]: true }), {})
    );

    const toggleDay = (day: string) => {
        setSchedule(prev => ({ ...prev, [day]: !prev[day] }));
    };

    const handleSave = () => {
        toast.success("Availability updated successfully");
    };

    return (
        <div className="p-8 max-w-4xl">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold font-heading text-slate-900">Manage Availability</h1>
                    <p className="text-slate-500">Set the days and times you are available for sessions.</p>
                </div>
                <Button onClick={handleSave}>Save Changes</Button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100">
                {DAYS.map(day => (
                    <div key={day} className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div
                                onClick={() => toggleDay(day)}
                                className={`w-12 h-6 rounded-full cursor-pointer transition-colors relative ${schedule[day] ? 'bg-primary' : 'bg-slate-200'}`}
                            >
                                <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${schedule[day] ? 'translate-x-6' : ''}`}></div>
                            </div>
                            <span className={`font-medium ${schedule[day] ? 'text-slate-900' : 'text-slate-400'}`}>{day}</span>
                        </div>

                        {schedule[day] ? (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <select className="border rounded-md px-2 py-1 text-sm bg-slate-50">
                                        <option>9:00 AM</option>
                                        <option>10:00 AM</option>
                                    </select>
                                    <span className="text-slate-400">-</span>
                                    <select className="border rounded-md px-2 py-1 text-sm bg-slate-50">
                                        <option>5:00 PM</option>
                                        <option>6:00 PM</option>
                                    </select>
                                </div>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Plus size={16} /></Button>
                            </div>
                        ) : (
                            <span className="text-sm text-slate-400 italic">Unavailable</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
