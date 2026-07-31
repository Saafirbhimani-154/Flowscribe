import { Router } from 'express';
import { authRoutes } from './api/auth';

const router: Router = Router();

// Mount all API routes under /v1
router.use('/v1/auth', authRoutes);

// Export for server.ts
export default router;
