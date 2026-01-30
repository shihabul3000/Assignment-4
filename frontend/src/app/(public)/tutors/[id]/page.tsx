"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { tutorService } from "@/features/tutors/services/tutor.service";
import { TutorProfile } from "@/features/tutors/types";
import { Button } from "@/components/ui/Button";
import { Star, Clock, Banknote, BookOpen, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/features/auth/hooks/useAuth";
import toast from "react-hot-toast";

export default function TutorProfilePage() {
    const params = useParams();
    const router = useRouter();
    const { isAuthenticated, user } = useAuth();
    const [tutor, setTutor] = useState<TutorProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            const fetchTutor = async () => {
                setLoading(true);
                const data = await tutorService.getById(params.id as string);
                setTutor(data);
                setLoading(false);
            };
            fetchTutor();
        }
    }, [params.id]);

    const handleBookNow = () => {
        if (!isAuthenticated) {
            toast.error("Please login to book a session");
            router.push(`/login?redirect=/tutors/${params.id}`);
            return;
        }
        if (user?.role === 'TUTOR') {
            toast.error("Tutors cannot book sessions with other tutors");
            return;
        }
        // Redirect to booking page/modal (To be implemented)
        router.push(`/bookings/new?tutorId=${params.id}`);
    };

    if (loading) {
        return (
            <div className="container px-4 py-12 animate-pulse space-y-8">
                <div className="h-8 w-32 bg-slate-200 rounded"></div>
                <div className="h-64 bg-slate-200 rounded-xl"></div>
            </div>
        );
    }

    if (!tutor) {
        return (
            <div className="container px-4 py-20 text-center">
                <h2 className="text-2xl font-bold text-slate-900">Tutor not found</h2>
                <Link href="/tutors" className="text-primary hover:underline mt-4 block">Back to Tutors</Link>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            <div className="bg-white border-b border-slate-200">
                <div className="container px-4 py-8">
                    <Link href="/tutors" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-6">
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Back to Tutors
                    </Link>

                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Avatar */}
                        <div className="h-32 w-32 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 flex-shrink-0 text-4xl font-bold border-4 border-white shadow-lg">
                            {tutor.user.name.charAt(0)}
                        </div>

                        <div className="flex-1">
                            <h1 className="text-3xl font-bold font-heading text-slate-900">{tutor.user.name}</h1>
                            <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                                <div className="flex items-center gap-1 text-yellow-600 font-bold bg-yellow-50 px-2 py-0.5 rounded-full">
                                    <Star size={14} fill="currentColor" /> {tutor.averageRating} ({tutor.totalReviews} reviews)
                                </div>
                                <div className="flex items-center gap-1">
                                    <Banknote size={14} /> {tutor.hourlyRate} BDT/hr
                                </div>
                            </div>

                            <div className="mt-6 flex flex-wrap gap-2">
                                {tutor.subjects.map((sub, i) => (
                                    <span key={i} className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100">
                                        {sub}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="w-full md:w-auto p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-sm md:min-w-[300px]">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-slate-500">Hourly Rate</span>
                                <span className="text-2xl font-bold text-slate-900">{tutor.hourlyRate} BDT</span>
                            </div>
                            <Button size="lg" className="w-full" onClick={handleBookNow}>
                                Book Session (COD)
                            </Button>
                            <p className="text-xs text-center text-slate-500 mt-3">
                                Pay cash directly to the tutor after the session.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container px-4 py-12">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-8">
                        {/* About */}
                        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h2 className="text-xl font-bold font-heading mb-4 flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-primary" />
                                About Me
                            </h2>
                            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                                {tutor.bio}
                            </p>
                        </section>

                        {/* Reviews (Placeholder) */}
                        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h2 className="text-xl font-bold font-heading mb-4 flex items-center gap-2">
                                <Star className="h-5 w-5 text-primary" />
                                Student Reviews
                            </h2>
                            <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                                No reviews yet. Be the first to book!
                            </div>
                        </section>
                    </div>

                    <div className="space-y-6">
                        {/* Availability */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Clock className="h-4 w-4 text-primary" />
                                Availability
                            </h3>
                            <div className="space-y-3">
                                {tutor.availabilities && tutor.availabilities.length > 0 ? (
                                    [...tutor.availabilities]
                                        .sort((a, b) => {
                                            const order = ['SATURDAY', 'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
                                            return order.indexOf(a.dayOfWeek) - order.indexOf(b.dayOfWeek);
                                        })
                                        .map((avail, i) => (
                                            <div key={i} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-sm py-2 border-b border-slate-50 last:border-0">
                                                <span className="text-slate-600 font-medium whitespace-nowrap">
                                                    {avail.dayOfWeek.charAt(0) + avail.dayOfWeek.slice(1).toLowerCase()}
                                                </span>
                                                <span className="text-slate-500 whitespace-nowrap">
                                                    {avail.startTime} - {avail.endTime}
                                                </span>
                                            </div>
                                        ))
                                ) : (
                                    <div className="text-sm text-slate-500 italic">
                                        No specific hours set. Contact tutor for details.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
