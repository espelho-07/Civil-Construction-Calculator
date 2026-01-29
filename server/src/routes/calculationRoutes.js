import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
    getCalculations,
    getCalculation,
    saveCalculation,
    updateCalculation,
    deleteCalculation,
    getCalculationStats
} from '../controllers/calculationController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Calculation Routes
router.get('/', getCalculations);
router.get('/stats', getCalculationStats);
router.get('/:id', getCalculation);
router.post('/', saveCalculation);
router.put('/:id', updateCalculation);
router.delete('/:id', deleteCalculation);

export default router;
