import { Router } from 'express';
import { authRoutes } from './api/auth';
import { userProfileRoutes } from './api/user-profile';
import { contactRoutes } from './api/contact';
import { authMiddleware } from './middlewares/auth.middleware';
import { flowsRoutes } from './api/flows/flows.routes';
import { uploadRoutes } from './api/uploads/uploads.controller';
import { sessionsRoutes } from './api/sessions';
import { healthRoutes } from './api/health/health.routes';

const router: Router = Router();

// ─── Public routes (no auth required) ────────────────────────────────────────
router.use('/v1/auth', authRoutes);
router.use('/v1/contact', contactRoutes);
router.use('/v1/health', healthRoutes);

// ─── Protected routes (auth enforced either here or inside the sub-router) ────
router.use('/v1/user-profile', authMiddleware, userProfileRoutes);
router.use('/v1/uploads', uploadRoutes); // uploadRoutes applies authMiddleware internally
router.use('/v1/flows', flowsRoutes); // flowsRoutes applies authMiddleware internally
router.use('/v1/sessions', sessionsRoutes); // sessionsRoutes applies authMiddleware internally

// Export for server.ts
export default router;
