import { apiClient } from '@/lib/apiClient';

export interface UpdateProfileData {
    name: string;
}

export interface ChangePasswordData {
    currentPassword: string;
    newPassword: string;
}

export const userService = {
    async updateProfile(data: UpdateProfileData) {
        const response = await apiClient.patch('/users/profile', data);
        return response.data;
    },

    async changePassword(data: ChangePasswordData) {
        const response = await apiClient.patch('/users/change-password', data);
        return response.data;
    }
};
