import type { Request, Response } from 'express';
import app from '../src/app';

// Export a handler that works with Vercel's serverless functions
// Using Express app directly as a handler
export default function handler(req: Request, res: Response) {
    return app(req, res);
}
