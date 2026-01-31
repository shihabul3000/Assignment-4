"use client";

import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { userService } from "@/features/auth/services/user.service";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { User, Mail, Lock, ShieldCheck, Loader2, AlertCircle, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function StudentSettingsPage() {
    const { user, updateUser } = useAuth();

    // Profile State
    const [name, setName] = useState(user?.name || "");
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

    // Security State
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const { logout } = useAuth();

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) return toast.error("Name is required");

        setIsUpdatingProfile(true);
        try {
            await userService.updateProfile({ name });
            updateUser({ name });
            toast.success("Profile updated successfully!");
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || "Failed to update profile");
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentPassword || !newPassword || !confirmPassword) {
            return toast.error("All password fields are required");
        }
        if (newPassword !== confirmPassword) {
            return toast.error("New passwords do not match");
        }
        if (newPassword.length < 6) {
            return toast.error("New password must be at least 6 characters");
        }

        setIsUpdatingPassword(true);
        try {
            await userService.changePassword({ currentPassword, newPassword });
            toast.success("Password changed successfully!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || "Failed to change password");
        } finally {
            setIsUpdatingPassword(false);
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
            logout(); // This will clear session and redirect
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || "Failed to delete account");
            setIsDeleting(false);
            setConfirmDelete(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold font-heading text-slate-900">Account Settings</h1>
                <p className="text-slate-500">Manage your profile and security preferences.</p>
            </div>

            <div className="space-y-12">
                {/* Profile Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="space-y-2">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2 text-lg">
                            <User size={20} className="text-primary" /> Profile Settings
                        </h3>
                        <p className="text-sm text-slate-500">Update your public name and view your account details.</p>
                    </div>
                    <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="pl-10"
                                        placeholder="Your full name"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Email Address (Read-only)</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input value={user?.email} disabled className="pl-10 bg-slate-50 text-slate-500" />
                                </div>
                                <p className="text-[11px] text-slate-400 italic">Contact support to change your email.</p>
                            </div>

                            <div className="pt-2">
                                <Button type="submit" disabled={isUpdatingProfile} className="bg-primary hover:bg-primary/90">
                                    {isUpdatingProfile ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Security Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start pt-8 border-t border-slate-100">
                    <div className="space-y-2">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2 text-lg">
                            <ShieldCheck size={20} className="text-primary" /> Security
                        </h3>
                        <p className="text-sm text-slate-500">Keep your account secure by using a strong password.</p>
                    </div>
                    <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Current Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="pl-10"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">New Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="pl-10"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Confirm New Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="pl-10"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2">
                                <Button type="submit" variant="secondary" disabled={isUpdatingPassword} className="font-bold">
                                    {isUpdatingPassword ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                                    Update Password
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Danger Zone Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start pt-8 border-t border-slate-100">
                    <div className="space-y-2">
                        <h3 className="font-bold text-red-600 flex items-center gap-2 text-lg">
                            <AlertCircle size={20} /> Danger Zone
                        </h3>
                        <p className="text-sm text-slate-500">Permanently remove your account and all associated data.</p>
                    </div>
                    <div className="lg:col-span-2 bg-red-50 rounded-xl border border-red-100 shadow-sm p-6 overflow-hidden relative">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-1">
                                <h4 className="font-bold text-red-900">Delete Account</h4>
                                <p className="text-sm text-red-700">Once you delete your account, there is no going back. Please be certain.</p>
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
            </div>
        </div>
    );
}
