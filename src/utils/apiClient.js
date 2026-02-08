/**
 * API Client Utility with Timeout & Error Handling
 * Wraps all async API calls with configurable timeout
 */

const DEFAULT_TIMEOUT = 15000; // 15 seconds

/**
 * Wraps a promise with a timeout
 * @param {Promise} promise - The promise to wrap
 * @param {number} timeoutMs - Timeout duration in milliseconds
 * @returns {Promise} - The promise that resolves/rejects first
 */
export const withTimeout = (promise, timeoutMs = DEFAULT_TIMEOUT) => {
    return Promise.race([
        promise,
        new Promise((_, reject) =>
            setTimeout(() => {
                reject(new Error(`Request timeout after ${timeoutMs}ms`));
            }, timeoutMs)
        )
    ]);
};

/**
 * Makes an API call with timeout and error handling
 * @param {Function} apiCall - Async function that makes the API call
 * @param {string} operationName - Name of operation for logging
 * @param {number} timeoutMs - Custom timeout (uses default if not provided)
 * @returns {Promise<{data, error}>} - Standard response format
 */
export const safeApiCall = async (apiCall, operationName = 'API Call', timeoutMs = DEFAULT_TIMEOUT) => {
    try {
        const data = await withTimeout(apiCall(), timeoutMs);
        return { data, error: null };
    } catch (error) {
        console.error(`${operationName} failed:`, error);
        return {
            data: null,
            error: {
                message: error.message || 'Unknown error occurred',
                code: error.code,
                isTimeout: error.message?.includes('timeout'),
                originalError: error
            }
        };
    }
};

/**
 * Batch API calls with timeout protection
 * @param {Array} calls - Array of {fn, name, timeout?}
 * @returns {Promise<Array>} - Array of results
 */
export const batchApiCalls = async (calls) => {
    return Promise.all(
        calls.map(({ fn, name = 'Batch Call', timeout = DEFAULT_TIMEOUT }) =>
            safeApiCall(fn, name, timeout)
        )
    );
};

/**
 * Retry function with exponential backoff
 * @param {Function} fn - Async function to retry
 * @param {number} maxRetries - Maximum retry attempts
 * @param {number} initialDelayMs - Initial delay between retries
 * @returns {Promise} - Result of successful attempt
 */
export const retryWithBackoff = async (
    fn,
    maxRetries = 3,
    initialDelayMs = 1000
) => {
    let lastError;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await withTimeout(fn(), DEFAULT_TIMEOUT);
        } catch (error) {
            lastError = error;
            if (attempt < maxRetries - 1) {
                const delayMs = initialDelayMs * Math.pow(2, attempt);
                console.warn(`Attempt ${attempt + 1} failed, retrying in ${delayMs}ms...`, error);
                await new Promise(resolve => setTimeout(resolve, delayMs));
            }
        }
    }

    throw lastError;
};

/**
 * Debounced API call - prevents rapid repeated calls
 * @param {Function} fn - Async function to debounce
 * @param {number} delayMs - Debounce delay
 * @returns {Function} - Debounced function
 */
export const debounceApiCall = (fn, delayMs = 500) => {
    let timeoutId;
    let result;

    return async function debouncedCall(...args) {
        return new Promise((resolve, reject) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(async () => {
                try {
                    result = await withTimeout(fn(...args), DEFAULT_TIMEOUT);
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            }, delayMs);
        });
    };
};

/**
 * Throttled API call - limits call frequency
 * @param {Function} fn - Async function to throttle
 * @param {number} minIntervalMs - Minimum interval between calls
 * @returns {Function} - Throttled function
 */
export const throttleApiCall = (fn, minIntervalMs = 1000) => {
    let lastCallTime = 0;
    let lastResult;

    return async function throttledCall(...args) {
        const now = Date.now();
        const timeSinceLastCall = now - lastCallTime;

        if (timeSinceLastCall >= minIntervalMs) {
            lastCallTime = now;
            lastResult = await withTimeout(fn(...args), DEFAULT_TIMEOUT);
            return lastResult;
        }

        // Return cached result if called too soon
        return lastResult;
    };
};

export default {
    withTimeout,
    safeApiCall,
    batchApiCalls,
    retryWithBackoff,
    debounceApiCall,
    throttleApiCall,
};
