// Input sanitization utilities

/**
 * Sanitize string input - remove dangerous characters
 */
export function sanitizeString(input, maxLength = 1000) {
    if (typeof input !== 'string') return '';
    
    // Truncate if too long
    if (input.length > maxLength) {
        input = input.substring(0, maxLength);
    }
    
    // Remove null bytes and control characters (except newlines and tabs)
    input = input.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');
    
    // Trim whitespace
    input = input.trim();
    
    return input;
}

/**
 * Sanitize email
 */
export function sanitizeEmail(email) {
    if (typeof email !== 'string') return '';
    
    // Basic email sanitization (express-validator handles format)
    return email.trim().toLowerCase();
}

/**
 * Sanitize and validate numeric input for calculators
 */
export function sanitizeNumber(value, options = {}) {
    const {
        min = -Infinity,
        max = Infinity,
        allowZero = true,
        allowNegative = false,
        defaultValue = 0,
    } = options;
    
    // Handle null, undefined, empty string
    if (value === null || value === undefined || value === '') {
        return defaultValue;
    }
    
    // Convert to number
    const num = typeof value === 'string' ? parseFloat(value) : Number(value);
    
    // Check if valid number
    if (isNaN(num) || !isFinite(num)) {
        return defaultValue;
    }
    
    // Check zero
    if (!allowZero && num === 0) {
        return defaultValue;
    }
    
    // Check negative
    if (!allowNegative && num < 0) {
        return defaultValue;
    }
    
    // Clamp to min/max
    if (num < min) return min;
    if (num > max) return max;
    
    return num;
}

/**
 * Sanitize calculator inputs object
 */
export function sanitizeCalculatorInputs(inputs, schema) {
    const sanitized = {};
    
    for (const [key, value] of Object.entries(inputs)) {
        if (schema[key]) {
            sanitized[key] = sanitizeNumber(value, schema[key]);
        } else {
            // Unknown field - sanitize as number with safe defaults
            sanitized[key] = sanitizeNumber(value, {
                min: 0,
                max: 1000000,
                allowNegative: false,
            });
        }
    }
    
    return sanitized;
}

/**
 * Validate calculation results
 */
export function validateCalculationResult(result) {
    if (result === null || result === undefined) {
        return { valid: false, value: 0 };
    }
    
    const num = typeof result === 'number' ? result : parseFloat(result);
    
    if (isNaN(num) || !isFinite(num)) {
        return { valid: false, value: 0 };
    }
    
    // Check for extremely large values (potential overflow)
    if (Math.abs(num) > 1e15) {
        return { valid: false, value: 0, error: 'Result too large' };
    }
    
    return { valid: true, value: num };
}

/**
 * Sanitize HTML (for user-generated content)
 */
export function sanitizeHTML(html) {
    if (typeof html !== 'string') return '';
    
    // Remove script tags and event handlers
    return html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/data:text\/html/gi, '');
}
