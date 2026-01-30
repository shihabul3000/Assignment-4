import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticationError, AuthorizationError } from '../utils/errors';
import { verifyToken } from '../utils/helpers';

const prisma = new PrismaClient();

export interface AuthRequest extends Request {
    user?: any;
    token?: any;
}

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next(new AuthenticationError('Authentication required'));
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);

        if (!decoded) {
            return next(new AuthenticationError('Invalid or expired token'));
        }

        const user = await prisma.user.findUnique({
            where: { id: (decoded as any).id },
        });

        if (!user) {
            return next(new AuthenticationError('User not found'));
        }

        if (user.status === 'BANNED') {
            return next(new AuthenticationError('Your account has been banned. Please contact support.'));
        }

        req.user = user;
        req.token = decoded;
        next();
    } catch (error) {
        next(error instanceof AuthenticationError ? error : new AuthenticationError('Invalid session'));
    }
};

export const requireRole = (...roles: string[]) => {
    return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const user = req.user;
            if (!user) {
                return next(new AuthenticationError('Authentication required'));
            }

            const userRole = user.role || '';
            if (!roles.includes(userRole as string)) {
                return next(new AuthorizationError(`Access denied. Required role: ${roles.join(' or ')}`));
            }
            next();
        } catch (error) {
            next(error instanceof AuthenticationError || error instanceof AuthorizationError ? error : new AuthenticationError('Invalid session'));
        }
    };
};
