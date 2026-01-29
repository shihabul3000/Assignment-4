"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/features/admin/services/admin.service";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loader2, Plus, Tag, FileText } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: "", description: "" });

    const fetchCategories = async () => {
        try {
            const response = await adminService.getCategories();
            setCategories(response.data.categories);
        } catch (error) {
            toast.error("Failed to fetch categories");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategory.name) return toast.error("Name is required");

        setIsAdding(true);
        try {
            await adminService.createCategory(newCategory);
            toast.success("Category created successfully");
            setNewCategory({ name: "", description: "" });
            fetchCategories();
        } catch (error) {
            toast.error("Failed to create category");
        } finally {
            setIsAdding(false);
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
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold font-heading text-slate-900">Manage Categories</h1>
                <div className="text-sm text-slate-500">{categories.length} Categories</div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Column */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm sticky top-8">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Plus size={18} className="text-primary" /> Add New Category
                        </h3>
                        <form onSubmit={handleAddCategory} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Category Name</label>
                                <div className="relative">
                                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        className="pl-10 text-sm"
                                        placeholder="e.g. Data Science"
                                        value={newCategory.name}
                                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Description (Optional)</label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                    <textarea
                                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="Brief summary..."
                                        value={newCategory.description}
                                        onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full" disabled={isAdding}>
                                {isAdding && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                                Create Category
                            </Button>
                        </form>
                    </div>
                </div>

                {/* List Column */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="grid grid-cols-1 divide-y divide-slate-100">
                            {categories.map((cat) => (
                                <div key={cat.id} className="p-4 hover:bg-slate-50 flex justify-between items-center group">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                            <Tag size={18} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900">{cat.name}</h4>
                                            <p className="text-xs text-slate-500 line-clamp-1">{cat.description || "No description set."}</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold">
                                        {new Date(cat.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            ))}
                            {categories.length === 0 && (
                                <div className="p-12 text-center text-slate-400 italic">
                                    No categories added yet.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
