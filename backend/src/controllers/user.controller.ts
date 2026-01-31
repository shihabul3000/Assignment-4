import { Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';
import { ValidationError, NotFoundError, AuthenticationError } from '../utils/errors';

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
    },

    async deleteAccount(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user.id;

            // Perform manual cleanup in a transaction to handle foreign key constraints logically
            await prisma.$transaction(async (tx) => {
                // 1. Delete reviews where user is the reviewer
                await tx.review.deleteMany({
                    where: { reviewerId: userId }
                });

                // 2. Delete reviews associated with bookings the user is involved in
                await tx.review.deleteMany({
                    where: {
                        booking: {
                            OR: [
                                { studentId: userId },
                                { tutorId: userId }
                            ]
                        }
                    }
                });

                // 3. Delete bookings where user is either student or tutor
                await tx.booking.deleteMany({
                    where: {
                        OR: [
                            { studentId: userId },
                            { tutorId: userId }
                        ]
                    }
                });

                // 4. Delete sessions and accounts (typically these already have cascade if set up via auth libraries)
                await tx.session.deleteMany({ where: { userId } });
                await tx.account.deleteMany({ where: { userId } });

                // 5. Delete tutor profile and availabilities
                const profile = await tx.tutorProfile.findUnique({ where: { userId } });
                if (profile) {
                    await tx.availability.deleteMany({ where: { tutorProfileId: profile.id } });
                    await tx.tutorProfile.delete({ where: { id: profile.id } });
                }

                // 6. Finally delete the user
                await tx.user.delete({
                    where: { id: userId },
                });
            });

            res.json({
                success: true,
                message: 'Account deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }
};
