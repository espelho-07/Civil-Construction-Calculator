import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
    getFavorites,
    addFavorite,
    removeFavorite,
    checkFavorite,
    toggleFavorite
} from '../controllers/favoritesController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Favorites Routes
router.get('/', getFavorites);
router.post('/', addFavorite);
router.post('/toggle', toggleFavorite);
router.get('/check/:slug', checkFavorite);
router.delete('/:slug', removeFavorite);

export default router;
