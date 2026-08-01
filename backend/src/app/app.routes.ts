import { Router } from 'express';
import { authRoutes } from './api/auth';
import { userProfileRoutes } from './api/user-profile';
import { contactRoutes } from './api/contact';
import { authMiddleware } from './middlewares/auth.middleware';

const router: Router = Router();

// ─── Public routes (no auth required) ────────────────────────────────────────
router.use('/v1/auth', authRoutes);
router.use('/v1/contact', contactRoutes);

import { flowsRoutes } from './api/flows/flows.routes';

// ─── Protected routes (authMiddleware required) ───────────────────────────────
router.use('/v1/user-profile', authMiddleware, userProfileRoutes);
router.use('/v1/flows', flowsRoutes);

// Export for server.ts
export default router;
