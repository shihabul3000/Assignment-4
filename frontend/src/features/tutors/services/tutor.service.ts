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
    }
};
