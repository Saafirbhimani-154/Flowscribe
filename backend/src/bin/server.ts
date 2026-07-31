import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import appRoutes from '../app/app.routes';

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:7000',
  credentials: true
}));

// Routes
app.use('/api', appRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend Server running on http://localhost:${PORT}`);
});
