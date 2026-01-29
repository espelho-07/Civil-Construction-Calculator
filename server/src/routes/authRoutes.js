import express from 'express';
import {
    signup,
    login,
    logout,
    logoutAll,
    refreshAccessToken,
    getCurrentUser,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
    updateProfile,
    updateSettings,
} from '../controllers/authController.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import {
    authLimiter,
    signupLimiter,
    passwordResetLimiter,
} from '../middleware/rateLimiter.js';
import {
    validate,
    signupValidation,
    loginValidation,
    forgotPasswordValidation,
    resetPasswordValidation,
    verifyEmailValidation,
} from '../middleware/validator.js';

const router = express.Router();

// Public routes
router.post('/signup', signupLimiter, signupValidation, validate, signup);
router.post('/login', authLimiter, loginValidation, validate, login);
router.post('/verify-email', verifyEmailValidation, validate, verifyEmail);
router.post('/forgot-password', passwordResetLimiter, forgotPasswordValidation, validate, forgotPassword);
router.post('/reset-password', resetPasswordValidation, validate, resetPassword);

// Token refresh (uses refresh token from cookie)
router.post('/refresh', refreshAccessToken);

// Protected routes
router.post('/logout', optionalAuth, logout);
router.post('/logout-all', authenticateToken, logoutAll);
router.get('/me', authenticateToken, getCurrentUser);
router.post('/resend-verification', authenticateToken, resendVerification);
router.put('/profile', authenticateToken, updateProfile);
router.put('/settings', authenticateToken, updateSettings);

export default router;
