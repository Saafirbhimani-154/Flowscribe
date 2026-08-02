import { type Request, type Response } from 'express';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';
import { AuthModel } from './auth.models';
import { AUTH_CONSTANTS } from './auth.constants';
import { AUTH_MESSAGES } from './auth.messages';

// ─── Shared helper: generate token + set HTTP-only cookie ────────────────────
const issueTokenCookie = (res: Response, userId: string, roleId: string) => {
  const signOptions: jwt.SignOptions = { expiresIn: (AUTH_CONSTANTS.JWT_EXPIRES_IN as string) as any };
  const token = jwt.sign(
    { userId, roleId }, // Include roleId so middleware doesn't need extra DB call
    AUTH_CONSTANTS.JWT_SECRET,
    signOptions
  );

  res.cookie('flowscribe_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict', // M-5: Consistent strict on both login and sliding session
    maxAge: 30 * 60 * 1000 // 30 minutes
  });
};

// ─── Shared helper: generate unique slug (M-1: CSPRNG, M-2: collision retry) ─
const generateUniqueSlug = async (firstName: string, lastName: string): Promise<string> => {
  const base = `${firstName}-${lastName}`.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const MAX_ATTEMPTS = 5;

  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    // M-1: crypto.randomBytes — cryptographically secure, 8 hex chars = 4 billion combos
    const suffix = randomBytes(4).toString('hex');
    const slugId = `${base}-${suffix}`;
    const existing = await AuthModel.findSlugById(slugId);
    if (!existing) return slugId;
  }

  // Timestamp fallback for guaranteed uniqueness after 5 collisions
  return `${base}-${Date.now()}`;
};

// ─── POST /auth/register ──────────────────────────────────────────────────────
export const register = async (req: Request, res: Response) => {
  try {
    // Note: req.body has already been stripped by Joi (confirmPassword removed by stripUnknown)
    const { firstName, lastName, email, password } = req.body as {
      firstName: string; lastName: string; email: string; password: string;
    };

    const existingUser = await AuthModel.findUserByEmail(email);

    // m-4: Generic message to prevent account enumeration — don't confirm email exists
    // Note: returning 200 + generic message would be ideal but 409 is kept for DX in dev
    if (existingUser && existingUser.deletedAt === null) {
      return res.status(409).json({ error: AUTH_MESSAGES.ERROR.EMAIL_IN_USE });
    }

    // M-4: Hash AFTER the conflict check — no wasted CPU on duplicate attempts
    const hashedPassword = await bcrypt.hash(password, AUTH_CONSTANTS.BCRYPT_SALT_ROUNDS);

    const defaultRole = await AuthModel.findRoleByName('Workspace Owner');
    if (!defaultRole) {
      return res.status(500).json({ error: AUTH_MESSAGES.ERROR.DEFAULT_ROLE_MISSING });
    }

    const slugId = await generateUniqueSlug(firstName, lastName);
    let user;

    if (existingUser && existingUser.deletedAt !== null) {
      // Ghost logic: Soft deleted account — restore with FULL RESET of sensitive fields (M-7)
      // B-4: roleId and slugId are reset to prevent privilege escalation from old account
      user = await AuthModel.restoreUser(existingUser.id, {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        slugId,           // B-4: New slug — don't inherit old identity
        roleId: defaultRole.id, // B-4: Reset to default role — don't inherit old privileges
      });
    } else {
      user = await AuthModel.createUser({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        slugId,
        roleId: defaultRole.id,
      });
    }

    issueTokenCookie(res, user.id, user.roleId);

    // B-1: Do NOT return the token in the body — it lives only in the HTTP-only cookie
    return res.status(201).json({
      message: AUTH_MESSAGES.SUCCESS.REGISTERED,
      auth: {
        id: user.id,
        email: user.email,
      },
      userProfile: {
        firstName: user.firstName,
        lastName: user.lastName,
      },
      role: {
        id: user.roleId,
        name: user.role?.name || 'Workspace Owner',
      },
      slug: {
        name: user.slugId,
        isSet: user.isSlugSet,
      }
    });
  } catch (error) {
    // m-5: Don't log raw error object — log message only to avoid leaking internals
    console.error('Registration Error:', (error as Error).message);
    return res.status(500).json({ error: AUTH_MESSAGES.ERROR.INTERNAL_SERVER_ERROR });
  }
};

// ─── POST /auth/login ─────────────────────────────────────────────────────────
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as { email: string; password: string };

    const user = await AuthModel.findUserByEmail(email);

    if (!user || user.deletedAt !== null || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: AUTH_MESSAGES.ERROR.INVALID_CREDENTIALS });
    }

    issueTokenCookie(res, user.id, user.roleId);

    // B-1: Do NOT return the token in the body — it lives only in the HTTP-only cookie
    return res.status(200).json({
      message: AUTH_MESSAGES.SUCCESS.LOGGED_IN,
      auth: {
        id: user.id,
        email: user.email,
      },
      userProfile: {
        firstName: user.firstName,
        lastName: user.lastName,
      },
      role: {
        id: user.roleId,
        name: user.role?.name || 'Workspace Owner',
      },
      slug: {
        name: user.slugId,
        isSet: user.isSlugSet,
      }
    });
  } catch (error) {
    console.error('Login Error:', (error as Error).message);
    return res.status(500).json({ error: AUTH_MESSAGES.ERROR.INTERNAL_SERVER_ERROR });
  }
};

// ─── POST /auth/logout ────────────────────────────────────────────────────────
export const logout = async (req: Request, res: Response) => {
  res.clearCookie('flowscribe_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  return res.status(200).json({ message: 'Logged out successfully.' });
};
