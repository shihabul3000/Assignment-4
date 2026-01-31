"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/features/admin/services/admin.service";
import { Button } from "@/components/ui/Button";
import { User, Loader2, ShieldAlert, ShieldCheck, Trash2 } from "lucide-react";
import { User as AuthUser } from "@/features/auth/types";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<AuthUser[]>([]);

    const [loading, setLoading] = useState(true);
    const [actionId, setActionId] = useState<string | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    const fetchUsers = async () => {
        try {
            const response = await adminService.getUsers();
            setUsers(response.data.users);
        } catch {
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
        } catch {
            toast.error("Failed to update user status");
        } finally {
            setActionId(null);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        setActionId(userId);
        try {
            await adminService.deleteUser(userId);
            toast.success("User deleted successfully");
            setDeleteConfirmId(null);
            fetchUsers();
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err?.response?.data?.message || "Failed to delete user");
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
                                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A"}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {u.role !== 'ADMIN' && (
                                        <div className="flex items-center gap-2 justify-end">
                                            <Button
                                                variant={u.status === 'ACTIVE' ? "outline" : "secondary"}
                                                size="sm"
                                                className="h-8 text-[11px] font-bold"
                                                onClick={() => toggleUserStatus(u.id, u.status || 'ACTIVE')}
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
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 text-[11px] font-bold text-red-600 hover:bg-red-50 hover:text-red-700"
                                                onClick={() => setDeleteConfirmId(u.id)}
                                                disabled={actionId === u.id}
                                            >
                                                <Trash2 size={12} className="mr-1" />
                                                Delete
                                            </Button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirmId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Delete User</h3>
                        <p className="text-slate-600 mb-6">
                            Are you sure you want to delete this user? This action cannot be undone.
                            All associated data (bookings, reviews, tutor profile) will also be deleted.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <Button
                                variant="outline"
                                onClick={() => setDeleteConfirmId(null)}
                                disabled={actionId === deleteConfirmId}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="secondary"
                                className="bg-red-600 text-white hover:bg-red-700"
                                onClick={() => handleDeleteUser(deleteConfirmId)}
                                disabled={actionId === deleteConfirmId}
                            >
                                {actionId === deleteConfirmId ? (
                                    <Loader2 size={16} className="animate-spin mr-2" />
                                ) : null}
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
