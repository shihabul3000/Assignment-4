export interface Booking {
    id: string;
    studentId: string;
    tutorId: string;
    startTime: string; // ISO Date
    endTime: string;   // ISO Date
    dateTime?: string; // Backend uses dateTime instead of startTime
    duration?: number; // Backend uses duration
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
    paymentStatus: 'PENDING' | 'PAID';
    paymentMethod: 'COD'; // Strict Type
    tutor?: {
        id: string;
        name?: string;
        user?: { name: string; email: string };
        hourlyRate?: number;
    };
    student?: {
        id: string;
        name?: string;
        user?: { name: string; email: string };
    };
}

export interface CreateBookingPayload {
    tutorId: string;
    startTime: string;
    endTime: string;
    paymentMethod: 'COD';
    paymentStatus: 'PENDING';
}
