// ============================================================================
// File: health.routes.ts
// Purpose: GET /api/v1/health — public liveness endpoint, no auth required.
// ============================================================================
import { Router } from 'express';
import { getHealth } from './health.controller';

const router: Router = Router();

router.get('/', getHealth);

export { router as healthRoutes };
