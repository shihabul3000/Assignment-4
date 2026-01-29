"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import { User, Mail, BookOpen, DollarSign } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { tutorService } from "@/features/tutor/services/tutor.service";

export default function TutorProfileEditPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: user?.name || "",
        bio: "Passionate tutor with 5 years of experience...",
        hourlyRate: 25,
        subjects: "Mathematics, Calculus"
    });

    const handleSaveChanges = async () => {
        try {
            await tutorService.updateProfile(formData);
            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error("Failed to update profile");
        }
    };

    const handleViewPublicProfile = () => {
        router.push(`/tutors/${user?.id}`);
    };

    return (
        <div className="p-8 max-w-3xl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold font-heading text-slate-900">Tutor Profile</h1>
                <Button variant="outline" onClick={handleViewPublicProfile}>View Public Profile</Button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm space-y-8">
                {/* Basic Info */}
                <section className="space-y-4">
                    <h2 className="text-lg font-bold text-slate-900 border-b pb-2">Basic Information</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    className="pl-10"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input defaultValue={user?.email} disabled className="pl-10 bg-slate-50" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Professional Info */}
                <section className="space-y-4">
                    <h2 className="text-lg font-bold text-slate-900 border-b pb-2">Professional Details</h2>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Bio</label>
                        <textarea
                            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Tell students about your experience..."
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Hourly Rate ($)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    type="number"
                                    className="pl-10"
                                    value={formData.hourlyRate}
                                    onChange={(e) => setFormData({ ...formData, hourlyRate: Number(e.target.value) })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Subjects</label>
                            <div className="relative">
                                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    className="pl-10"
                                    value={formData.subjects}
                                    onChange={(e) => setFormData({ ...formData, subjects: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <div className="pt-4">
                    <Button onClick={handleSaveChanges}>Save Changes</Button>
                </div>
            </div>
        </div>
    );
}
