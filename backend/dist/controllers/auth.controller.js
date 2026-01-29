"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_service_1 = require("../services/auth.service");
exports.authController = {
    async register(req, res, next) {
        try {
            const { email, password, name, role } = req.body;
            const result = await auth_service_1.authService.register({ email, password, name, role });
            res.status(201).json({
                success: true,
                data: result,
                message: 'User registered successfully',
            });
        }
        catch (error) {
            next(error);
        }
    },
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const result = await auth_service_1.authService.login({ email, password });
            res.json({
                success: true,
                data: result,
                message: 'Login successful',
            });
        }
        catch (error) {
            next(error);
        }
    },
    async me(req, res, next) {
        try {
            const user = req.user;
            const userData = await auth_service_1.authService.getMe(user.id);
            res.json({
                success: true,
                data: { user: userData },
            });
        }
        catch (error) {
            next(error);
        }
    },
};
