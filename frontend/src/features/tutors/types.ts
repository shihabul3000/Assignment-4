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

// Raw backend data types for transformation
export interface RawBooking {
    reviews?: RawReview[];
}

export interface RawReview {
    rating: number;
}

export interface RawTutorData {
    id?: string;
    userId?: string;
    tutorProfile?: {
        id?: string;
        userId?: string;
        bio?: string;
        subjects?: string[];
        hourlyRate?: number;
        availabilities?: Availability[];
    };
    user?: {
        id?: string;
        name?: string;
        image?: string;
    };
    bio?: string;
    subjects?: string[];
    hourlyRate?: number;
    availabilities?: Availability[];
    averageRating?: number;
    tutorBookings?: RawBooking[];
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
