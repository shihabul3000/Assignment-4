"use client";

import { useState, useEffect } from "react";
import { tutorService } from "@/features/tutors/services/tutor.service";
import { TutorProfile } from "@/features/tutors/types";
import TutorCard from "@/features/tutors/components/TutorCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Search } from "lucide-react";

export default function TutorsPage() {
    const [tutors, setTutors] = useState<TutorProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [query, setQuery] = useState("");

    useEffect(() => {
        const fetchTutors = async () => {
            setLoading(true);
            const data = await tutorService.getAll({ query });
            setTutors(data);
            setLoading(false);
        };
        fetchTutors();
    }, [query]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setQuery(search);
    };

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 py-12">
                <div className="container px-4 md:px-6">
                    <h1 className="text-3xl font-bold font-heading text-slate-900 mb-4">Find Your Perfect Tutor</h1>
                    <p className="text-slate-600 max-w-2xl mb-8">
                        Browse through our list of expert tutors. Filter by subject, price, or name.
                    </p>

                    <form onSubmit={handleSearch} className="flex gap-2 max-w-xl">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                            <Input
                                placeholder="Search by name or subject (e.g. 'Math')"
                                className="pl-10"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <Button type="submit">Search</Button>
                    </form>
                </div>
            </div>

            {/* List */}
            <div className="container px-4 md:px-6 py-12">
                {loading ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-[300px] rounded-xl bg-white border border-slate-200 animate-pulse"></div>
                        ))}
                    </div>
                ) : tutors.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {tutors.map(tutor => (
                            <TutorCard key={tutor.id} tutor={tutor} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <h3 className="text-xl font-bold text-slate-900">No tutors found</h3>
                        <p className="text-slate-500">Try adjusting your search terms.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
