import { Request, Response, NextFunction } from 'express';

/**
 * Defense-in-depth CSRF protection for cookie-authenticated, state-changing
 * requests. `sameSite: 'strict'` on the auth cookie (see auth.middleware.ts)
 * already blocks most cross-site cookie-carrying requests, but doesn't cover
 * every browser/proxy configuration — this adds an explicit Origin check as
 * a second layer for POST/PATCH/PUT/DELETE requests.
 *
 * GET/HEAD/OPTIONS are left alone since they should be side-effect-free.
 */
export const csrfOriginCheck = (req: Request, res: Response, next: NextFunction) => {
  const stateChangingMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
  if (!stateChangingMethods.includes(req.method)) {
    return next();
  }

  const origin = req.headers.origin;
  const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:7000',
    'http://127.0.0.1:7000',
  ];

  // No Origin header at all (e.g. some same-origin requests, non-browser
  // clients with credentials but no cookie) — allow through; the cookie's
  // sameSite policy is still the primary guard in that case.
  if (!origin) {
    return next();
  }

  if (!allowedOrigins.includes(origin)) {
    return res.status(403).json({ success: false, message: 'Request origin not allowed.' });
  }

  next();
};
