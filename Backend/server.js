
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import connectDatabase from './config/db.js';
import healthRoutes from './routes/healthRoutes.js';
import providerRoutes from './routes/providerRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
}));

app.use(express.json());

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/auth', authRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

// Start server after database connection
const startServer = async () => {
    try {
        await connectDatabase();
    } catch (error) {
        console.warn(
            `MongoDB unavailable. Starting API with in-memory provider fallback: ${error.message}`
        );
    }

    app.listen(port, () => {
        console.log(`HomeEase API running on http://localhost:${port}`);
    });
};

startServer();

export default app;
