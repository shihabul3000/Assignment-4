"use client";

import { Button } from "@/components/ui/Button";
import { User, MoreVertical } from "lucide-react";

export default function AdminUsersPage() {
    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold font-heading text-slate-900">User Management</h1>
                <Button>Add User</Button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-slate-900 font-medium">
                        <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Joined</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <tr key={i} className="hover:bg-slate-50">
                                <td className="px-6 py-4 flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
                                        <User size={14} />
                                    </div>
                                    <span className="font-medium text-slate-900">User {i}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${i % 2 === 0 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>
                                        {i % 2 === 0 ? 'TUTOR' : 'STUDENT'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                        ACTIVE
                                    </span>
                                </td>
                                <td className="px-6 py-4">Oct {10 + i}, 2023</td>
                                <td className="px-6 py-4">
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <MoreVertical size={16} />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
