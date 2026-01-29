export interface Booking {
    id: string;
    studentId: string;
    tutorId: string;
    startTime?: string; // Legacy
    endTime?: string;   // Legacy
    dateTime: string;   // Backend field
    duration: number;   // Backend field
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
    paymentStatus: 'PENDING' | 'PAID';
    paymentMethod: 'COD';
    tutor?: {
        id: string;
        name: string;
        email: string;
        hourlyRate?: number;
    };
    student?: {
        id: string;
        name: string;
        email: string;
    };
    notes?: string;
}

export interface CreateBookingPayload {
    tutorId: string;
    dateTime: string;
    duration: number;
    notes?: string;
    paymentMethod: 'COD';
    paymentStatus: 'PENDING';
}
