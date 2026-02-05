/**
 * Input validation utilities for calculator inputs
 * Prevents crashes from invalid inputs
 */

/**
 * Validate and sanitize numeric input for calculators
 */
export function validateNumber(value, options = {}) {
    const {
        min = 0,
        max = 1000000,
        allowZero = true,
        allowNegative = false,
        allowDecimal = true,
        defaultValue = 0,
    } = options;

    // Handle null, undefined, empty string
    if (value === null || value === undefined || value === '') {
        return { valid: false, value: defaultValue, error: 'Value is required' };
    }

    // Convert to number
    const num = typeof value === 'string' ? parseFloat(value) : Number(value);

    // Check if valid number
    if (isNaN(num) || !isFinite(num)) {
        return { valid: false, value: defaultValue, error: 'Invalid number' };
    }

    // Check zero
    if (!allowZero && num === 0) {
        return { valid: false, value: defaultValue, error: 'Zero not allowed' };
    }

    // Check negative
    if (!allowNegative && num < 0) {
        return { valid: false, value: defaultValue, error: 'Negative values not allowed' };
    }

    // Check decimal
    if (!allowDecimal && num % 1 !== 0) {
        return { valid: false, value: defaultValue, error: 'Decimal values not allowed' };
    }

    // Check bounds
    if (num < min) {
        return { valid: false, value: min, error: `Value must be at least ${min}` };
    }
    if (num > max) {
        return { valid: false, value: max, error: `Value must be at most ${max}` };
    }

    return { valid: true, value: num };
}

/**
 * Validate calculation result
 */
export function validateResult(result) {
    if (result === null || result === undefined) {
        return { valid: false, value: 0, error: 'No result' };
    }

    const num = typeof result === 'number' ? result : parseFloat(result);

    if (isNaN(num) || !isFinite(num)) {
        return { valid: false, value: 0, error: 'Invalid result' };
    }

    // Check for extremely large values (potential overflow)
    if (Math.abs(num) > 1e15) {
        return { valid: false, value: 0, error: 'Result too large' };
    }

    // Check for extremely small values (potential underflow)
    if (Math.abs(num) < 1e-10 && num !== 0) {
        return { valid: false, value: 0, error: 'Result too small' };
    }

    return { valid: true, value: num };
}

/**
 * Safe parseFloat with validation
 */
export function safeParseFloat(value, defaultValue = 0) {
    const result = validateNumber(value, {
        min: -Infinity,
        max: Infinity,
        allowNegative: true,
        allowDecimal: true,
        defaultValue,
    });
    return result.value;
}

/**
 * Clamp value between min and max
 */
export function clamp(value, min, max) {
    const num = safeParseFloat(value, min);
    return Math.max(min, Math.min(max, num));
}

/**
 * Validate percentage (0-100)
 */
export function validatePercentage(value) {
    return validateNumber(value, {
        min: 0,
        max: 100,
        allowZero: true,
        allowNegative: false,
        allowDecimal: true,
        defaultValue: 0,
    });
}

/**
 * Validate weight/quantity (positive number)
 */
export function validateWeight(value) {
    return validateNumber(value, {
        min: 0,
        max: 1000000,
        allowZero: false,
        allowNegative: false,
        allowDecimal: true,
        defaultValue: 0,
    });
}
