import { apiClient } from '@/lib/apiClient';
import { TutorProfile, TutorSearchParams, PaginatedTutorsResponse, Availability } from '../types';

// Raw data interfaces for transformation
interface RawReview {
    rating: number;
}

interface RawBooking {
    reviews?: RawReview[];
}

interface RawUser {
    id?: string;
    name?: string;
    image?: string;
    tutorBookings?: RawBooking[];
}

interface RawTutorProfile {
    id?: string;
    userId?: string;
    bio?: string;
    subjects?: string[];
    hourlyRate?: number;
    availabilities?: Availability[];
    tutorBookings?: RawBooking[];
}

interface RawTutorData {
    id?: string;
    userId?: string;
    tutorProfile?: RawTutorProfile;
    user?: RawUser;
    bio?: string;
    subjects?: string[];
    hourlyRate?: number;
    availabilities?: Availability[];
    averageRating?: number;
    tutorBookings?: RawBooking[];
}

// Transform backend User data to frontend TutorProfile format
function transformTutorData(input: RawTutorData): TutorProfile {
    // 1. Identify the profile and user objects
    const profile = input.tutorProfile ||
        (input.userId ? input : null) ||
        input;

    const user: RawUser = input.user ||
        (input.tutorProfile ? input : null) ||
        {};

    const rawBookings = input.tutorBookings || user.tutorBookings || profile?.tutorBookings || [];
    const reviews = rawBookings.flatMap((b: RawBooking) => b.reviews || []);

    const averageRating = input.averageRating || (reviews.length > 0
        ? reviews.reduce((sum: number, r: RawReview) => sum + r.rating, 0) / reviews.length
        : 0);

    return {
        id: profile?.id || user.id || input.id || '',
        userId: profile?.userId || user.id || input.userId || '',
        bio: profile?.bio || '',
        subjects: profile?.subjects || [],
        hourlyRate: profile?.hourlyRate || 0,
        user: {
            id: user.id || profile?.userId || '',
            name: user.name || 'Unknown Tutor',
            image: user.image || '',
        },
        averageRating: averageRating,
        totalReviews: reviews.length,
        availabilities: profile?.availabilities || input.availabilities || [],
        reviews: reviews as unknown as TutorProfile['reviews'],
    };
}

export const tutorService = {
    async getAll(params?: TutorSearchParams): Promise<PaginatedTutorsResponse> {
        try {
            const response = await apiClient.get('/tutors', { params });
            const tutorsData = response.data.data?.tutors || [];
            const pagination = response.data.data?.pagination || {
                total: tutorsData.length,
                page: 1,
                limit: 10,
                totalPages: 1
            };
            return {
                tutors: tutorsData.map(transformTutorData),
                pagination
            };
        } catch (error) {
            console.error("Failed to fetch tutors", error);
            return {
                tutors: [],
                pagination: { total: 0, page: 1, limit: 10, totalPages: 0 }
            };
        }
    },

    async getCategories(): Promise<string[]> {
        try {
            const response = await apiClient.get('/categories');
            return response.data.data?.categories?.map((cat: { name: string }) => cat.name) || [];
        } catch (error) {
            console.error("Failed to fetch categories", error);
            return [];
        }
    },

    async getById(id: string): Promise<TutorProfile | null> {
        try {
            const response = await apiClient.get(`/tutors/${id}`);
            const userData = response.data.data;
            if (!userData) return null;
            return transformTutorData(userData);
        } catch (error) {
            console.error(`Failed to fetch tutor with id ${id}`, error);
            return null;
        }
    },

    async updateAvailability(availabilities: Availability[]): Promise<boolean> {
        try {
            await apiClient.put('/tutors/availability', { availabilities });
            return true;
        } catch (error) {
            console.error("Failed to update availability", error);
            return false;
        }
    },

    async getMyProfile(): Promise<unknown> {
        const response = await apiClient.get('/tutors/profile/me');
        return response.data;
    },

    async updateProfile(formData: Record<string, unknown>): Promise<unknown> {
        const payload = {
            ...formData,
            subjects: typeof formData.subjects === 'string'
                ? formData.subjects.split(',').map((s: string) => s.trim()).filter(Boolean)
                : formData.subjects
        };
        const response = await apiClient.put('/tutors/profile', payload);
        return response.data;
    },

    async getOwnProfile(): Promise<TutorProfile | null> {
        try {
            const response = await apiClient.get('/tutors/profile/me');
            const data = response.data.data?.tutorProfile;
            if (!data) return null;
            return transformTutorData(data);
        } catch (error) {
            console.error("Failed to fetch own profile", error);
            return null;
        }
    }
};
