import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import appRoutes from '../app/app.routes';

// B-2: Load environment variables FIRST — before any module reads process.env
dotenv.config({ path: '.env.local' });

// M-6: Guard against missing FRONTEND_URL in production
if (process.env.NODE_ENV === 'production' && !process.env.FRONTEND_URL) {
  throw new Error('FATAL: FRONTEND_URL environment variable is not set in production.');
}

const app = express();
const PORT = process.env.PORT || 5000;

// m-1: Security headers via helmet
app.use(helmet());

// m-2: Strict body size limit to prevent large payload DoS
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:7000', 'http://127.0.0.1:7000'],
  credentials: true
}));

// Routes
app.use('/api', appRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend Server running on http://localhost:${PORT}`);
});
