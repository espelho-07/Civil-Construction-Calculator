import { v4 as uuidv4 } from 'uuid';

// CSRF token storage (in production, use Redis or session store)
const csrfTokens = new Map();

// Generate CSRF token
export function generateCSRFToken() {
    const token = uuidv4();
    const expiresAt = Date.now() + 3600000; // 1 hour
    
    csrfTokens.set(token, expiresAt);
    
    // Cleanup expired tokens every 10 minutes
    if (csrfTokens.size > 1000) {
        cleanupExpiredTokens();
    }
    
    return token;
}

// Verify CSRF token
export function verifyCSRFToken(token) {
    if (!token) return false;
    
    const expiresAt = csrfTokens.get(token);
    if (!expiresAt) return false;
    
    if (Date.now() > expiresAt) {
        csrfTokens.delete(token);
        return false;
    }
    
    return true;
}

// Invalidate CSRF token (use once)
export function invalidateCSRFToken(token) {
    csrfTokens.delete(token);
}

// Cleanup expired tokens
function cleanupExpiredTokens() {
    const now = Date.now();
    for (const [token, expiresAt] of csrfTokens.entries()) {
        if (now > expiresAt) {
            csrfTokens.delete(token);
        }
    }
}

// CSRF middleware for protected routes
export function csrfProtection(req, res, next) {
    // Skip CSRF for GET, HEAD, OPTIONS
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        return next();
    }
    
    // Get token from header or body
    const token = req.headers['x-csrf-token'] || req.body._csrf;
    
    if (!verifyCSRFToken(token)) {
        return res.status(403).json({
            success: false,
            message: 'Invalid or missing CSRF token',
            code: 'CSRF_TOKEN_INVALID',
        });
    }
    
    // Invalidate token after use (double-submit pattern)
    invalidateCSRFToken(token);
    
    next();
}

// Middleware to add CSRF token to response
export function addCSRFToken(req, res, next) {
    // Only add token for GET requests (to avoid token generation on every request)
    if (req.method === 'GET') {
        const token = generateCSRFToken();
        res.locals.csrfToken = token;
        res.setHeader('X-CSRF-Token', token);
    }
    next();
}
