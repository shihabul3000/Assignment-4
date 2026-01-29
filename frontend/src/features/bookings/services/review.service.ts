import { apiClient } from "@/lib/apiClient";

export const reviewService = {
    createReview: async (bookingId: string, data: { rating: number, comment: string }) => {
        const response = await apiClient.post(`/bookings/${bookingId}/reviews`, data);
        return response.data;
    }
};
