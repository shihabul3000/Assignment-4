import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { AuthRequest } from '../middleware/auth';
import { ValidationError, NotFoundError, AuthenticationError } from '../utils/errors';

const prisma = new PrismaClient();

export const userController = {
    async updateProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user.id;
            const { name } = req.body;

            if (!name) {
                throw new ValidationError('Name is required');
            }

            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: { name },
            });

            res.json({
                success: true,
                data: {
                    user: {
                        id: updatedUser.id,
                        name: updatedUser.name,
                        email: updatedUser.email,
                        role: updatedUser.role
                    }
                },
                message: 'Profile updated successfully'
            });
        } catch (error) {
            next(error);
        }
    },

    async changePassword(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user.id;
            const { currentPassword, newPassword } = req.body;

            if (!currentPassword || !newPassword) {
                throw new ValidationError('Current and new passwords are required');
            }

            if (newPassword.length < 6) {
                throw new ValidationError('New password must be at least 6 characters');
            }

            // Find user and their credential account
            const user = await prisma.user.findUnique({
                where: { id: userId },
                include: { accounts: true },
            });

            if (!user) {
                throw new NotFoundError('User');
            }

            const account = user.accounts.find(a => a.providerId === 'credential');
            if (!account || !account.password) {
                throw new AuthenticationError('Credential account not found');
            }

            // Verify current password
            const isValidPassword = await bcrypt.compare(currentPassword, account.password);
            if (!isValidPassword) {
                throw new AuthenticationError('Invalid current password');
            }

            // Hash new password
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);

            // Update password
            await prisma.account.update({
                where: { id: account.id },
                data: { password: hashedNewPassword },
            });

            res.json({
                success: true,
                message: 'Password updated successfully'
            });
        } catch (error) {
            next(error);
        }
    }
};
