"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { tutorService } from "@/features/tutors/services/tutor.service";
import { TutorProfile, PaginatedTutorsResponse } from "@/features/tutors/types";
import TutorCard from "@/features/tutors/components/TutorCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Search, Filter, ChevronLeft, ChevronRight, Star, X, Loader2 } from "lucide-react";

const ITEMS_PER_PAGE_OPTIONS = [6, 12, 24];

const SORT_OPTIONS = [
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "rating_desc", label: "Rating: High to Low" },
    { value: "name_asc", label: "Name: A-Z" },
];

const RATING_OPTIONS = [
    { value: "", label: "Any Rating" },
    { value: "4", label: "4+ Stars" },
    { value: "3", label: "3+ Stars" },
    { value: "2", label: "2+ Stars" },
];

function TutorsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // State
    const [tutors, setTutors] = useState<TutorProfile[]>([]);
    const [pagination, setPagination] = useState<PaginatedTutorsResponse["pagination"]>({
        total: 0,
        page: 1,
        limit: 12,
        totalPages: 0,
    });
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<string[]>([]);
    const [showFilters, setShowFilters] = useState(false);

    // Filter states
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [category, setCategory] = useState(searchParams.get("category") || "");
    const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
    const [minRating, setMinRating] = useState(searchParams.get("minRating") || "");
    const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "");
    const [page, setPage] = useState<number>(parseInt(searchParams.get("page") || "1"));
    const [limit, setLimit] = useState<number>(parseInt(searchParams.get("limit") || "12"));

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            const cats = await tutorService.getCategories();
            setCategories(cats);
        };
        fetchCategories();
    }, []);

    // Build query params and fetch tutors
    const fetchTutors = useCallback(async () => {
        setLoading(true);

        const params: Record<string, string | number> = {};
        if (search) params.search = search;
        if (category) params.category = category;
        if (minPrice) params.minPrice = parseInt(minPrice);
        if (maxPrice) params.maxPrice = parseInt(maxPrice);
        if (minRating) params.minRating = parseInt(minRating);
        if (page) params.page = page;
        if (limit) params.limit = limit;

        // Parse sort option
        if (sortBy) {
            const [sortField, sortOrder] = sortBy.split("_");
            params.sortBy = sortField;
            params.sortOrder = sortOrder;
        }

        const data = await tutorService.getAll(params);
        setTutors(data.tutors);
        setPagination(data.pagination);
        setLoading(false);
    }, [search, category, minPrice, maxPrice, minRating, sortBy, page, limit]);

    // Fetch tutors when filters change
    useEffect(() => {
        fetchTutors();
    }, [fetchTutors]);

    // Update URL query params
    const updateUrlParams = useCallback(() => {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (category) params.set("category", category);
        if (minPrice) params.set("minPrice", minPrice);
        if (maxPrice) params.set("maxPrice", maxPrice);
        if (minRating) params.set("minRating", minRating);
        if (sortBy) params.set("sortBy", sortBy);
        if (page > 1) params.set("page", page.toString());
        if (limit !== 12) params.set("limit", limit.toString());

        const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
        router.push(newUrl, { scroll: false });
    }, [search, category, minPrice, maxPrice, minRating, sortBy, page, limit, router]);

    useEffect(() => {
        updateUrlParams();
    }, [updateUrlParams]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchTutors();
    };

    const handleApplyFilters = () => {
        setPage(1);
        fetchTutors();
        setShowFilters(false);
    };

    const handleClearFilters = () => {
        setSearch("");
        setCategory("");
        setMinPrice("");
        setMaxPrice("");
        setMinRating("");
        setSortBy("");
        setPage(1);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const hasActiveFilters = search || category || minPrice || maxPrice || minRating || sortBy;

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisiblePages = 5;

        if (pagination.totalPages <= maxVisiblePages) {
            for (let i = 1; i <= pagination.totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (page <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push("...");
                pages.push(pagination.totalPages);
            } else if (page >= pagination.totalPages - 2) {
                pages.push(1);
                pages.push("...");
                for (let i = pagination.totalPages - 3; i <= pagination.totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push("...");
                pages.push(page - 1);
                pages.push(page);
                pages.push(page + 1);
                pages.push("...");
                pages.push(pagination.totalPages);
            }
        }
        return pages;
    };

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 py-12">
                <div className="container px-4 md:px-6">
                    <h1 className="text-3xl font-bold font-heading text-slate-900 mb-4">Find Your Perfect Tutor</h1>
                    <p className="text-slate-600 max-w-2xl mb-8">
                        Browse through our list of expert tutors. Filter by subject, price, rating, or name.
                    </p>

                    {/* Search and Filter Toggle */}
                    <div className="flex flex-col sm:flex-row gap-3 max-w-3xl">
                        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                                <Input
                                    placeholder="Search by name or subject..."
                                    className="pl-10"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <Button type="submit">Search</Button>
                        </form>
                        <Button
                            variant="outline"
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2"
                        >
                            <Filter className="h-4 w-4" />
                            Filters
                            {hasActiveFilters && (
                                <span className="ml-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {[category, minPrice, maxPrice, minRating, sortBy].filter(Boolean).length}
                                </span>
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className="bg-white border-b border-slate-200 py-6">
                    <div className="container px-4 md:px-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                            {/* Category Filter */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Min Price */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Min Price (BDT)</label>
                                <Input
                                    type="number"
                                    placeholder="0"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    min="0"
                                />
                            </div>

                            {/* Max Price */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Max Price (BDT)</label>
                                <Input
                                    type="number"
                                    placeholder="1000"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    min="0"
                                />
                            </div>

                            {/* Rating Filter */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Min Rating</label>
                                <select
                                    value={minRating}
                                    onChange={(e) => setMinRating(e.target.value)}
                                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    {RATING_OPTIONS.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Sort By */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Sort By</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    <option value="">Default</option>
                                    {SORT_OPTIONS.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Filter Actions */}
                        <div className="flex gap-3 mt-4">
                            <Button onClick={handleApplyFilters}>Apply Filters</Button>
                            {hasActiveFilters && (
                                <Button variant="ghost" onClick={handleClearFilters} className="flex items-center gap-2">
                                    <X className="h-4 w-4" />
                                    Clear All
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Active Filters Display */}
            {hasActiveFilters && !showFilters && (
                <div className="bg-slate-100 border-b border-slate-200 py-3">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm text-slate-600">Active filters:</span>
                            {search && (
                                <span className="inline-flex items-center gap-1 bg-white px-2 py-1 rounded text-sm border">
                                    Search: {search}
                                    <button onClick={() => { setSearch(""); setPage(1); }} className="text-slate-400 hover:text-slate-600">
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            )}
                            {category && (
                                <span className="inline-flex items-center gap-1 bg-white px-2 py-1 rounded text-sm border">
                                    Category: {category}
                                    <button onClick={() => { setCategory(""); setPage(1); }} className="text-slate-400 hover:text-slate-600">
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            )}
                            {(minPrice || maxPrice) && (
                                <span className="inline-flex items-center gap-1 bg-white px-2 py-1 rounded text-sm border">
                                    Price: {minPrice || "0"} - {maxPrice || "∞"} BDT
                                    <button onClick={() => { setMinPrice(""); setMaxPrice(""); setPage(1); }} className="text-slate-400 hover:text-slate-600">
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            )}
                            {minRating && (
                                <span className="inline-flex items-center gap-1 bg-white px-2 py-1 rounded text-sm border">
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                    {minRating}+
                                    <button onClick={() => { setMinRating(""); setPage(1); }} className="text-slate-400 hover:text-slate-600">
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            )}
                            {sortBy && (
                                <span className="inline-flex items-center gap-1 bg-white px-2 py-1 rounded text-sm border">
                                    Sort: {SORT_OPTIONS.find(o => o.value === sortBy)?.label}
                                    <button onClick={() => { setSortBy(""); setPage(1); }} className="text-slate-400 hover:text-slate-600">
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            )}
                            <button onClick={handleClearFilters} className="text-sm text-primary hover:underline ml-auto">
                                Clear all
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Results Count */}
            <div className="container px-4 md:px-6 py-6">
                <div className="flex justify-between items-center mb-4">
                    <p className="text-slate-600">
                        {loading ? "Loading..." : `Showing ${tutors.length} of ${pagination.total} tutors`}
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600">Show:</span>
                        <select
                            value={limit}
                            onChange={(e) => { setLimit(parseInt(e.target.value)); setPage(1); }}
                            className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm"
                        >
                            {ITEMS_PER_PAGE_OPTIONS.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                        <span className="text-sm text-slate-600">per page</span>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="container px-4 md:px-6">
                {loading ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-[300px] rounded-xl bg-white border border-slate-200 animate-pulse"></div>
                        ))}
                    </div>
                ) : tutors.length > 0 ? (
                    <>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {tutors.map(tutor => (
                                <TutorCard key={tutor.id} tutor={tutor} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-12">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(page - 1)}
                                    disabled={page === 1}
                                    className="flex items-center gap-1"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Previous
                                </Button>

                                <div className="flex items-center gap-1">
                                    {getPageNumbers().map((pageNum, idx) => (
                                        pageNum === "..." ? (
                                            <span key={idx} className="px-2 text-slate-400">...</span>
                                        ) : (
                                            <Button
                                                key={idx}
                                                variant={page === pageNum ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => handlePageChange(pageNum as number)}
                                                className="min-w-[40px]"
                                            >
                                                {pageNum}
                                            </Button>
                                        )
                                    ))}
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(page + 1)}
                                    disabled={page === pagination.totalPages}
                                    className="flex items-center gap-1"
                                >
                                    Next
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        )}

                        {/* Page Info */}
                        <div className="text-center text-sm text-slate-500 mt-4">
                            Page {page} of {pagination.totalPages}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20">
                        <h3 className="text-xl font-bold text-slate-900">No tutors found</h3>
                        <p className="text-slate-500 mt-2">Try adjusting your search or filters.</p>
                        {hasActiveFilters && (
                            <Button onClick={handleClearFilters} className="mt-4">
                                Clear All Filters
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function TutorsPage() {
    return (
        <Suspense fallback={
            <div className="bg-slate-50 min-h-screen pb-20">
                <div className="container px-4 md:px-6 py-20 text-center">
                    <Loader2 className="animate-spin h-8 w-8 text-primary mx-auto" />
                    <p className="mt-4 text-slate-500">Loading tutors...</p>
                </div>
            </div>
        }>
            <TutorsContent />
        </Suspense>
    );
}
