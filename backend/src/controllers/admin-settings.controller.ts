import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { ValidationError, NotFoundError } from '../utils/errors';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const adminSettingsController = {
    async getSettings(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            let settings = await prisma.platformSettings.findFirst({
                where: { id: 1 }
            });

            if (!settings) {
                // Initialize if not exists
                settings = await prisma.platformSettings.create({
                    data: {
                        id: 1,
                        maintenanceMode: false,
                        platformFee: 10.0,
                        emailNotifications: true,
                        autoApproveTutors: false
                    }
                });
            }

            res.json({
                success: true,
                data: settings
            });
        } catch (error) {
            next(error);
        }
    },

    async updateSettings(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { maintenanceMode, platformFee, emailNotifications, autoApproveTutors } = req.body;

            if (platformFee !== undefined && (platformFee < 0 || platformFee > 100)) {
                throw new ValidationError('Platform fee must be between 0 and 100');
            }

            const settings = await prisma.platformSettings.upsert({
                where: { id: 1 },
                update: {
                    ...(maintenanceMode !== undefined && { maintenanceMode }),
                    ...(platformFee !== undefined && { platformFee }),
                    ...(emailNotifications !== undefined && { emailNotifications }),
                    ...(autoApproveTutors !== undefined && { autoApproveTutors })
                },
                create: {
                    id: 1,
                    maintenanceMode: maintenanceMode || false,
                    platformFee: platformFee || 10.0,
                    emailNotifications: emailNotifications !== undefined ? emailNotifications : true,
                    autoApproveTutors: autoApproveTutors || false
                }
            });

            res.json({
                success: true,
                data: settings,
                message: 'Platform settings updated successfully'
            });
        } catch (error) {
            next(error);
        }
    }
};
