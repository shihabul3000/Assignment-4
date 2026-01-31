"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import { User, Mail, BookOpen, Banknote, Loader2, AlertCircle, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { tutorService } from "@/features/tutors/services/tutor.service";
import { userService } from "@/features/auth/services/user.service";

export default function TutorProfileEditPage() {
    const { user, updateUser, logout } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || "",
        bio: "",
        hourlyRate: 0,
        subjects: ""
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await tutorService.getMyProfile() as { data?: { tutorProfile?: { user?: { name?: string }, bio?: string, hourlyRate?: number, subjects?: string[] } } };
                const profile = response.data?.tutorProfile;

                if (profile) {
                    setFormData({
                        name: profile.user?.name || user?.name || "",
                        bio: profile.bio || "",
                        hourlyRate: profile.hourlyRate || 0,
                        subjects: Array.isArray(profile.subjects) ? profile.subjects.join(", ") : ""
                    });
                }
            } catch (error) {
                console.error("Failed to fetch tutor profile", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchProfile();
        }
    }, [user]);

    const handleSaveChanges = async () => {
        setIsSaving(true);
        try {
            await tutorService.updateProfile(formData);
            updateUser({ name: formData.name });
            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error("Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!confirmDelete) {
            setConfirmDelete(true);
            toast.error("Please click again to confirm permanent deletion");
            return;
        }

        setIsDeleting(true);
        try {
            await userService.deleteAccount();
            toast.success("Your account has been permanently deleted");
            logout();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to delete account");
            setIsDeleting(false);
            setConfirmDelete(false);
        }
    };

    const handleViewPublicProfile = () => {
        router.push(`/tutors/${user?.id}`);
    };

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[50vh]">
                <Loader2 className="animate-spin text-primary h-8 w-8" />
            </div>
        );
    }

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
                            <label className="text-sm font-medium text-slate-700">Email Address (Read-only)</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input defaultValue={user?.email} disabled className="pl-10 bg-slate-50 text-slate-500" />
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
                            className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Tell students about your experience, expertise, and teaching style..."
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Hourly Rate (BDT)</label>
                            <div className="relative">
                                <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    type="number"
                                    className="pl-10"
                                    value={formData.hourlyRate}
                                    onChange={(e) => setFormData({ ...formData, hourlyRate: Number(e.target.value) })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Subjects (Comma separated)</label>
                            <div className="relative">
                                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    className="pl-10"
                                    placeholder="Math, Calculus, Algebra"
                                    value={formData.subjects}
                                    onChange={(e) => setFormData({ ...formData, subjects: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <Button onClick={handleSaveChanges} disabled={isSaving}>
                        {isSaving && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                        Save Changes
                    </Button>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="mt-8 bg-red-50 rounded-xl border border-red-100 p-8 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-red-600">
                            <AlertCircle size={20} />
                            <h2 className="text-lg font-bold">Danger Zone</h2>
                        </div>
                        <p className="text-sm text-red-700 max-w-md">
                            Permanently delete your account, your tutor profile, and all associated data. This action cannot be undone.
                        </p>
                    </div>
                    <Button
                        onClick={handleDeleteAccount}
                        disabled={isDeleting}
                        variant={confirmDelete ? "destructive" : "outline"}
                        className={confirmDelete ? "" : "border-red-200 text-red-600 hover:bg-red-100"}
                    >
                        {isDeleting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Trash2 className="mr-2 h-4 w-4" />}
                        {confirmDelete ? "Confirm Deletion" : "Delete My Account"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
