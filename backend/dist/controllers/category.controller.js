"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.categoryController = {
    async getAll(req, res, next) {
        try {
            const categories = await prisma.category.findMany();
            res.json({
                success: true,
                data: { categories },
            });
        }
        catch (error) {
            next(error);
        }
    },
    async create(req, res, next) {
        try {
            const user = req.user;
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
