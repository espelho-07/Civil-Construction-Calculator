import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import config from './config/env.js';
import './config/database.js'; // Initialize database connection
import prisma from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import calculationRoutes from './routes/calculationRoutes.js';
import favoritesRoutes from './routes/favoritesRoutes.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { verifyEmailConnection } from './services/emailService.js';
import { addCSRFToken } from './middleware/csrf.js';
import { sanitizeBody, sanitizeQuery } from './middleware/inputSanitizer.js';

const app = express();

// Security middleware - Enhanced Helmet configuration
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            scriptSrc: ["'self'", "https://www.googletagmanager.com", "https://www.google-analytics.com"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            frameSrc: ["'none'"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: [],
        },
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
    },
    xContentTypeOptions: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    frameguard: { action: 'deny' },
}));

// CORS configuration - Tightened for security
const allowedOrigins = [
    config.clientUrl,
    // Add specific production domains only
    'https://civil-construction-calculator.vercel.app',
];

// In development, allow localhost
if (config.nodeEnv === 'development') {
    allowedOrigins.push('http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173');
}

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests) - but log them
        if (!origin) {
            // In production, be more strict about no-origin requests
            if (config.nodeEnv === 'production') {
                return callback(new Error('CORS: Origin header required in production'), false);
            }
            return callback(null, true);
        }

        // Check against whitelist
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        // Log blocked origin for security monitoring
        console.warn(`CORS: Blocked origin: ${origin}`);
        return callback(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
    exposedHeaders: ['X-CSRF-Token'],
    maxAge: 86400, // 24 hours
}));

// Body parsing with route-specific limits
app.use(express.json({ 
    limit: '5mb', // Reduced default limit
    strict: true, // Only parse arrays and objects
}));
app.use(express.urlencoded({ 
    extended: true,
    limit: '5mb',
    parameterLimit: 100, // Limit number of parameters
}));

// Cookie parser
app.use(cookieParser());

// Input sanitization
app.use(sanitizeBody);
app.use(sanitizeQuery);

// Rate limiting
app.use(generalLimiter);

// CSRF token generation (for GET requests)
app.use(addCSRFToken);

// Request logging (development only)
if (config.nodeEnv === 'development') {
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} | ${req.method} ${req.path}`);
        next();
    });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        environment: config.nodeEnv,
    });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/calculations', calculationRoutes);
app.use('/api/favorites', favoritesRoutes);


// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found',
    });
});

// Global error handler - Enhanced
import { errorHandler } from './middleware/errorHandler.js';
app.use(errorHandler);

// Start server only if not in Vercel environment
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    const PORT = config.port;
    app.listen(PORT, async () => {
        console.log(`
    ╔═══════════════════════════════════════════════════════════╗
    ║     🏗️  Civil Engineering Calculators API Server              ║
    ╠═══════════════════════════════════════════════════════════╣
    ║  Environment: ${config.nodeEnv.padEnd(42)}║
    ║  Port:        ${String(PORT).padEnd(42)}║
    ║  Client:      ${config.clientUrl.padEnd(42)}║
    ╚═══════════════════════════════════════════════════════════╝
        `);

        // Verify email connection
        await verifyEmailConnection();
    });
}

export default app;
