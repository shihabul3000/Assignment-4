"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/features/admin/services/admin.service";
import { Button } from "@/components/ui/Button";
import { User, MoreVertical, Loader2, ShieldAlert, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionId, setActionId] = useState<string | null>(null);

    const fetchUsers = async () => {
        try {
            const response = await adminService.getUsers();
            setUsers(response.data.users);
        } catch (error) {
            toast.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const toggleUserStatus = async (userId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'ACTIVE' ? 'BANNED' : 'ACTIVE';
        setActionId(userId);
        try {
            await adminService.updateUser(userId, { status: newStatus });
            toast.success(`User ${newStatus.toLowerCase()} successfully`);
            fetchUsers();
        } catch (error) {
            toast.error("Failed to update user status");
        } finally {
            setActionId(null);
        }
    };

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[50vh]">
                <Loader2 className="animate-spin text-primary h-8 w-8" />
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold font-heading text-slate-900">User Management</h1>
                <div className="text-sm text-slate-500">{users.length} Total Users</div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-slate-900 font-medium">
                        <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Joined</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {users.map((u) => (
                            <tr key={u.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                            <User size={14} />
                                        </div>
                                        <div>
                                            <div className="font-medium text-slate-900">{u.name}</div>
                                            <div className="text-[11px] text-slate-500">{u.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                                        u.role === 'TUTOR' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                                        }`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${u.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {u.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-xs">
                                    {new Date(u.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {u.role !== 'ADMIN' && (
                                        <Button
                                            variant={u.status === 'ACTIVE' ? "outline" : "secondary"}
                                            size="sm"
                                            className="h-8 text-[11px] font-bold"
                                            onClick={() => toggleUserStatus(u.id, u.status)}
                                            disabled={actionId === u.id}
                                        >
                                            {actionId === u.id ? (
                                                <Loader2 size={12} className="animate-spin mr-1" />
                                            ) : u.status === 'ACTIVE' ? (
                                                <ShieldAlert size={12} className="mr-1" />
                                            ) : (
                                                <ShieldCheck size={12} className="mr-1" />
                                            )}
                                            {u.status === 'ACTIVE' ? 'Ban' : 'Unban'}
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
