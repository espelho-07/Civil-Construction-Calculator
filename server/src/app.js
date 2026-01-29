import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import config from './config/env.js';
import './config/database.js'; // Initialize database connection
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import calculationRoutes from './routes/calculationRoutes.js';
import favoritesRoutes from './routes/favoritesRoutes.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { verifyEmailConnection } from './services/emailService.js';

const app = express();

// Security middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS configuration
app.use(cors({
    origin: config.clientUrl,
    credentials: true, // Allow cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Rate limiting
app.use(generalLimiter);

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

// Global error handler
app.use((err, req, res, next) => {
    console.error('Server Error:', err);

    // Don't expose internal errors in production
    const message = config.nodeEnv === 'production'
        ? 'Internal server error'
        : err.message;

    res.status(err.status || 500).json({
        success: false,
        message,
    });
});

// Start server
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

export default app;
