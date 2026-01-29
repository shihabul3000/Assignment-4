import { apiClient } from "@/lib/apiClient";

export const adminService = {
    getUsers: async (params?: { role?: string, status?: string }) => {
        const response = await apiClient.get('/admin/users', { params });
        return response.data;
    },

    updateUser: async (id: string, data: { role?: string, status?: string }) => {
        const response = await apiClient.patch(`/admin/users/${id}`, data);
        return response.data;
    },

    getBookings: async (params?: { status?: string }) => {
        const response = await apiClient.get('/admin/bookings', { params });
        return response.data;
    },

    getCategories: async () => {
        const response = await apiClient.get('/admin/categories');
        return response.data;
    },

    createCategory: async (data: { name: string, description?: string }) => {
        const response = await apiClient.post('/admin/categories', data);
        return response.data;
    },

    getStats: async () => {
        const response = await apiClient.get('/admin/stats');
        return response.data;
    },

    getPlatformSettings: async () => {
        const response = await apiClient.get('/admin/settings');
        return response.data;
    },

    updatePlatformSettings: async (data: any) => {
        const response = await apiClient.patch('/admin/settings', data);
        return response.data;
    }
};
