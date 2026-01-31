import { Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { AuthRequest } from '../middleware/auth';

export const authController = {
    async register(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log('[authController.register] Received registration request');
            console.log('[authController.register] Request body:', req.body);
            console.log('[authController.register] Request headers:', req.headers);

            const { email, password, name, role } = req.body;

            if (!email || !password || !name) {
                console.log('[authController.register] Missing required fields');
                res.status(400).json({
                    success: false,
                    message: 'Missing required fields: email, password, name'
                });
                return;
            }

            console.log('[authController.register] Calling authService.register');
            const result = await authService.register({ email, password, name, role });

            console.log('[authController.register] Registration successful');
            res.status(201).json({
                success: true,
                data: result,
                message: 'User registered successfully',
            });
        } catch (error) {
            console.error('[authController.register] Error during registration:', error);
            next(error);
        }
    },

    async login(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log('[authController.login] Received login request');
            console.log('[authController.login] Request body:', { email: req.body.email, password: '***' });

            const { email, password } = req.body;

            if (!email || !password) {
                console.log('[authController.login] Missing required fields');
                res.status(400).json({
                    success: false,
                    message: 'Missing required fields: email, password'
                });
                return;
            }

            const result = await authService.login({ email, password });

            console.log('[authController.login] Login successful');
            res.json({
                success: true,
                data: result,
                message: 'Login successful',
            });
        } catch (error) {
            console.error('[authController.login] Error during login:', error);
            next(error);
        }
    },

    async me(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log('[authController.me] Getting user info');
            const user = req.user;
            const userData = await authService.getMe(user.id);

            res.json({
                success: true,
                data: { user: userData },
            });
        } catch (error) {
            console.error('[authController.me] Error:', error);
            next(error);
        }
    },
};
