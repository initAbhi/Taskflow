import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { env } from './config/env';
import { logger } from './config/logger';
import { AppDataSource } from './config/database';
import { errorHandler, notFound } from './middleware/error.middleware';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';

const app = express();

// ──────────────────────────────────────────────
// Security & Utility Middleware
// ──────────────────────────────────────────────
app.use(helmet());
app.use(
    cors({
        origin: env.CORS_ORIGIN,
        credentials: true,
        methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));

// Rate limiting — 100 requests per 15 minutes per IP
app.use(
    '/api',
    rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        standardHeaders: true,
        legacyHeaders: false,
        message: { success: false, message: 'Too many requests, please try again later.' },
    })
);

// ──────────────────────────────────────────────
// API Routes
// ──────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
    res.status(200).json({ success: true, message: 'Task Manager API is running', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// ──────────────────────────────────────────────
// Error Handling
// ──────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ──────────────────────────────────────────────
// Database & Server Bootstrap
// ──────────────────────────────────────────────
const bootstrap = async (): Promise<void> => {
    try {
        await AppDataSource.initialize();
        logger.info('✅ PostgreSQL connected and schema synchronized');

        app.listen(env.PORT, () => {
            logger.info(`🚀 Server running on http://localhost:${env.PORT} [${env.NODE_ENV}]`);
        });
    } catch (error) {
        logger.error('❌ Failed to start server', error);
        process.exit(1);
    }
};

bootstrap();

export default app;
