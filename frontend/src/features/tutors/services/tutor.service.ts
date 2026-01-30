import { apiClient } from '@/lib/apiClient';
import { TutorProfile, TutorSearchParams } from '../types';

// Transform backend User data to frontend TutorProfile format
function transformTutorData(user: any): TutorProfile {
    const tutorProfile = user.tutorProfile || {};
    const reviews = user.tutorBookings?.flatMap((b: any) => b.reviews || []) || [];
    const averageRating = user.averageRating || (reviews.length > 0
        ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
        : 0);

    return {
        id: user.id, // This should now reliably be User.id due to backend fix
        userId: user.userId || user.id,
        bio: tutorProfile.bio || '',
        subjects: tutorProfile.subjects || [],
        hourlyRate: tutorProfile.hourlyRate || 0,
        user: {
            id: user.id,
            name: user.name || 'Unknown Tutor',
            image: user.image || '',
        },
        averageRating: averageRating,
        totalReviews: reviews.length,
        availabilities: tutorProfile.availabilities || [],
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
