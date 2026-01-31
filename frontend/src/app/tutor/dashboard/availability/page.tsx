"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { tutorService } from "@/features/tutors/services/tutor.service";
import { Availability } from "@/features/tutors/types";

const DAYS = ['SATURDAY', 'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
const DAY_LABELS: Record<string, string> = {
    'SATURDAY': 'Saturday',
    'SUNDAY': 'Sunday',
    'MONDAY': 'Monday',
    'TUESDAY': 'Tuesday',
    'WEDNESDAY': 'Wednesday',
    'THURSDAY': 'Thursday',
    'FRIDAY': 'Friday'
};

const TIME_SLOTS = [
    "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM",
    "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM"
];

export default function AvailabilityPage() {
    const [availabilities, setAvailabilities] = useState<Availability[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchAvailability = async () => {
            setLoading(true);
            try {
                const profile = await tutorService.getOwnProfile();
                if (profile?.availabilities && Array.isArray(profile.availabilities)) {
                    setAvailabilities(profile.availabilities);
                }
            } catch {
                toast.error("Failed to load availability");
            } finally {
                setLoading(false);
            }
        };
        fetchAvailability();
    }, []);

    const toggleDay = (day: string) => {
        const exists = availabilities.some(a => a.dayOfWeek.toUpperCase() === day.toUpperCase());
        if (exists) {
            setAvailabilities(prev => prev.filter(a => a.dayOfWeek.toUpperCase() !== day.toUpperCase()));
        } else {
            setAvailabilities(prev => [
                ...prev,
                { dayOfWeek: day.toUpperCase(), startTime: "09:00 AM", endTime: "05:00 PM" }
            ]);
        }
    };

    const updateTime = (day: string, type: 'start' | 'end', value: string) => {
        setAvailabilities(prev => prev.map(a =>
            a.dayOfWeek.toUpperCase() === day.toUpperCase()
                ? { ...a, [type === 'start' ? 'startTime' : 'endTime']: value }
                : a
        ));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const success = await tutorService.updateAvailability(availabilities);
            if (success) {
                toast.success("Availability updated successfully");
            } else {
                toast.error("Failed to update availability");
            }
        } catch {
            toast.error("An error occurred");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold font-heading text-slate-900">Manage Availability</h1>
                    <p className="text-slate-500">Set the days and times you are available for sessions.</p>
                </div>
                <Button onClick={handleSave} disabled={saving} className="min-w-[120px]">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Save Changes
                </Button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100">
                {DAYS.map(day => {
                    const availability = availabilities.find(a => a.dayOfWeek.toUpperCase() === day.toUpperCase());
                    const isActive = !!availability;

                    return (
                        <div key={day} className="p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div
                                    onClick={() => toggleDay(day)}
                                    className={`w-12 h-6 rounded-full cursor-pointer transition-colors relative ${isActive ? 'bg-primary' : 'bg-slate-200'}`}
                                >
                                    <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${isActive ? 'translate-x-6' : ''}`}></div>
                                </div>
                                <span className={`font-medium min-w-[100px] ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                                    {DAY_LABELS[day]}
                                </span>
                            </div>

                            {isActive ? (
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <select
                                            value={availability.startTime}
                                            onChange={(e) => updateTime(day, 'start', e.target.value)}
                                            className="border rounded-md px-2 py-1 text-sm bg-slate-50 focus:ring-2 focus:ring-primary/20 outline-none"
                                        >
                                            {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                        <span className="text-slate-400">-</span>
                                        <select
                                            value={availability.endTime}
                                            onChange={(e) => updateTime(day, 'end', e.target.value)}
                                            className="border rounded-md px-2 py-1 text-sm bg-slate-50 focus:ring-2 focus:ring-primary/20 outline-none"
                                        >
                                            {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                </div>
                            ) : (
                                <span className="text-sm text-slate-400 italic">Unavailable</span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
