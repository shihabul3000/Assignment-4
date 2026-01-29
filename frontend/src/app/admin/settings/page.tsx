"use client";

import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
    User,
    Lock,
    Globe,
    Bell,
    ShieldCheck,
    Save,
    AlertTriangle,
    CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

export default function AdminSettingsPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    // Profile State
    const [profile, setProfile] = useState({
        name: user?.name || "Admin User",
        email: user?.email || "admin@skillbridge.com"
    });

    // Platform State (Simulated)
    const [platformConfig, setPlatformConfig] = useState({
        maintenanceMode: false,
        platformFee: 10,
        emailNotifications: true,
        autoApproveTutors: false
    });

    const handleUpdateProfile = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            toast.success("Admin profile updated successfully");
            setLoading(false);
        }, 800);
    };

    const handleUpdatePlatform = () => {
        setLoading(true);
        setTimeout(() => {
            toast.success("Platform configurations saved");
            setLoading(false);
        }, 800);
    };

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-10 pb-20">
            <div>
                <h1 className="text-3xl font-bold font-heading text-slate-900">Admin Settings</h1>
                <p className="text-slate-500 mt-1">Manage your administrator account and global platform preferences.</p>
            </div>

            {/* Profile Section */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                    <div className="p-2 bg-blue-500 text-white rounded-lg">
                        <User size={20} />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">Administrator Profile</h2>
                </div>
                <div className="p-8">
                    <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Full Name</label>
                            <input
                                type="text"
                                value={profile.name}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Email Address</label>
                            <input
                                type="email"
                                value={profile.email}
                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            />
                        </div>
                        <div className="md:col-span-2 flex justify-end">
                            <Button type="submit" disabled={loading} className="gap-2">
                                {loading ? "Saving..." : "Update Profile"}
                                <Save size={16} />
                            </Button>
                        </div>
                    </form>
                </div>
            </section>

            {/* Platform Configuration */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                    <div className="p-2 bg-indigo-500 text-white rounded-lg">
                        <Globe size={20} />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">Platform Controls</h2>
                </div>
                <div className="p-8 space-y-8">
                    <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-100">
                        <div className="flex gap-4">
                            <AlertTriangle className="text-amber-600 shrink-0" />
                            <div>
                                <h4 className="text-sm font-bold text-amber-900 font-heading">Maintenance Mode</h4>
                                <p className="text-xs text-amber-700 mt-0.5">When active, students and tutors cannot access their dashboards.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setPlatformConfig({ ...platformConfig, maintenanceMode: !platformConfig.maintenanceMode })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${platformConfig.maintenanceMode ? 'bg-amber-600' : 'bg-slate-200'}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${platformConfig.maintenanceMode ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <CreditCard size={18} className="text-slate-400" />
                                <label className="text-sm font-bold text-slate-700">Platform Service Fee (%)</label>
                            </div>
                            <div className="flex items-center gap-4">
                                <input
                                    type="number"
                                    value={platformConfig.platformFee}
                                    onChange={(e) => setPlatformConfig({ ...platformConfig, platformFee: parseInt(e.target.value) })}
                                    className="w-24 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-bold"
                                />
                                <span className="text-sm text-slate-500">Collected from every successful booking.</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Bell size={18} className="text-slate-400" />
                                <label className="text-sm font-bold text-slate-700">System Notifications</label>
                            </div>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={platformConfig.emailNotifications}
                                        onChange={(e) => setPlatformConfig({ ...platformConfig, emailNotifications: e.target.checked })}
                                        className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                                    />
                                    <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">Notify admin on new tutor registrations</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={platformConfig.autoApproveTutors}
                                        onChange={(e) => setPlatformConfig({ ...platformConfig, autoApproveTutors: e.target.checked })}
                                        className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                                    />
                                    <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">Automatically approve new tutor profiles</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex justify-end">
                        <Button onClick={handleUpdatePlatform} disabled={loading}>
                            {loading ? "Saving Changes..." : "Save Platform Configuration"}
                        </Button>
                    </div>
                </div>
            </section>

            {/* Security Section */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                    <div className="p-2 bg-slate-900 text-white rounded-lg">
                        <Lock size={20} />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">Security & Authentication</h2>
                </div>
                <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <p className="text-sm text-slate-600">Update your account password regularly to keep your admin access secure.</p>
                        </div>
                        <Button variant="outline" className="gap-2 border-slate-200">
                            Change Password
                            <ShieldCheck size={16} />
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
