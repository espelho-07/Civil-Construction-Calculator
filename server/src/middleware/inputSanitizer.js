import { sanitizeString, sanitizeEmail, sanitizeNumber } from '../utils/inputSanitizer.js';

/**
 * Middleware to sanitize request body
 */
export function sanitizeBody(req, res, next) {
    if (req.body && typeof req.body === 'object') {
        const sanitized = { ...req.body };
        
        // Sanitize string fields
        if (sanitized.fullName) {
            sanitized.fullName = sanitizeString(sanitized.fullName, 100);
        }
        if (sanitized.email) {
            sanitized.email = sanitizeEmail(sanitized.email);
        }
        if (sanitized.phone) {
            sanitized.phone = sanitizeString(sanitized.phone, 20);
        }
        if (sanitized.name) {
            sanitized.name = sanitizeString(sanitized.name, 100);
        }
        
        // Don't sanitize password (it will be hashed)
        // Don't sanitize tokens (they're validated separately)
        
        req.body = sanitized;
    }
    
    next();
}

/**
 * Middleware to sanitize query parameters
 */
export function sanitizeQuery(req, res, next) {
    if (req.query && typeof req.query === 'object') {
        const sanitized = {};
        for (const [key, value] of Object.entries(req.query)) {
            if (typeof value === 'string') {
                sanitized[key] = sanitizeString(value, 200);
            } else {
                sanitized[key] = value;
            }
        }
        req.query = sanitized;
    }
    
    next();
}
