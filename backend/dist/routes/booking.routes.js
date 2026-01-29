"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const booking_controller_1 = require("../controllers/booking.controller");
const review_controller_1 = require("../controllers/review.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Booking routes
router.post('/', auth_1.requireAuth, booking_controller_1.bookingController.create);
router.get('/', auth_1.requireAuth, booking_controller_1.bookingController.getAll);
router.get('/:id', auth_1.requireAuth, booking_controller_1.bookingController.getById);
router.patch('/:id/status', auth_1.requireAuth, booking_controller_1.bookingController.updateStatus);
// Review routes
router.post('/:id/reviews', auth_1.requireAuth, review_controller_1.reviewController.create);
exports.default = router;
