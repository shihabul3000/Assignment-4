"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { User, Mail } from "lucide-react";

export default function StudentProfilePage() {
    const { user } = useAuth();

    return (
        <div className="p-8 max-w-3xl">
            <h1 className="text-2xl font-bold font-heading text-slate-900 mb-8">My Profile</h1>

            <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                <div className="flex items-center gap-6 mb-8">
                    <div className="h-24 w-24 rounded-full bg-slate-100 flex items-center justify-center text-3xl font-bold text-slate-400">
                        {user?.name.charAt(0)}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
                        <p className="text-slate-500 capitalize">{user?.role.toLowerCase()}</p>
                    </div>
                </div>

                <form className="space-y-6 max-w-lg">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input defaultValue={user?.name} className="pl-10" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input defaultValue={user?.email} disabled className="pl-10 bg-slate-50" />
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button>Save Changes</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
