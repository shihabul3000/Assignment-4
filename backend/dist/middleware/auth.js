"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.requireAuth = void 0;
const client_1 = require("@prisma/client");
const errors_1 = require("../utils/errors");
const helpers_1 = require("../utils/helpers");
const prisma = new client_1.PrismaClient();
const requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new errors_1.AuthenticationError('Authentication required');
        }
        const token = authHeader.split(' ')[1];
        const decoded = (0, helpers_1.verifyToken)(token);
        if (!decoded) {
            throw new errors_1.AuthenticationError('Invalid or expired token');
        }
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
        });
        if (!user) {
            throw new errors_1.AuthenticationError('User not found');
        }
        req.user = user;
        req.token = decoded;
        next();
    }
    catch (error) {
        if (error instanceof errors_1.AuthenticationError)
            throw error;
        throw new errors_1.AuthenticationError('Invalid session');
    }
};
exports.requireAuth = requireAuth;
const requireRole = (...roles) => {
    return async (req, res, next) => {
        try {
            const user = req.user;
            if (!user) {
                throw new errors_1.AuthenticationError('Authentication required');
            }
            const userRole = user.role || '';
            if (!roles.includes(userRole)) {
                throw new errors_1.AuthorizationError(`Access denied. Required role: ${roles.join(' or ')}`);
            }
            next();
        }
        catch (error) {
            if (error instanceof errors_1.AuthenticationError || error instanceof errors_1.AuthorizationError)
                throw error;
            throw new errors_1.AuthenticationError('Invalid session');
        }
    };
};
exports.requireRole = requireRole;
