"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingController = void 0;
const client_1 = require("@prisma/client");
const errors_1 = require("../utils/errors");
const prisma = new client_1.PrismaClient();
exports.bookingController = {
    async create(req, res, next) {
        try {
            const user = req.user;
            if (user.role !== 'STUDENT') {
                throw new errors_1.AuthorizationError('Only students can create bookings');
            }
            const { tutorId, dateTime, duration, notes } = req.body;
            // Validation
            const errors = [];
            if (!tutorId)
                errors.push('tutorId is required');
            if (!dateTime)
                errors.push('dateTime is required');
            if (!duration)
                errors.push('duration is required');
            if (errors.length > 0) {
                throw new errors_1.ValidationError(errors.join(', '));
            }
            const parsedDateTime = new Date(dateTime);
            if (isNaN(parsedDateTime.getTime())) {
                throw new errors_1.ValidationError('Invalid dateTime format');
            }
            if (parsedDateTime <= new Date()) {
                throw new errors_1.ValidationError('Booking must be in the future');
            }
            if (typeof duration !== 'number' || duration <= 0 || duration > 24) {
                throw new errors_1.ValidationError('Duration must be a positive number (max 24 hours)');
            }
            // Check if tutor exists and is a tutor
            const tutor = await prisma.user.findFirst({
                where: { id: tutorId, role: 'TUTOR' },
            });
            if (!tutor) {
                throw new errors_1.NotFoundError('Tutor');
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
                    tutor: { select: { id: true, name: true, email: true } },
                },
            });
            res.status(201).json({
                success: true,
                data: { booking },
                message: 'Booking created successfully',
            });
        }
        catch (error) {
            next(error);
        }
    },
    async getAll(req, res, next) {
        try {
            const user = req.user;
            let where = {};
            if (user.role === 'STUDENT') {
                where.studentId = user.id;
            }
            else if (user.role === 'TUTOR') {
                where.tutorId = user.id;
            }
            else {
                throw new errors_1.AuthorizationError('Invalid role for accessing bookings');
            }
            const bookings = await prisma.booking.findMany({
                where,
                include: {
                    student: { select: { id: true, name: true, email: true } },
                    tutor: { select: { id: true, name: true, email: true } },
                },
                orderBy: { dateTime: 'desc' },
            });
            res.json({
                success: true,
                data: { bookings },
            });
        }
        catch (error) {
            next(error);
        }
    },
    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const user = req.user;
            if (!id || typeof id !== 'string' || id.trim() === '') {
                throw new errors_1.ValidationError('Invalid booking ID');
            }
            const booking = await prisma.booking.findUnique({
                where: { id },
                include: {
                    student: { select: { id: true, name: true, email: true } },
                    tutor: { select: { id: true, name: true, email: true } },
                    reviews: true,
                },
            });
            if (!booking) {
                throw new errors_1.NotFoundError('Booking');
            }
            // Check authorization: only student or tutor involved can view
            if (booking.studentId !== user.id && booking.tutorId !== user.id) {
                throw new errors_1.AuthorizationError('Access denied');
            }
            res.json({
                success: true,
                data: { booking },
            });
        }
        catch (error) {
            next(error);
        }
    },
    async updateStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const user = req.user;
            if (!id || typeof id !== 'string' || id.trim() === '') {
                throw new errors_1.ValidationError('Invalid booking ID');
            }
            if (!status || !['CONFIRMED', 'CANCELLED'].includes(status)) {
                throw new errors_1.ValidationError('Status must be CONFIRMED or CANCELLED');
            }
            // Find the booking
            const booking = await prisma.booking.findUnique({
                where: { id },
            });
            if (!booking) {
                throw new errors_1.NotFoundError('Booking');
            }
            // Only the tutor can accept/decline bookings
            if (booking.tutorId !== user.id) {
                throw new errors_1.AuthorizationError('Only the assigned tutor can update booking status');
            }
            // Only pending bookings can be updated
            if (booking.status !== 'PENDING') {
                throw new errors_1.ConflictError('Only pending bookings can be accepted or declined');
            }
            // Update the booking status
            const updatedBooking = await prisma.booking.update({
                where: { id },
                data: { status },
                include: {
                    student: { select: { id: true, name: true, email: true } },
                    tutor: { select: { id: true, name: true, email: true } },
                },
            });
            res.json({
                success: true,
                data: { booking: updatedBooking },
                message: `Booking ${status === 'CONFIRMED' ? 'accepted' : 'declined'} successfully`,
            });
        }
        catch (error) {
            next(error);
        }
    },
};
