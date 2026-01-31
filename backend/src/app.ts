import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

// Import routes
import authRoutes from './routes/auth.routes';
import tutorRoutes from './routes/tutor.routes';
import bookingRoutes from './routes/booking.routes';
import categoryRoutes from './routes/category.routes';
import adminRoutes from './routes/admin.routes';
import userRoutes from './routes/user.routes';

// Import middleware
import { requireAuth } from './middleware/auth';
import { userController } from './controllers/user.controller';
import { errorHandler, notFoundHandler, requestLogger } from './middleware/errorHandler';

const app = express();

// Debug logging for environment
console.log('[app.ts] Environment check:');
console.log('[app.ts] NODE_ENV:', process.env.NODE_ENV);
console.log('[app.ts] FRONTEND_URL:', process.env.FRONTEND_URL);

// CORS configuration - Allow all origins for debugging
const corsOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://skillbridge-frontend.vercel.app',
    'https://skillbridge-frontend-git-main-alubaumalus-projects.vercel.app',
    'https://frontend-gamma-orcin-61.vercel.app',
    process.env.FRONTEND_URL || ''
].filter(Boolean);

console.log('[app.ts] CORS origins:', corsOrigins);

// Middleware setup
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        console.log('[app.ts] CORS check for origin:', origin);

        // For debugging, allow all origins
        if (process.env.NODE_ENV === 'production') {
            // In production, check against allowed origins
            if (corsOrigins.includes(origin) || corsOrigins.some(allowed => origin.includes(allowed))) {
                console.log('[app.ts] CORS allowed for:', origin);
                return callback(null, true);
            }
        }

        // In development or for debugging, allow all
        console.log('[app.ts] CORS allowed (debug mode) for:', origin);
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ limit: '10mb' }));
app.use(requestLogger);

// Root route
app.get('/', (req: Request, res: Response) => {
    console.log('[Backend] Root endpoint hit');
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
            admin: '/api/admin',
            users: '/api/users'
        },
        timestamp: new Date().toISOString()
    });
});

// Health check
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tutors', tutorRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', adminRoutes);
app.delete('/api/users', requireAuth, userController.deleteAccount);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

export default app;
