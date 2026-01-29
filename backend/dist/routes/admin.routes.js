"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Admin routes - require ADMIN role
router.use(auth_1.requireAuth, (0, auth_1.requireRole)('ADMIN'));
// User management
router.get('/users', admin_controller_1.adminController.getUsers);
router.patch('/users/:id', admin_controller_1.adminController.updateUser);
// Booking management
router.get('/bookings', admin_controller_1.adminController.getBookings);
// Category management
router.get('/categories', admin_controller_1.adminController.getCategories);
router.post('/categories', admin_controller_1.adminController.createCategory);
exports.default = router;
