import prisma from '../config/database.js';

// Parse user agent
function parseUserAgent(uaString) {
    const ua = uaString.toLowerCase();

    // Browser
    let browser = 'Unknown Browser';
    if (ua.includes('edg/')) browser = 'Edge';
    else if (ua.includes('chrome')) browser = 'Chrome';
    else if (ua.includes('firefox')) browser = 'Firefox';
    else if (ua.includes('safari')) browser = 'Safari';
    else if (ua.includes('opera')) browser = 'Opera';

    // OS
    let os = 'Unknown OS';
    if (ua.includes('windows')) os = 'Windows';
    else if (ua.includes('mac os')) os = 'macOS';
    else if (ua.includes('linux')) os = 'Linux';
    else if (ua.includes('android')) os = 'Android';
    else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';

    // Device
    let device = 'Desktop';
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) device = 'Mobile';
    else if (ua.includes('tablet') || ua.includes('ipad')) device = 'Tablet';

    return { browser, os, device };
}

// Log security event
export async function logSecurityEvent(data) {
    try {
        // Log to SecurityLog (audit trail)
        await prisma.securityLog.create({
            data: {
                userId: data.userId || null,
                action: data.action,
                ipAddress: data.ipAddress || null,
                userAgent: data.userAgent || null,
                status: data.status,
                details: data.details || null,
            },
        });

        // Also log to LoginHistory for user visibility
        if (data.userId && (
            data.action === SecurityActions.LOGIN ||
            data.action === SecurityActions.FAILED_LOGIN ||
            data.action === SecurityActions.LOGOUT_ALL
        )) {
            const { browser, os, device } = parseUserAgent(data.userAgent || '');

            await prisma.loginHistory.create({
                data: {
                    userId: data.userId,
                    ipAddress: data.ipAddress || null,
                    userAgent: data.userAgent || null,
                    device,
                    browser,
                    os,
                    status: data.status,
                    failReason: data.status === 'FAILED' ? (data.details || 'Login failed') : null,
                }
            });
        }
    } catch (error) {
        console.error('Security log failed:', error.message);
    }
}

// Security action types
export const SecurityActions = {
    SIGNUP: 'SIGNUP',
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    LOGOUT_ALL: 'LOGOUT_ALL',
    PASSWORD_RESET_REQUEST: 'PASSWORD_RESET_REQUEST',
    PASSWORD_RESET_COMPLETE: 'PASSWORD_RESET_COMPLETE',
    EMAIL_VERIFICATION: 'EMAIL_VERIFICATION',
    ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
    ACCOUNT_UNLOCKED: 'ACCOUNT_UNLOCKED',
    FAILED_LOGIN: 'FAILED_LOGIN',
    TOKEN_REFRESH: 'TOKEN_REFRESH',
    PROFILE_UPDATE: 'PROFILE_UPDATE',
    SETTINGS_UPDATE: 'SETTINGS_UPDATE',
};

// Security status types
export const SecurityStatus = {
    SUCCESS: 'SUCCESS',
    FAILED: 'FAILED',
    BLOCKED: 'BLOCKED',
};

// Get client IP from request
export function getClientIp(req) {
    return req.ip ||
        req.headers['x-forwarded-for']?.split(',')[0] ||
        req.connection?.remoteAddress ||
        'unknown';
}

// Get user agent from request
export function getUserAgent(req) {
    return req.headers['user-agent'] || 'unknown';
}
