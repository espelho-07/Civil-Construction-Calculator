import { body, validationResult } from 'express-validator';

// Common password list (top 100 - in production use a larger list)
const commonPasswords = [
    'password', '123456', '12345678', 'qwerty', 'abc123', 'monkey', 'letmein',
    'dragon', '111111', 'baseball', 'iloveyou', 'trustno1', 'sunshine', 'master',
    'welcome', 'shadow', 'ashley', 'football', 'jesus', 'michael', 'ninja',
    'password1', 'Password1', 'password123', '12345', '1234567890', 'admin',
];

// Validation middleware
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg,
            })),
        });
    }
    next();
};

// Signup validation rules
export const signupValidation = [
    body('fullName')
        .trim()
        .notEmpty().withMessage('Full name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Full name must be 2-100 characters')
        .matches(/^[a-zA-Z\s]+$/).withMessage('Full name can only contain letters and spaces'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .isLength({ max: 128 }).withMessage('Password must be less than 128 characters')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[0-9]/).withMessage('Password must contain at least one number')
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character')
        .custom((value) => {
            if (commonPasswords.includes(value.toLowerCase())) {
                throw new Error('Password is too common, please choose a stronger password');
            }
            return true;
        }),

    body('confirmPassword')
        .notEmpty().withMessage('Confirm password is required')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),

    body('phone')
        .optional()
        .trim()
        .matches(/^[+]?[0-9]{10,15}$/).withMessage('Invalid phone number format'),

    body('acceptTerms')
        .optional()
        .isBoolean().withMessage('Accept terms must be a boolean'),
];

// Login validation rules
export const loginValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Password is required'),
];

// Forgot password validation
export const forgotPasswordValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
];

// Reset password validation
export const resetPasswordValidation = [
    body('token')
        .notEmpty().withMessage('Reset token is required'),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[0-9]/).withMessage('Password must contain at least one number')
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character'),

    body('confirmPassword')
        .notEmpty().withMessage('Confirm password is required')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),
];

// Email verification validation
export const verifyEmailValidation = [
    body('token')
        .notEmpty().withMessage('Verification token is required'),
];
