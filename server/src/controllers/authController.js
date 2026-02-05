import bcrypt from 'bcryptjs';
import prisma from '../config/database.js';
import config from '../config/env.js';
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
    invalidateRefreshToken,
    invalidateAllUserTokens,
    generateEmailVerificationToken,
    verifyEmailToken,
    generatePasswordResetToken,
    verifyAndConsumePasswordResetToken,
} from '../services/tokenService.js';
import { sendEmail } from '../services/emailService.js';
import {
    logSecurityEvent,
    SecurityActions,
    SecurityStatus,
    getClientIp,
    getUserAgent,
} from '../services/securityService.js';

// Cookie options
const cookieOptions = {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// Cookie clear options (must match path/domain used when setting cookies so browser clears them)
const clearCookieOptions = {
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
    secure: config.nodeEnv === 'production',
};

/**
 * POST /api/auth/signup
 * Register a new user
 */
export async function signup(req, res) {
    try {
        const { fullName, email, password, phone } = req.body;

        // Check if email already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Email already registered',
            });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, config.bcryptRounds);

        // Create user
        const user = await prisma.user.create({
            data: {
                fullName,
                email,
                passwordHash,
                phone: phone || null,
                roleId: 2, // Default to 'user' role
            },
            include: { role: true },
        });

        // Generate email verification token
        const verificationToken = await generateEmailVerificationToken(user.id);
        const verificationUrl = `${config.clientUrl}/verify-email?token=${verificationToken}`;

        // Send verification email
        await sendEmail(email, 'emailVerification', [fullName, verificationUrl]);

        // Log security event
        await logSecurityEvent({
            userId: user.id,
            action: SecurityActions.SIGNUP,
            ipAddress: getClientIp(req),
            userAgent: getUserAgent(req),
            status: SecurityStatus.SUCCESS,
        });

        // Generate tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = await generateRefreshToken(user.id);

        // Set cookies
        res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 }); // 15 min
        res.cookie('refreshToken', refreshToken, cookieOptions);

        return res.status(201).json({
            success: true,
            message: 'Account created successfully. Please verify your email.',
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: user.role.name,
                isEmailVerified: user.isEmailVerified,
            },
        });
    } catch (error) {
        console.error('Signup error:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred during registration',
        });
    }
}

/**
 * POST /api/auth/login
 * User login
 */
export async function login(req, res) {
    try {
        const { email, password, rememberMe } = req.body;

        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
            include: { role: true },
        });

        if (!user) {
            await logSecurityEvent({
                action: SecurityActions.FAILED_LOGIN,
                ipAddress: getClientIp(req),
                userAgent: getUserAgent(req),
                status: SecurityStatus.FAILED,
                details: `Unknown email: ${email}`,
            });

            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        // Check if account is locked
        if (user.lockedUntil && user.lockedUntil > new Date()) {
            const unlockTime = user.lockedUntil.toLocaleString();
            return res.status(423).json({
                success: false,
                message: `Account locked until ${unlockTime}`,
                code: 'ACCOUNT_LOCKED',
            });
        }

        // Check if account is active
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Account is deactivated',
            });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.passwordHash);

        if (!isValidPassword) {
            // Increment failed login count
            const newFailedCount = user.failedLoginCount + 1;
            let lockedUntil = null;

            // Lock account if too many failures
            if (newFailedCount >= config.maxLoginAttempts) {
                lockedUntil = new Date(Date.now() + config.lockoutDuration);

                // Send account locked email
                await sendEmail(email, 'accountLocked', [
                    user.fullName,
                    lockedUntil.toLocaleString(),
                ]);

                await logSecurityEvent({
                    userId: user.id,
                    action: SecurityActions.ACCOUNT_LOCKED,
                    ipAddress: getClientIp(req),
                    userAgent: getUserAgent(req),
                    status: SecurityStatus.BLOCKED,
                });
            }

            await prisma.user.update({
                where: { id: user.id },
                data: {
                    failedLoginCount: newFailedCount,
                    lockedUntil,
                },
            });

            await logSecurityEvent({
                userId: user.id,
                action: SecurityActions.FAILED_LOGIN,
                ipAddress: getClientIp(req),
                userAgent: getUserAgent(req),
                status: SecurityStatus.FAILED,
            });

            const remainingAttempts = config.maxLoginAttempts - newFailedCount;
            return res.status(401).json({
                success: false,
                message: remainingAttempts > 0
                    ? `Invalid password. ${remainingAttempts} attempts remaining.`
                    : 'Account locked due to too many failed attempts.',
            });
        }

        // Successful login - reset failed count
        await prisma.user.update({
            where: { id: user.id },
            data: {
                failedLoginCount: 0,
                lockedUntil: null,
                lastLoginAt: new Date(),
            },
        });

        // Generate tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = await generateRefreshToken(user.id);

        // Log security event
        await logSecurityEvent({
            userId: user.id,
            action: SecurityActions.LOGIN,
            ipAddress: getClientIp(req),
            userAgent: getUserAgent(req),
            status: SecurityStatus.SUCCESS,
        });

        // Set cookies
        const refreshMaxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
        res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
        res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: refreshMaxAge });

        return res.json({
            success: true,
            message: 'Login successful',
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: user.role.name,
                isEmailVerified: user.isEmailVerified,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred during login',
        });
    }
}

