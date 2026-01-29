import { TutorProfile } from "../types";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Star, User } from "lucide-react";

interface TutorCardProps {
    tutor: TutorProfile;
}

export default function TutorCard({ tutor }: TutorCardProps) {
    return (
        <div className="group flex flex-col justify-between overflow-hidden rounded-xl bg-white border border-slate-200 p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/40">
            <div>
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                            {/* Initials or Icon */}
                            <span className="font-bold text-lg">{tutor.user.name.charAt(0)}</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{tutor.user.name}</h3>
                            <div className="flex items-center text-xs text-slate-500 gap-2">
                                <span className="flex items-center gap-0.5 text-yellow-600 font-medium">
                                    <Star size={12} fill="currentColor" /> {tutor.averageRating}
                                </span>
                                <span>({tutor.totalReviews} reviews)</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="block font-bold text-lg text-slate-900">{tutor.hourlyRate} BDT</span>
                        <span className="text-xs text-slate-500">/hr</span>
                    </div>
                </div>

                <div className="mb-4">
                    <div className="flex flex-wrap gap-2 mb-3">
                        {tutor.subjects.slice(0, 3).map((sub, i) => (
                            <span key={i} className="px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                                {sub}
                            </span>
                        ))}
                        {tutor.subjects.length > 3 && (
                            <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-500 text-xs font-medium">
                                +{tutor.subjects.length - 3}
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-3">
                        {tutor.bio}
                    </p>
                </div>
            </div>

            <div className="pt-4 mt-auto border-t border-slate-100 flex gap-3">
                <Link href={`/tutors/${tutor.id}`} className="w-full">
                    <Button variant="outline" className="w-full">View Profile</Button>
                </Link>
                <Link href={`/tutors/${tutor.id}?book=true`} className="w-full">
                    <Button className="w-full">Book Now</Button>
                </Link>
            </div>
        </div>
    );
}
