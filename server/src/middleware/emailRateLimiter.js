import rateLimit from 'express-rate-limit';
import { getClientIp } from '../services/securityService.js';

// Email rate limiter per IP
export const emailRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 emails per hour per IP
    message: {
        success: false,
        message: 'Too many email requests. Please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        // Rate limit by IP + email combination
        const email = req.body?.email || 'unknown';
        const ip = getClientIp(req);
        return `email:${ip}:${email}`;
    },
    skipSuccessfulRequests: false,
});

// Email rate limiter per user (for authenticated users)
export const userEmailRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 emails per hour per user
    message: {
        success: false,
        message: 'Too many email requests. Please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        // Rate limit by user ID
        return `email:user:${req.user?.id || 'anonymous'}`;
    },
    skipSuccessfulRequests: false,
});
