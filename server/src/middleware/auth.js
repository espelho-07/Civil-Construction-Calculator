import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import prisma from '../config/database.js';

// Verify JWT Access Token
export async function authenticateToken(req, res, next) {
    try {
        // Get token from cookie or Authorization header
        const token = req.cookies?.accessToken ||
            req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access token required',
            });
        }

        // Verify token
        const decoded = jwt.verify(token, config.jwt.accessSecret);

        // Get user from database
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            include: { role: true },
        });

        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'User not found or inactive',
            });
        }

        // Attach user to request
        req.user = {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            role: user.role.name,
            isEmailVerified: user.isEmailVerified,
        };

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired',
                code: 'TOKEN_EXPIRED',
            });
        }
        return res.status(401).json({
            success: false,
            message: 'Invalid token',
        });
    }
}

// Optional authentication (doesn't fail if no token)
export async function optionalAuth(req, res, next) {
    try {
        const token = req.cookies?.accessToken ||
            req.headers.authorization?.replace('Bearer ', '');

        if (token) {
            const decoded = jwt.verify(token, config.jwt.accessSecret);
            const user = await prisma.user.findUnique({
                where: { id: decoded.userId },
                include: { role: true },
            });

            if (user && user.isActive) {
                req.user = {
                    id: user.id,
                    email: user.email,
                    fullName: user.fullName,
                    role: user.role.name,
                    isEmailVerified: user.isEmailVerified,
                };
            }
        }
        next();
    } catch {
        next();
    }
}

// Role-based authorization
export function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required',
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Insufficient permissions',
            });
        }

        next();
    };
}

// Require email verification
export function requireVerifiedEmail(req, res, next) {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
    }

    if (!req.user.isEmailVerified) {
        return res.status(403).json({
            success: false,
            message: 'Email verification required',
            code: 'EMAIL_NOT_VERIFIED',
        });
    }

    next();
}
