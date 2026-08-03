import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import appRoutes from '../app/app.routes';
import { csrfOriginCheck } from '../app/middlewares/csrf.middleware';

import path from 'path';
// B-2: Load environment variables FIRST — before any module reads process.env
// We now read from the single root .env file
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// M-6: Guard against missing FRONTEND_URL in production
if (process.env.NODE_ENV === 'production' && !process.env.FRONTEND_URL) {
  throw new Error('FATAL: FRONTEND_URL environment variable is not set in production.');
}

const app = express();
const PORT = process.env.PORT || 5000;

// m-1: Security headers via helmet
app.use(helmet());

// m-2: Body size limit — raised from 10kb to 1mb. The previous 10kb
// ceiling rejected legitimate save-result payloads (Mermaid diagrams +
// audit JSON + generated SQL schema can comfortably exceed 10kb), and
// the frontend was silently swallowing the resulting error. 1mb still
// bounds payload size well below anything that would meaningfully aid
// a DoS attempt.
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:7000', 'http://127.0.0.1:7000'],
  credentials: true
}));

// Defense-in-depth CSRF protection for cookie-authenticated requests
// (see csrf.middleware.ts for details on what this does and doesn't cover).
app.use(csrfOriginCheck);

// Routes
app.use('/api', appRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend Server running on http://localhost:${PORT}`);
});
