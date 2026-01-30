import { Router } from 'express';
import { tutorController } from '../controllers/tutor.controller';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

// Protected tutor routes (Must be before :id to avoid shadowing)
router.put('/profile', requireAuth, requireRole('TUTOR'), tutorController.updateProfile);
router.get('/profile/me', requireAuth, requireRole('TUTOR'), tutorController.getProfile);
router.get('/dashboard/stats', requireAuth, requireRole('TUTOR'), tutorController.getDashboardStats);
router.put('/availability', requireAuth, requireRole('TUTOR'), tutorController.updateAvailability);

// Public routes
router.get('/', tutorController.getTutors);
router.get('/:id', tutorController.getTutorById);

export default router;
