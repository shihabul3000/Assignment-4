export interface Availability {
    id?: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
}

export interface Review {
    id: string;
    bookingId: string;
    reviewerId: string;
    reviewer?: {
        name: string;
    };
    rating: number;
    comment?: string;
    createdAt: string;
}

export interface TutorProfile {
    id: string;
    userId: string;
    bio: string;
    subjects: string[];
    hourlyRate: number;
    user: {
        id: string;
        name: string;
        image?: string;
    };
    averageRating: number;
    totalReviews: number;
    availabilities?: Availability[];
    reviews?: Review[];
}

export interface TutorSearchParams {
    query?: string;
    subject?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    sortBy?: 'price' | 'rating' | 'name';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

export interface PaginatedTutorsResponse {
    tutors: TutorProfile[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
