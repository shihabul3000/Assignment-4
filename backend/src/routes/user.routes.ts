import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.patch('/profile', requireAuth, userController.updateProfile);
router.patch('/change-password', requireAuth, userController.changePassword);
router.delete('/', requireAuth, userController.deleteAccount);

export default router;
