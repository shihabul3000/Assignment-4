import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';
import { adminSettingsController } from '../controllers/admin-settings.controller';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

// Admin routes - require ADMIN role
router.use(requireAuth, requireRole('ADMIN'));

// User management
router.get('/users', adminController.getUsers);
router.patch('/users/:id', adminController.updateUser);

// Booking management
router.get('/bookings', adminController.getBookings);

// Category management
router.get('/categories', adminController.getCategories);
router.post('/categories', adminController.createCategory);

// Stats & Reporting
router.get('/stats', adminController.getStats);

// Platform Settings
router.get('/settings', adminSettingsController.getSettings);
router.patch('/settings', adminSettingsController.updateSettings);

export default router;
