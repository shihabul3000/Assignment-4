"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { bookingService } from "@/features/bookings/services/booking.service";
import { tutorService } from "@/features/tutors/services/tutor.service";
import { TutorProfile } from "@/features/tutors/types";
import { Loader2, Calendar, Clock, DollarSign, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

interface BookingFormValues {
    date: string;
    time: string;
    duration: number; // in hours
}

export default function CreateBookingPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tutorId = searchParams.get('tutorId');

    const [tutor, setTutor] = useState<TutorProfile | null>(null);
    const [isLoadingTutor, setIsLoadingTutor] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, watch, formState: { errors } } = useForm<BookingFormValues>({
        defaultValues: {
            duration: 1
        }
    });

    const duration = watch('duration');

    useEffect(() => {
        if (!tutorId) {
            router.push('/tutors');
            return;
        }
        const fetchTutor = async () => {
            const data = await tutorService.getById(tutorId);
            if (!data) {
                toast.error("Tutor not found");
                router.push('/tutors');
            } else {
                setTutor(data);
            }
            setIsLoadingTutor(false);
        };
        fetchTutor();
    }, [tutorId, router]);

    const onSubmit = async (data: BookingFormValues) => {
        if (!tutor) return;
        setIsSubmitting(true);

        try {
            // Construct ISO dates
            const startDateTime = new Date(`${data.date}T${data.time}`);

            const result = await bookingService.createBooking({
                tutorId: tutor.userId, // Backend expects User ID, not Profile ID
                dateTime: startDateTime.toISOString(),
                duration: data.duration,
                paymentMethod: 'COD',
                paymentStatus: 'PENDING'
            });

            if (result.success) {
                toast.success("Booking Request Sent!");
                router.push('/dashboard/bookings');
            } else {
                toast.error(result.message || "Booking failed");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoadingTutor) {
        return <div className="flex justify-center py-20"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
    }

    if (!tutor) return null;

    const totalCost = tutor.hourlyRate * duration;

    return (
        <div className="container px-4 py-12 max-w-2xl">
            <h1 className="text-3xl font-bold font-heading mb-8">Book a Session</h1>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8">
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-100">
                    <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center text-xl font-bold">
                        {tutor.user.name.charAt(0)}
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Booking with</p>
                        <h2 className="text-xl font-bold text-slate-900">{tutor.user.name}</h2>
                        <p className="text-sm text-primary font-medium">{tutor.subjects.join(', ')}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="date"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    min={new Date().toISOString().split('T')[0]}
                                    {...register("date", { required: "Date is required" })}
                                />
                            </div>
                            {errors.date && <p className="text-xs text-red-500">{errors.date.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Time</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="time"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    {...register("time", { required: "Time is required" })}
                                />
                            </div>
                            {errors.time && <p className="text-xs text-red-500">{errors.time.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Duration (Hours)</label>
                        <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...register("duration", { valueAsNumber: true })}
                        >
                            <option value={1}>1 Hour</option>
                            <option value={1.5}>1.5 Hours</option>
                            <option value={2}>2 Hours</option>
                        </select>
                    </div>

                    {/* Payment Summary */}
                    <div className="bg-slate-50 p-4 rounded-lg space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Hourly Rate</span>
                            <span className="font-medium">${tutor.hourlyRate}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Total Duration</span>
                            <span className="font-medium">{duration} hrs</span>
                        </div>
                        <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
                            <span className="font-bold text-slate-900">Total to Pay</span>
                            <span className="text-2xl font-bold text-primary">${totalCost}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-3 rounded border border-green-100 mt-2">
                            <CheckCircle size={16} />
                            <span>Payment Method: <strong>Cash on Delivery (COD)</strong></span>
                        </div>
                        <p className="text-xs text-slate-500 px-1">
                            You will pay the tutor directly in cash after the session is completed. No online payment required.
                        </p>
                    </div>

                    <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
                        Confirm Booking
                    </Button>
                </form>
            </div>
        </div>
    );
}
