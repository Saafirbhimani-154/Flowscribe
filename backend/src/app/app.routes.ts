import { Router } from 'express';
import { authRoutes } from './api/auth';
import { authMiddleware } from './middlewares/auth.middleware';

const router: Router = Router();

// ─── Public routes (no auth required) ────────────────────────────────────────
router.use('/v1/auth', authRoutes);

// ─── Protected routes (authMiddleware required) ───────────────────────────────
// Pattern: router.use('/v1/resource', authMiddleware, resourceRoutes);
// Example once dashboard/workspace routes are added:
//   import { workspaceRoutes } from './api/workspace';
//   router.use('/v1/workspace', authMiddleware, workspaceRoutes);

// Export for server.ts
export default router;
