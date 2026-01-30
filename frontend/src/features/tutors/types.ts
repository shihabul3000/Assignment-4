export interface Availability {
    id?: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
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
}

export interface TutorSearchParams {
    query?: string;
    subject?: string;
    minPrice?: number;
    maxPrice?: number;
}
