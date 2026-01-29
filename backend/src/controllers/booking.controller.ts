import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { ValidationError, NotFoundError, AuthorizationError, ConflictError } from '../utils/errors';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const bookingController = {
    async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = req.user;
            if (user.role !== 'STUDENT') {
                throw new AuthorizationError('Only students can create bookings');
            }

            const { tutorId, dateTime, duration, notes } = req.body;

            // Validation
            const errors: string[] = [];
            if (!tutorId) errors.push('tutorId is required');
            if (!dateTime) errors.push('dateTime is required');
            if (!duration) errors.push('duration is required');

            if (errors.length > 0) {
                throw new ValidationError(errors.join(', '));
            }

            const parsedDateTime = new Date(dateTime);
            if (isNaN(parsedDateTime.getTime())) {
                throw new ValidationError('Invalid dateTime format');
            }

            if (parsedDateTime <= new Date()) {
                throw new ValidationError('Booking must be in the future');
            }

            if (typeof duration !== 'number' || duration <= 0 || duration > 24) {
                throw new ValidationError('Duration must be a positive number (max 24 hours)');
            }

            // Check if tutor exists and is a tutor
            const tutor = await prisma.user.findFirst({
                where: { id: tutorId, role: 'TUTOR' },
            });
            if (!tutor) {
                throw new NotFoundError('Tutor');
            }

            // Create booking
            const booking = await prisma.booking.create({
                data: {
                    studentId: user.id,
                    tutorId,
                    dateTime: parsedDateTime,
                    duration,
                    notes,
                },
                include: {
                    student: { select: { id: true, name: true, email: true } },
                    tutor: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            tutorProfile: { select: { hourlyRate: true } }
                        }
                    },
                },
            });

            // Flatten hourlyRate
            const tutorInfo = booking.tutor as any;
            const hourlyRate = tutorInfo?.tutorProfile?.hourlyRate || 0;
            const { tutorProfile: tp, ...tutorBase } = tutorInfo || {};

            const flattenedBooking = {
                ...booking,
                tutor: tutorInfo ? { ...tutorBase, hourlyRate } : null
            };

            res.status(201).json({
                success: true,
                data: { booking: flattenedBooking },
                message: 'Booking created successfully',
            });
        } catch (error) {
            next(error);
        }
    },

    async getAll(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = req.user;

            let where: any = {};
            if (user.role === 'STUDENT') {
                where.studentId = user.id;
            } else if (user.role === 'TUTOR') {
                where.tutorId = user.id;
            } else {
                throw new AuthorizationError('Invalid role for accessing bookings');
            }

            const bookings = await prisma.booking.findMany({
                where,
                include: {
                    student: { select: { id: true, name: true, email: true } },
                    tutor: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            tutorProfile: { select: { hourlyRate: true } }
                        }
                    },
                },
                orderBy: { dateTime: 'desc' },
            });

            // Flatten hourlyRate for frontend compatibility
            const flattenedBookings = bookings.map((b: any) => {
                const hourlyRate = b.tutor?.tutorProfile?.hourlyRate || 0;
                const { tutorProfile, ...tutorData } = b.tutor || {};
                return {
                    ...b,
                    tutor: b.tutor ? { ...tutorData, hourlyRate } : null
                };
            });

            res.json({
                success: true,
                data: { bookings: flattenedBookings },
            });
        } catch (error) {
            next(error);
        }
    },

    async getById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const user = req.user;

            if (!id || typeof id !== 'string' || id.trim() === '') {
                throw new ValidationError('Invalid booking ID');
            }

            const booking = await prisma.booking.findUnique({
                where: { id },
                include: {
                    student: { select: { id: true, name: true, email: true } },
                    tutor: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            tutorProfile: { select: { hourlyRate: true } }
                        }
                    },
                    reviews: true,
                },
            });

            if (!booking) {
                throw new NotFoundError('Booking');
            }

            // Check authorization: only student or tutor involved can view
            if (booking.studentId !== user.id && booking.tutorId !== user.id) {
                throw new AuthorizationError('Access denied');
            }

            // Flatten hourlyRate
            const tutorInfo = booking.tutor as any;
            const hourlyRate = tutorInfo?.tutorProfile?.hourlyRate || 0;
            const { tutorProfile: tp, ...tutorBase } = tutorInfo || {};

            const flattenedBooking = {
                ...booking,
                tutor: tutorInfo ? { ...tutorBase, hourlyRate } : null
            };

            res.json({
                success: true,
                data: { booking: flattenedBooking },
            });
        } catch (error) {
            next(error);
        }
    },

    async updateStatus(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const user = req.user;

            if (!id || typeof id !== 'string' || id.trim() === '') {
                throw new ValidationError('Invalid booking ID');
            }

            if (!status || !['CONFIRMED', 'CANCELLED', 'COMPLETED'].includes(status)) {
                throw new ValidationError('Status must be CONFIRMED, CANCELLED, or COMPLETED');
            }

            // Find the booking
            const booking = await prisma.booking.findUnique({
                where: { id },
            });

            if (!booking) {
                throw new NotFoundError('Booking');
            }

            // Check authorization
            const isStudent = booking.studentId === user.id;
            const isTutor = booking.tutorId === user.id;

            if (status === 'CANCELLED') {
                if (!isStudent && !isTutor) {
                    throw new AuthorizationError('Only the student or tutor can cancel this booking');
                }
            } else if (status === 'CONFIRMED') {
                if (!isTutor) {
                    throw new AuthorizationError('Only the assigned tutor can confirm this booking');
                }
                if (booking.status !== 'PENDING') {
                    throw new ConflictError('Only pending bookings can be confirmed');
                }
            } else if (status === 'COMPLETED') {
                if (!isTutor) {
                    throw new AuthorizationError('Only the assigned tutor can mark this booking as completed');
                }
                if (booking.status !== 'CONFIRMED') {
                    throw new ConflictError('Only confirmed bookings can be marked as completed');
                }
            }

            // For CANCELLED, only pending can be cancelled? 
            // Actually, confirmed bookings might be cancellable too depending on policy, 
            // but the original logic only allowed pending. Let's stick to the narrowest fix.
            if (status === 'CANCELLED' && booking.status !== 'PENDING' && booking.status !== 'CONFIRMED') {
                throw new ConflictError('This booking cannot be cancelled in its current state');
            }

            // Update the booking status
            const updatedBooking = await prisma.booking.update({
                where: { id },
                data: { status },
                include: {
                    student: { select: { id: true, name: true, email: true } },
                    tutor: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            tutorProfile: { select: { hourlyRate: true } }
                        }
                    },
                },
            });

            // Flatten hourlyRate
            const tutorInfo = updatedBooking.tutor as any;
            const hourlyRate = tutorInfo?.tutorProfile?.hourlyRate || 0;
            const { tutorProfile: tp, ...tutorBase } = tutorInfo || {};

            const flattenedBooking = {
                ...updatedBooking,
                tutor: tutorInfo ? { ...tutorBase, hourlyRate } : null
            };

            res.json({
                success: true,
                data: { booking: flattenedBooking },
                message: `Booking ${status === 'CONFIRMED' ? 'accepted' : 'cancelled'} successfully`,
            });
        } catch (error) {
            next(error);
        }
    },
    async getStudentStats(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = req.user;
            if (user.role !== 'STUDENT') {
                throw new AuthorizationError('Only students can access student stats');
            }

            const bookings = await prisma.booking.findMany({
                where: { studentId: user.id },
                include: {
                    tutor: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        }
                    },
                },
                orderBy: { dateTime: 'asc' },
            });

            const now = new Date();
            const totalSessions = bookings.length;
            const upcomingBookings = bookings.filter(b => new Date(b.dateTime) > now && b.status !== 'CANCELLED');
            const upcomingSessionsCount = upcomingBookings.length;

            const hoursLearned = bookings
                .filter(b => b.status === 'COMPLETED')
                .reduce((sum, b) => sum + b.duration, 0);

            // Get next 3 upcoming sessions
            const nextSessions = upcomingBookings.slice(0, 3);

            res.json({
                success: true,
                data: {
                    stats: {
                        totalSessions,
                        upcomingSessionsCount,
                        hoursLearned,
                    },
                    upcomingSessions: nextSessions,
                },
            });
        } catch (error) {
            next(error);
        }
    },
};
