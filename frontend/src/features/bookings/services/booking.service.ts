import { apiClient } from '@/lib/apiClient';
import { Booking, CreateBookingPayload } from '../types';

export const bookingService = {
    // Get all bookings for the current user (Student or Tutor)
    async getMyBookings(): Promise<Booking[]> {
        try {
            // const response = await apiClient.get('/bookings');
            // return response.data.data;

            // Mock Data for now
            return MOCK_BOOKINGS;
        } catch (error) {
            console.error("Failed to fetch bookings", error);
            return [];
        }
    },

    async createBooking(payload: CreateBookingPayload): Promise<{ success: boolean; data?: Booking; message?: string }> {
        try {
            // Ensure strict COD
            const safePayload = { ...payload, paymentMethod: 'COD', paymentStatus: 'PENDING' };
            console.log("Creating booking with payload:", safePayload);

            // Real API Call
            // const response = await apiClient.post('/bookings', safePayload);
            // return { success: true, data: response.data.data };

            // Mock Success
            await new Promise(resolve => setTimeout(resolve, 1000));
            return { success: true };
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Failed to create booking"
            };
        }
    }
};

const MOCK_BOOKINGS: Booking[] = [
    {
        id: 'b1',
        studentId: 'u-me',
        tutorId: '1',
        startTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        endTime: new Date(Date.now() + 90000000).toISOString(),
        status: 'PENDING',
        paymentStatus: 'PENDING',
        paymentMethod: 'COD',
        tutor: {
            id: '1',
            hourlyRate: 25,
            user: { name: 'Dr. Sarah Smith', email: 'sarah@example.com' }
        }
    }
];