/**
 * POST /api/auth/logout
 * User logout
 */
export async function logout(req, res) {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (refreshToken) {
            await invalidateRefreshToken(refreshToken);
        }

        // Log security event
        if (req.user) {
            await logSecurityEvent({
                userId: req.user.id,
                action: SecurityActions.LOGOUT,
                ipAddress: getClientIp(req),
                userAgent: getUserAgent(req),
                status: SecurityStatus.SUCCESS,
            });
        }

        // Clear cookies (same path/options as set so browser removes them)
        res.clearCookie('accessToken', clearCookieOptions);
        res.clearCookie('refreshToken', clearCookieOptions);

        return res.json({
            success: true,
            message: 'Logged out successfully',
        });
    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred during logout',
        });
    }
}

/**
 * POST /api/auth/logout-all
 * Invalidate all user sessions
 */
export async function logoutAll(req, res) {
    try {
        const userId = req.user.id;

        // Invalidate all tokens for user
        await invalidateAllUserTokens(userId);

        // Log security event
        await logSecurityEvent({
            userId,
            action: SecurityActions.LOGOUT_ALL,
            ipAddress: getClientIp(req),
            userAgent: getUserAgent(req),
            status: SecurityStatus.SUCCESS,
            details: 'Logged out from all devices'
        });

        // Clear cookies (same path/options as set so browser removes them)
        res.clearCookie('accessToken', clearCookieOptions);
        res.clearCookie('refreshToken', clearCookieOptions);

        return res.json({
            success: true,
            message: 'Logged out from all devices successfully'
        });
    } catch (error) {
        console.error('Logout all error:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred during logout'
        });
    }
}

/**
 * POST /api/auth/refresh
 * Refresh access token
 */
export async function refreshAccessToken(req, res) {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'Refresh token required',
            });
        }

        const user = await verifyRefreshToken(refreshToken);

        if (!user) {
            res.clearCookie('accessToken', clearCookieOptions);
            res.clearCookie('refreshToken', clearCookieOptions);
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired refresh token',
            });
        }

        // Generate new tokens (token rotation)
        const accessToken = generateAccessToken(user);
        const newRefreshToken = await generateRefreshToken(user.id);

        // Set new tokens
        res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
        res.cookie('refreshToken', newRefreshToken, cookieOptions);

        return res.json({
            success: true,
            message: 'Token refreshed',
        });
    } catch (error) {
        console.error('Refresh token error:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred',
        });
    }
}

/**
 * GET /api/auth/me
 * Get current user
 */
export async function getCurrentUser(req, res) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            include: { role: true },
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        return res.json({
            success: true,
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                role: user.role.name,
                isEmailVerified: user.isEmailVerified,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error('Get user error:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred',
        });
    }
}

/**
 * POST /api/auth/verify-email
 * Verify email with token
 */
export async function verifyEmail(req, res) {
    try {
        const { token } = req.body;

        const user = await verifyEmailToken(token);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired verification link',
            });
        }

        // Log security event
        await logSecurityEvent({
            userId: user.id,
            action: SecurityActions.EMAIL_VERIFICATION,
            ipAddress: getClientIp(req),
            userAgent: getUserAgent(req),
            status: SecurityStatus.SUCCESS,
        });

        return res.json({
            success: true,
            message: 'Email verified successfully',
        });
    } catch (error) {
        console.error('Email verification error:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred',
        });
    }
}

/**
 * POST /api/auth/resend-verification
 * Resend verification email
 */
