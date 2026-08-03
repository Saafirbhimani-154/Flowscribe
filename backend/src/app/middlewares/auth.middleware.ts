import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AUTH_CONSTANTS } from '../api/auth/auth.constants';
import { AUTH_MESSAGES } from '../api/auth/auth.messages';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.flowscribe_token;

    if (!token) {
      return res.status(401).json({ error: AUTH_MESSAGES.ERROR.UNAUTHORIZED });
    }

    // Verify token
    const decoded = jwt.verify(token, AUTH_CONSTANTS.JWT_SECRET as string) as { userId: string; roleId?: string };

    // Set user on request
    req.user = { id: decoded.userId, ...(decoded.roleId ? { roleId: decoded.roleId } : {}) };

    // Sliding Session: Generate a fresh token with 30m expiry — preserve roleId
    const refreshedToken = jwt.sign(
      { userId: decoded.userId, roleId: decoded.roleId },
      AUTH_CONSTANTS.JWT_SECRET as string,
      { expiresIn: AUTH_CONSTANTS.JWT_EXPIRES_IN as any }
    );

    // Attach fresh token to cookie
    res.cookie('flowscribe_token', refreshedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None',
      maxAge: 30 * 60 * 1000 // 30 minutes in milliseconds
    });

    next();
  } catch (error) {
    return res.status(401).json({ error: AUTH_MESSAGES.ERROR.UNAUTHORIZED });
  }
};

// Also update Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        roleId?: string;
      };
    }
  }
}
