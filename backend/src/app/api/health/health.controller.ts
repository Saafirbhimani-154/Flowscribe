// ============================================================================
// File: health.controller.ts
// Purpose: Lightweight liveness/readiness check for uptime monitoring and
//          load balancer health probes.
// ============================================================================
import { Request, Response } from 'express';

export const getHealth = (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
};
