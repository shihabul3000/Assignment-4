import { apiClient } from '@/lib/apiClient';
import { TutorProfile, TutorSearchParams } from '../types';

// Transform backend User data to frontend TutorProfile format
function transformTutorData(input: any): TutorProfile {
    // 1. Identify the profile and user objects
    const profile = input.tutorProfile ||
        (input.userId ? input : null) ||
        input;

    const user = input.user ||
        (input.tutorProfile ? input : null) ||
        {};

    const rawBookings = input.tutorBookings || user.tutorBookings || profile.tutorBookings || [];
    const reviews = rawBookings.flatMap((b: any) => b.reviews || []);

    const averageRating = input.averageRating || (reviews.length > 0
        ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
        : 0);

    return {
        id: profile.id || user.id || input.id,
        userId: profile.userId || user.id || input.userId,
        bio: profile.bio || '',
        subjects: profile.subjects || [],
        hourlyRate: profile.hourlyRate || 0,
        user: {
            id: user.id || profile.userId,
            name: user.name || 'Unknown Tutor',
            image: user.image || '',
        },
        averageRating: averageRating,
        totalReviews: reviews.length,
        availabilities: profile.availabilities || input.availabilities || [],
    };
}

export const tutorService = {
    async getAll(params?: TutorSearchParams): Promise<TutorProfile[]> {
        try {
            const response = await apiClient.get('/tutors', { params });
            const tutorsData = response.data.data?.tutors || [];
            return tutorsData.map(transformTutorData);
        } catch (error) {
            console.error("Failed to fetch tutors", error);
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

    async updateAvailability(availabilities: any[]): Promise<boolean> {
        try {
            await apiClient.put('/tutors/availability', { availabilities });
            return true;
        } catch (error) {
            console.error("Failed to update availability", error);
            return false;
        }
    },

    async getMyProfile(): Promise<any> {
        const response = await apiClient.get('/tutors/profile/me');
        return response.data;
    },

    async updateProfile(formData: any): Promise<any> {
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
