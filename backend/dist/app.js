"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// Import routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const tutor_routes_1 = __importDefault(require("./routes/tutor.routes"));
const booking_routes_1 = __importDefault(require("./routes/booking.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
// Import middleware
const errorHandler_1 = require("./middleware/errorHandler");
const app = (0, express_1.default)();
// Middleware setup
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.use(errorHandler_1.requestLogger);
// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'SkillBridge API',
        version: '1.0.0',
        status: 'running',
        endpoints: {
            health: '/health',
            auth: '/api/auth',
            tutors: '/api/tutors',
            bookings: '/api/bookings',
            categories: '/api/categories',
            admin: '/api/admin'
        },
        timestamp: new Date().toISOString()
    });
});
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// API Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/tutors', tutor_routes_1.default);
app.use('/api/bookings', booking_routes_1.default);
app.use('/api/categories', category_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
// Error handlers
app.use(errorHandler_1.notFoundHandler);
app.use(errorHandler_1.errorHandler);
exports.default = app;
