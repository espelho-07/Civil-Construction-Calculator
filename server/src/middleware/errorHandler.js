import config from '../config/env.js';

/**
 * Sanitize error for logging (remove sensitive data)
 */
export function sanitizeError(error) {
    const sanitized = {
        message: error.message || 'Unknown error',
        name: error.name || 'Error',
        stack: config.nodeEnv === 'development' ? error.stack : undefined,
    };
    
    // Remove sensitive fields
    const sensitiveFields = ['password', 'passwordHash', 'token', 'secret', 'key', 'apiKey'];
    
    if (error.data) {
        sanitized.data = { ...error.data };
        for (const field of sensitiveFields) {
            if (sanitized.data[field]) {
                sanitized.data[field] = '[REDACTED]';
            }
        }
    }
    
    return sanitized;
}

/**
 * Enhanced error handler middleware
 */
export function errorHandler(err, req, res, next) {
    // Log error (sanitized)
    const sanitizedError = sanitizeError(err);
    console.error('Server Error:', sanitizedError);
    
    // Determine status code
    const statusCode = err.statusCode || err.status || 500;
    
    // Prepare response
    const response = {
        success: false,
        message: config.nodeEnv === 'production'
            ? 'An error occurred. Please try again later.'
            : err.message || 'Internal server error',
    };
    
    // Add error code if available
    if (err.code) {
        response.code = err.code;
    }
    
    // Add validation errors if present
    if (err.errors && Array.isArray(err.errors)) {
        response.errors = err.errors;
    }
    
    // Never expose stack traces in production
    if (config.nodeEnv !== 'production' && err.stack) {
        response.stack = err.stack;
    }
    
    res.status(statusCode).json(response);
}

/**
 * Async error wrapper
 */
export function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

/**
 * Create custom error
 */
export class AppError extends Error {
    constructor(message, statusCode = 500, code = null) {
        super(message);
        this.statusCode = statusCode;
        this.status = statusCode;
        this.code = code;
        this.isOperational = true;
        
        Error.captureStackTrace(this, this.constructor);
    }
}
