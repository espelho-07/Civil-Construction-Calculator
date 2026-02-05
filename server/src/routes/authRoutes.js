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
import { userEmailRateLimiter } from '../middleware/emailRateLimiter.js';
import {
    validate,
    signupValidation,
    loginValidation,
    forgotPasswordValidation,
    resetPasswordValidation,
    verifyEmailValidation,
} from '../middleware/validator.js';

const router = express.Router();

// CSRF token endpoint (public, for getting token)
import { addCSRFToken } from '../middleware/csrf.js';
router.get('/csrf-token', addCSRFToken, (req, res) => {
    res.json({ success: true, token: res.locals.csrfToken });
});

// Public routes
router.post('/signup', signupLimiter, signupValidation, validate, signup);
router.post('/login', authLimiter, loginValidation, validate, login);
router.post('/verify-email', verifyEmailValidation, validate, verifyEmail);
router.post('/forgot-password', passwordResetLimiter, forgotPasswordValidation, validate, forgotPassword);
router.post('/reset-password', resetPasswordValidation, validate, resetPassword);

// Token refresh (uses refresh token from cookie)
router.post('/refresh', refreshAccessToken);

// Protected routes (CSRF protection applied via middleware in app.js for authenticated routes)
router.post('/logout', optionalAuth, logout);
router.post('/logout-all', authenticateToken, logoutAll);
router.get('/me', authenticateToken, getCurrentUser);
router.post('/resend-verification', authenticateToken, userEmailRateLimiter, resendVerification);
router.put('/profile', authenticateToken, updateProfile);
router.put('/settings', authenticateToken, updateSettings);

export default router;
