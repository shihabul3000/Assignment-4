import { Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { ValidationError, NotFoundError, AuthorizationError } from '../utils/errors';
import { parsePagination } from '../utils/helpers';
import { AuthRequest } from '../middleware/auth';



export const tutorController = {
    async getTutors(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { subject, rating, price } = req.query;
            const page = req.query.page as string;
            const limit = req.query.limit as string;
            const { page: pageNum, limit: limitNum } = parsePagination(page, limit);

            // Validate pagination parameters
            if (isNaN(pageNum) || pageNum < 1) {
                throw new ValidationError('Invalid page number');
            }
            if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
                throw new ValidationError('Limit must be between 1 and 100');
            }

            let where: any = { role: 'TUTOR' };

            if (subject) {
                where.tutorProfile = { subjects: { has: subject as string } };
            }

            if (price) {
                const priceNum = parseFloat(price as string);
                if (isNaN(priceNum) || priceNum < 0) {
                    throw new ValidationError('Price must be a positive number');
                }
                where.tutorProfile = { ...where.tutorProfile, hourlyRate: { lte: priceNum } };
            }

            const tutors = await prisma.user.findMany({
                where,
                include: {
                    tutorProfile: {
                        include: {
                            availabilities: true
                        }
                    },
                    tutorBookings: {
                        include: {
                            reviews: true
                        }
                    }
                }
            });

            const tutorsWithRating = tutors.map((tutor: any) => {
                const reviews = tutor.tutorBookings.flatMap((b: any) => b.reviews);
                const avgRating = reviews.length > 0 ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length : 0;
                return { ...tutor, averageRating: avgRating };
            });

            let filtered = tutorsWithRating;
            if (rating) {
                const ratingNum = parseFloat(rating as string);
                if (isNaN(ratingNum) || ratingNum < 0 || ratingNum > 5) {
                    throw new ValidationError('Rating must be between 0 and 5');
                }
                filtered = filtered.filter((t: any) => t.averageRating >= ratingNum);
            }

            const start = (pageNum - 1) * limitNum;
            const paginated = filtered.slice(start, start + limitNum);

            res.json({
                success: true,
                data: { tutors: paginated, total: filtered.length },
            });
        } catch (error) {
            next(error);
        }
    },

    async getTutorById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;

            if (!id || typeof id !== 'string' || id.trim() === '') {
                throw new ValidationError('Invalid tutor ID');
            }

            // Look up by TutorProfile.id OR User.id
            const tutorProfile = await prisma.tutorProfile.findFirst({
                where: {
                    OR: [
                        { id },
                        { userId: id }
                    ]
                },
                include: {
                    user: true,
                    availabilities: true,
                }
            });

            if (!tutorProfile) {
                throw new NotFoundError('Tutor');
            }

            // Get tutor's bookings and reviews separately
            const tutorBookings = await prisma.booking.findMany({
                where: { tutorId: tutorProfile.userId },
                include: {
                    reviews: {
                        include: {
                            reviewer: { select: { name: true } }
                        }
                    }
                }
            });

            const reviews = tutorBookings.flatMap((b: any) => b.reviews.map((r: any) => ({ ...r, bookingId: b.id })));
            const avgRating = reviews.length > 0 ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length : 0;

            // Construct response in the same format as before for frontend compatibility
            const tutorData = {
                ...tutorProfile,
                ...tutorProfile.user,
                tutorProfile,
                tutorBookings,
                reviews,
                averageRating: avgRating
            };

            res.json({
                success: true,
                data: tutorData,
            });
        } catch (error) {
            next(error);
        }
    },

    async updateProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { name, bio, subjects, hourlyRate } = req.body;
            const user = req.user;

            // Validation
            if (subjects && !Array.isArray(subjects)) {
                throw new ValidationError('Subjects must be an array');
            }

            if (hourlyRate !== undefined && (typeof hourlyRate !== 'number' || hourlyRate < 0)) {
                throw new ValidationError('Hourly rate must be a positive number');
            }

            // Check if tutor profile exists
            let tutorProfile = await prisma.tutorProfile.findUnique({
                where: { userId: user.id },
            });

            if (tutorProfile) {
                // Update existing profile
                tutorProfile = await prisma.tutorProfile.update({
                    where: { userId: user.id },
                    data: {
                        bio,
                        subjects,
                        hourlyRate,
                    },
                });
            } else {
                // Create new profile
                tutorProfile = await prisma.tutorProfile.create({
                    data: {
                        userId: user.id,
                        bio,
                        subjects,
                        hourlyRate: hourlyRate || 0,
                    },
                });
            }

            // Update user name if provided
            if (name) {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { name }
                });
            }

            res.json({
                success: true,
                data: {
                    tutorProfile: {
                        ...tutorProfile,
                        user: {
                            id: user.id,
                            name: name || user.name,
                            email: user.email
                        }
                    }
                },
                message: 'Tutor profile updated successfully',
            });
        } catch (error) {
            next(error);
        }
    },

    async getProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = req.user;

            const tutorProfile = await prisma.tutorProfile.findUnique({
                where: { userId: user.id },
                include: {
                    availabilities: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true,
                        }
                    }
                }
            });

            if (!tutorProfile) {
                throw new NotFoundError('Tutor profile');
            }

            res.json({
                success: true,
                data: { tutorProfile },
            });
        } catch (error) {
            next(error);
        }
    },

    async updateAvailability(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = req.user;
            const { availabilities } = req.body;

            if (!availabilities || !Array.isArray(availabilities)) {
                throw new ValidationError('Availabilities must be an array');
            }

            // 1. Ensure profile exists
            let profile = await prisma.tutorProfile.findUnique({
                where: { userId: user.id }
            });

            if (!profile) {
                profile = await prisma.tutorProfile.create({
                    data: { userId: user.id, hourlyRate: 0 }
                });
            }

            // 2. Perform Clear-and-Sync
            await prisma.$transaction([
                // Clear existing
                prisma.availability.deleteMany({
                    where: { tutorProfileId: profile.id }
                }),
                // Create new
                prisma.availability.createMany({
                    data: availabilities.map((a: any) => ({
                        tutorProfileId: profile!.id,
                        dayOfWeek: a.dayOfWeek.toUpperCase(),
                        startTime: a.startTime,
                        endTime: a.endTime,
                    }))
                })
            ]);

            res.json({
                success: true,
                message: 'Availability updated successfully',
            });
        } catch (error) {
            next(error);
        }
    },
    async getDashboardStats(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = req.user;

            const tutorProfile = await prisma.tutorProfile.findUnique({
                where: { userId: user.id },
            });

            if (!tutorProfile) {
                throw new NotFoundError('Tutor profile');
            }

            const bookings = await prisma.booking.findMany({
                where: { tutorId: user.id },
                include: {
                    student: { select: { id: true, name: true, email: true } },
                },
                orderBy: { dateTime: 'desc' },
            });

            const now = new Date();
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();

            const totalStudents = new Set(bookings.map((b) => b.studentId)).size;
            const pendingRequests = bookings.filter((b) => b.status === 'PENDING').length;

            // Calculate earnings for confirmed/completed bookings in the current month
            const monthlyEarnings = bookings
                .filter((b) => {
                    const bookingDate = new Date(b.dateTime);
                    return (
                        (b.status === 'CONFIRMED' || b.status === 'COMPLETED') &&
                        bookingDate.getMonth() === currentMonth &&
                        bookingDate.getFullYear() === currentYear
                    );
                })
                .reduce((sum, b) => sum + b.duration * tutorProfile.hourlyRate, 0);

            const hoursTaught = bookings
                .filter((b) => b.status === 'COMPLETED' || b.status === 'CONFIRMED') // Including confirmed as "planned/taught" hours
                .reduce((sum, b) => sum + b.duration, 0);

            const recentRequests = bookings
                .filter((b) => b.status === 'PENDING')
                .slice(0, 5);

            res.json({
                success: true,
                data: {
                    stats: {
                        totalStudents,
                        pendingRequests,
                        monthlyEarnings,
                        hoursTaught,
                    },
                    recentRequests,
                },
            });
        } catch (error) {
            next(error);
        }
    },
};
