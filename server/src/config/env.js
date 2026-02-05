import dotenv from 'dotenv';
dotenv.config();

export const config = {
    // Server
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT) || 5000,

    // JWT
    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET,
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        accessExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
        refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
    },

    // Email
    email: {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT) || 587,
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
        from: process.env.EMAIL_FROM,
    },

    // URLs
    clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',

    // Security
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 12,
    maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5,
    lockoutDuration: parseInt(process.env.LOCKOUT_DURATION) || 24 * 60 * 60 * 1000, // 24 hours
    
    // Validate required secrets
    validateSecrets() {
        const required = ['JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];
        const missing = required.filter(key => !process.env[key]);
        
        if (missing.length > 0) {
            throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
        }
        
        // Validate secret strength
        if (process.env.JWT_ACCESS_SECRET && process.env.JWT_ACCESS_SECRET.length < 32) {
            throw new Error('JWT_ACCESS_SECRET must be at least 32 characters long');
        }
        
        if (process.env.JWT_REFRESH_SECRET && process.env.JWT_REFRESH_SECRET.length < 32) {
            throw new Error('JWT_REFRESH_SECRET must be at least 32 characters long');
        }
    },
};

// Validate secrets on startup
if (config.nodeEnv === 'production') {
    try {
        config.validateSecrets();
    } catch (error) {
        console.error('❌ Security Configuration Error:', error.message);
        process.exit(1);
    }
}

export default config;
