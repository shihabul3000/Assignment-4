"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = exports.notFoundHandler = exports.errorHandler = void 0;
const errors_1 = require("../utils/errors");
const config_1 = require("../config");
const errorResponse = (res, error, req) => {
    const response = {
        success: false,
        error: {
            message: error.message,
            code: error.errorCode,
        },
        timestamp: new Date().toISOString(),
    };
    if (config_1.config.nodeEnv === 'development') {
        response.error.details = error.stack;
        response.path = req?.path;
    }
    return res.status(error.statusCode).json(response);
};
const errorHandler = (err, req, res, next) => {
    console.error('Error:', {
        name: err.name,
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        timestamp: new Date().toISOString(),
    });
    // Handle known error types
    if (err instanceof errors_1.AppError) {
        errorResponse(res, err, req);
        return;
    }
    // Handle Prisma errors
    if (err.name === 'PrismaClientKnownRequestError') {
        const prismaError = err;
        // Handle unique constraint violations
        if (prismaError.code === 'P2002') {
            const field = prismaError.meta?.target?.[0] || 'field';
            errorResponse(res, new errors_1.ConflictError(`${field} already exists`), req);
            return;
        }
        // Handle record not found
        if (prismaError.code === 'P2025') {
            errorResponse(res, new errors_1.NotFoundError('Record'), req);
            return;
        }
    }
    // Handle validation errors from body-parser
    if (err.type === 'entity.parse.failed') {
        errorResponse(res, new errors_1.ValidationError('Invalid JSON in request body'), req);
        return;
    }
    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        errorResponse(res, new errors_1.ValidationError('Invalid token'), req);
        return;
    }
    if (err.name === 'TokenExpiredError') {
        errorResponse(res, new errors_1.ValidationError('Token expired'), req);
        return;
    }
    // Handle unknown errors
    errorResponse(res, new errors_1.AppError(config_1.config.nodeEnv === 'development' ? err.message : 'An unexpected error occurred', 500), req);
};
exports.errorHandler = errorHandler;
const notFoundHandler = (req, res) => {
    console.log(`404 Not Found: ${req.method} ${req.path} from ${req.get('User-Agent')} origin: ${req.get('Origin')}`);
    res.status(404).json({
        success: false,
        error: {
            message: `Route ${req.method} ${req.path} not found`,
            code: 'NOT_FOUND',
        },
        timestamp: new Date().toISOString(),
    });
};
exports.notFoundHandler = notFoundHandler;
const requestLogger = (req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
};
exports.requestLogger = requestLogger;
