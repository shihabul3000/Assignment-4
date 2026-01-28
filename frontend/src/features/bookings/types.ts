export interface Booking {
    id: string;
    studentId: string;
    tutorId: string;
    startTime: string; // ISO Date
    endTime: string;   // ISO Date
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
    paymentStatus: 'PENDING' | 'PAID';
    paymentMethod: 'COD'; // Strict Type
    tutor?: {
        id: string;
        user: { name: string; email: string };
        hourlyRate: number;
    };
    student?: {
        id: string;
        user: { name: string; email: string };
    };
}

export interface CreateBookingPayload {
    tutorId: string;
    startTime: string;
    endTime: string;
    paymentMethod: 'COD';
    paymentStatus: 'PENDING';
}
