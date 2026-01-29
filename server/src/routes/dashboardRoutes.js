import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
    getDashboard,
    getProfile,
    updateProfile,
    getPreferences,
    updatePreferences,
    getLoginHistory
} from '../controllers/dashboardController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Dashboard
router.get('/', getDashboard);

// Profile
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Preferences
router.get('/preferences', getPreferences);
router.put('/preferences', updatePreferences);

// Login History (Security)
router.get('/login-history', getLoginHistory);

export default router;