export async function resendVerification(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required',
            });
        }

        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
        });

        if (user.isEmailVerified) {
            return res.status(400).json({
                success: false,
                message: 'Email already verified',
            });
        }

        // Check last verification email sent time (prevent spam)
        const lastToken = await prisma.emailVerificationToken.findFirst({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
        });

        if (lastToken) {
            const timeSinceLastEmail = Date.now() - lastToken.createdAt.getTime();
            const minInterval = 60 * 1000; // 1 minute minimum between emails
            
            if (timeSinceLastEmail < minInterval) {
                return res.status(429).json({
                    success: false,
                    message: 'Please wait before requesting another verification email',
                });
            }
        }

        const verificationToken = await generateEmailVerificationToken(user.id);
        const verificationUrl = `${config.clientUrl}/verify-email?token=${verificationToken}`;

        await sendEmail(user.email, 'emailVerification', [user.fullName, verificationUrl]);

        return res.json({
            success: true,
            message: 'Verification email sent',
        });
    } catch (error) {
        console.error('Resend verification error:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred',
        });
    }
}

/**
 * POST /api/auth/forgot-password
 * Request password reset
 */
export async function forgotPassword(req, res) {
    try {
        const { email } = req.body;

        // Always return success to prevent email enumeration
        const successResponse = {
            success: true,
            message: 'If an account exists with this email, you will receive a password reset link.',
        };

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.json(successResponse);
        }

        const resetToken = await generatePasswordResetToken(user.id);
        const resetUrl = `${config.clientUrl}/reset-password?token=${resetToken}`;

        await sendEmail(email, 'passwordReset', [user.fullName, resetUrl]);

        // Log security event
        await logSecurityEvent({
            userId: user.id,
            action: SecurityActions.PASSWORD_RESET_REQUEST,
            ipAddress: getClientIp(req),
            userAgent: getUserAgent(req),
            status: SecurityStatus.SUCCESS,
        });

        return res.json(successResponse);
    } catch (error) {
        console.error('Forgot password error:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred',
        });
    }
}

/**
 * POST /api/auth/reset-password
 * Reset password with token
 */
export async function resetPassword(req, res) {
    try {
        const { token, password } = req.body;

        // Verify and consume token atomically
        const resetToken = await verifyAndConsumePasswordResetToken(token);

        if (!resetToken) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset link',
            });
        }

        // Hash new password
        const passwordHash = await bcrypt.hash(password, config.bcryptRounds);

        // Update password
        await prisma.user.update({
            where: { id: resetToken.userId },
            data: {
                passwordHash,
                failedLoginCount: 0,
                lockedUntil: null,
            },
        });

        // Invalidate all refresh tokens (logout all devices)
        await invalidateAllUserTokens(resetToken.userId);

        // Log security event
        await logSecurityEvent({
            userId: resetToken.userId,
            action: SecurityActions.PASSWORD_RESET_COMPLETE,
            ipAddress: getClientIp(req),
            userAgent: getUserAgent(req),
            status: SecurityStatus.SUCCESS,
        });

        return res.json({
            success: true,
            message: 'Password reset successfully. Please login with your new password.',
        });
    } catch (error) {
        console.error('Reset password error:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred',
        });
    }
}

/**
 * PUT /api/auth/profile
 * Update user profile
 */
export async function updateProfile(req, res) {
    try {
        const { name, phone } = req.body;

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required',
            });
        }

        // Validate name
        if (name && (name.length < 2 || name.length > 100)) {
            return res.status(400).json({
                success: false,
                message: 'Name must be between 2 and 100 characters',
            });
        }

        // Update user profile
        const user = await prisma.user.update({
            where: { id: req.user.id },
            data: {
                fullName: name || undefined,
                phone: phone || null,
            },
            include: { role: true },
        });

        // Log security event
        await logSecurityEvent({
            userId: user.id,
            action: SecurityActions.PROFILE_UPDATE,
            ipAddress: getClientIp(req),
            userAgent: getUserAgent(req),
            status: SecurityStatus.SUCCESS,
        });

        return res.json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                role: user.role.name,
                isEmailVerified: user.isEmailVerified,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error('Update profile error:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred',
        });
    }
}

/**
 * PUT /api/auth/settings
 * Update user settings (stored in localStorage on client, but can be synced)
 */
export async function updateSettings(req, res) {
    try {
        // Settings are stored on client side in localStorage
        // This endpoint is for optional cloud sync
        return res.json({
            success: true,
            message: 'Settings synced successfully',
        });
    } catch (error) {
        console.error('Update settings error:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred',
        });
    }
}
