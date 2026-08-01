import { Router } from 'express';
import { authRoutes } from './api/auth';
import { userProfileRoutes } from './api/user-profile';
import { authMiddleware } from './middlewares/auth.middleware';

const router: Router = Router();

// ─── Public routes (no auth required) ────────────────────────────────────────
router.use('/v1/auth', authRoutes);

// ─── Protected routes (authMiddleware required) ───────────────────────────────
router.use('/v1/user-profile', authMiddleware, userProfileRoutes);

// Export for server.ts
export default router;
