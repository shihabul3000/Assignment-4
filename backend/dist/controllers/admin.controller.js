"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminController = void 0;
const client_1 = require("@prisma/client");
const errors_1 = require("../utils/errors");
const prisma = new client_1.PrismaClient();
exports.adminController = {
    async getUsers(req, res, next) {
        try {
            const { role, status, page = '1', limit = '10' } = req.query;
            const pageNum = parseInt(page, 10);
            const limitNum = parseInt(limit, 10);
            const skip = (pageNum - 1) * limitNum;
            let where = {};
            if (role) {
                where.role = role;
            }
            if (status) {
                where.status = status;
            }
            const users = await prisma.user.findMany({
                where,
                skip,
                take: limitNum,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    status: true,
                    createdAt: true,
                },
            });
            const total = await prisma.user.count({ where });
            res.json({
                success: true,
                data: { users, total, page: pageNum, limit: limitNum },
            });
        }
        catch (error) {
            next(error);
        }
    },
    async updateUser(req, res, next) {
        try {
            const { id } = req.params;
            const { role, status } = req.body;
            if (!id || typeof id !== 'string' || id.trim() === '') {
                throw new errors_1.ValidationError('Invalid user ID');
            }
            const user = await prisma.user.update({
                where: { id },
                data: {
                    ...(role && { role }),
                    ...(status && { status }),
                },
            });
            res.json({
                success: true,
                data: {
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        status: user.status,
                    },
                },
                message: 'User updated successfully',
            });
        }
        catch (error) {
            next(error);
        }
    },
    async getBookings(req, res, next) {
        try {
            const { status, page = '1', limit = '10' } = req.query;
            const pageNum = parseInt(page, 10);
            const limitNum = parseInt(limit, 10);
            const skip = (pageNum - 1) * limitNum;
            let where = {};
            if (status) {
                where.status = status;
            }
            const bookings = await prisma.booking.findMany({
                where,
                skip,
                take: limitNum,
                orderBy: { createdAt: 'desc' },
                include: {
                    student: { select: { id: true, name: true, email: true } },
                    tutor: { select: { id: true, name: true, email: true } },
                },
            });
            const total = await prisma.booking.count({ where });
            res.json({
                success: true,
                data: { bookings, total, page: pageNum, limit: limitNum },
            });
        }
        catch (error) {
            next(error);
        }
    },
    async getCategories(req, res, next) {
        try {
            const categories = await prisma.category.findMany({
                orderBy: { name: 'asc' },
            });
            res.json({
                success: true,
                data: { categories },
            });
        }
        catch (error) {
            next(error);
        }
    },
    async createCategory(req, res, next) {
        try {
            const { name, description } = req.body;
            const category = await prisma.category.create({
                data: { name, description },
            });
            res.status(201).json({
                success: true,
                data: { category },
                message: 'Category created successfully',
            });
        }
        catch (error) {
            next(error);
        }
    },
};
