import { useCallback } from 'react';
import { validateNumber, safeParseFloat } from '../utils/inputValidation';

/**
 * Custom hook for safe calculator input handling
 * Prevents crashes from invalid inputs
 */
export function useCalculatorInput() {
    const sanitizeInput = useCallback((value, options = {}) => {
        const result = validateNumber(value, {
            min: 0,
            max: 1000000,
            allowZero: true,
            allowNegative: false,
            allowDecimal: true,
            defaultValue: 0,
            ...options,
        });
        return result.value;
    }, []);

    const sanitizeSampleWeight = useCallback((value) => {
        return sanitizeInput(value, {
            min: 0.1,
            max: 1000000,
            allowZero: false,
        });
    }, [sanitizeInput]);

    const sanitizeRetainedWeight = useCallback((value) => {
        return sanitizeInput(value, {
            min: 0,
            max: 1000000,
            allowZero: true,
        });
    }, [sanitizeInput]);

    return {
        sanitizeInput,
        sanitizeSampleWeight,
        sanitizeRetainedWeight,
        safeParseFloat,
    };
}
