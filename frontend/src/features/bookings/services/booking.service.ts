import { apiClient } from '@/lib/apiClient';
import { Booking, CreateBookingPayload } from '../types';

export const bookingService = {
    // Get all bookings for the current user (Student or Tutor)
    async getMyBookings(): Promise<Booking[]> {
        try {
            const response = await apiClient.get('/bookings');
            return response.data.data.bookings;
        } catch (error) {
            console.error("Failed to fetch bookings", error);
            return [];
        }
    },

    async createBooking(payload: CreateBookingPayload): Promise<{ success: boolean; data?: Booking; message?: string }> {
        try {
            console.log("Creating booking with payload:", payload);

            // Real API Call
            const response = await apiClient.post('/bookings', payload);
            return { success: true, data: response.data.data };

            // Mock Success - REMOVED
            // await new Promise(resolve => setTimeout(resolve, 1000));
            // return { success: true };
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Failed to create booking"
            };
        }
    },

    async updateBookingStatus(bookingId: string, status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'): Promise<{ success: boolean; data?: Booking; message?: string }> {
        try {
            console.log(`Updating booking ${bookingId} to status ${status}`);
            const response = await apiClient.patch(`/bookings/${bookingId}/status`, { status });
            console.log('Update response:', response.data);
            return { success: true, data: response.data.data.booking };
        } catch (error: any) {
            console.error('Update booking error:', error);
            console.error('Error response:', error.response?.data);
            return {
                success: false,
                message: error.response?.data?.message || `Failed to ${status === 'CONFIRMED' ? 'accept' : 'decline'} booking`
            };
        }
    }
};
