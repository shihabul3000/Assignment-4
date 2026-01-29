import { apiClient } from "@/lib/apiClient";

export const tutorService = {
    updateProfile: async (data: {
        name: string;
        bio: string;
        hourlyRate: number;
        subjects: string;
    }) => {
        try {
            const response = await apiClient.put(`/tutors/profile`, {
                name: data.name,
                bio: data.bio,
                subjects: data.subjects.split(',').map(s => s.trim()),
                hourlyRate: data.hourlyRate
            });
            return response.data;
        } catch (error) {
            throw new Error("Failed to update profile");
        }
    },

    getMyProfile: async () => {
        try {
            const response = await apiClient.get(`/tutors/profile/me`);
            return response.data;
        } catch (error) {
            throw new Error("Failed to fetch profile");
        }
    }
};