"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tutor_controller_1 = require("../controllers/tutor.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public routes
router.get('/', tutor_controller_1.tutorController.getTutors);
router.get('/:id', tutor_controller_1.tutorController.getTutorById);
// Protected tutor routes
router.put('/profile', auth_1.requireAuth, (0, auth_1.requireRole)('TUTOR'), tutor_controller_1.tutorController.updateProfile);
router.get('/profile/me', auth_1.requireAuth, (0, auth_1.requireRole)('TUTOR'), tutor_controller_1.tutorController.getProfile);
router.put('/availability', auth_1.requireAuth, (0, auth_1.requireRole)('TUTOR'), tutor_controller_1.tutorController.updateAvailability);
exports.default = router;
