import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

// Import routes
import authRoutes from './routes/auth.routes';
import tutorRoutes from './routes/tutor.routes';
import bookingRoutes from './routes/booking.routes';
import categoryRoutes from './routes/category.routes';
import adminRoutes from './routes/admin.routes';

// Import middleware
import { errorHandler, notFoundHandler, requestLogger } from './middleware/errorHandler';

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(requestLogger);

// Root route
app.get('/', (req: Request, res: Response) => {
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
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tutors', tutorRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', adminRoutes);

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler as unknown as (err: Error, req: Request, res: Response, next: NextFunction) => void);

export default app;
