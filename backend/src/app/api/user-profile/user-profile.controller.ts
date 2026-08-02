import { type Request, type Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserProfileModel } from './user-profile.models';
import { USER_PROFILE_MESSAGES } from './user-profile.messages';
import { AUTH_CONSTANTS } from '../auth/auth.constants';

// ─── Reserved slugs that cannot be claimed ────────────────────────────────────
export const RESERVED_SLUGS = new Set([
  'admin', 'home', 'about', 'api', 'app', 'www', 'mail', 'support',
  'dashboard', 'settings', 'login', 'signup', 'slug-id', 'setup',
  'super-admin', 'superadmin', 'features', 'showcase', 'privacy',
  'terms', 'contact', 'contact-us', 'blog', 'landing', 'help',
  'docs', 'status', 'pricing',
]);

// ─── Helper: format user for response (never leaks password) ─────────────────
const formatUserResponse = (user: any) => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  slugId: user.slugId,
  isSlugSet: user.isSlugSet,
  role: user.role,
  profile: user.profile
    ? { language: user.profile.language, theme: user.profile.theme, timezone: user.profile.timezone }
    : null,
  createdAt: user.createdAt,
});

// ─── Helper: resolve user by :slugId and verify ownership ────────────────────
// Every profile endpoint goes through this. If the slugId in the URL doesn't
// belong to the authenticated user (from cookie), we return 403 — not 404 —
// to prevent leaking whether a user exists at that slug.
const resolveAndVerify = async (slugId: string, requesterId: string | undefined) => {
  if (!requesterId) return { user: null, status: 401 as const };

  const user = await UserProfileModel.findUserBySlugId(slugId);
  if (!user || user.deletedAt !== null) return { user: null, status: 404 as const };
  if (user.id !== requesterId) return { user: null, status: 403 as const };

  return { user, status: 200 as const };
};

// ─── GET /v1/user-profile/:slugId ─────────────────────────────────────────────
export const getProfile = async (req: Request, res: Response) => {
  try {
    const slugId = req.params.slugId as string;
    const { user, status } = await resolveAndVerify(slugId, req.user?.id);

    if (status === 401) return res.status(401).json({ error: 'Unauthorized.' });
    if (status === 404) return res.status(404).json({ error: USER_PROFILE_MESSAGES.ERROR.USER_NOT_FOUND });
    if (status === 403) return res.status(403).json({ error: USER_PROFILE_MESSAGES.ERROR.FORBIDDEN });

    return res.status(200).json({
      message: USER_PROFILE_MESSAGES.SUCCESS.PROFILE_FETCHED,
      user: formatUserResponse(user!),
    });
  } catch (error) {
    console.error('Get Profile Error:', (error as Error).message);
    return res.status(500).json({ error: USER_PROFILE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR });
  }
};

// ─── PATCH /v1/user-profile/:slugId ───────────────────────────────────────────
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const slugId = req.params.slugId as string;
    const { user, status } = await resolveAndVerify(slugId, req.user?.id);

    if (status === 401) return res.status(401).json({ error: 'Unauthorized.' });
    if (status === 404) return res.status(404).json({ error: USER_PROFILE_MESSAGES.ERROR.USER_NOT_FOUND });
    if (status === 403) return res.status(403).json({ error: USER_PROFILE_MESSAGES.ERROR.FORBIDDEN });

    const { firstName, lastName, email } = req.body as {
      firstName?: string; lastName?: string; email?: string;
    };

    // If email is changing, ensure it's not already taken by someone else
    if (email) {
      const existing = await UserProfileModel.findUserByEmail(email);
      if (existing && existing.id !== user!.id) {
        return res.status(409).json({ error: USER_PROFILE_MESSAGES.ERROR.EMAIL_IN_USE });
      }
    }

    const updateData: { firstName?: string; lastName?: string; email?: string } = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (email) updateData.email = email;

    const updatedUser = await UserProfileModel.updateProfile(user!.id, updateData);

    return res.status(200).json({
      message: USER_PROFILE_MESSAGES.SUCCESS.PROFILE_UPDATED,
      user: formatUserResponse(updatedUser),
    });
  } catch (error) {
    console.error('Update Profile Error:', (error as Error).message);
    return res.status(500).json({ error: USER_PROFILE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR });
  }
};

// ─── PATCH /v1/user-profile/:slugId/password ──────────────────────────────────
export const changePassword = async (req: Request, res: Response) => {
  try {
    const slugId = req.params.slugId as string;
    const { user, status } = await resolveAndVerify(slugId, req.user?.id);

    if (status === 401) return res.status(401).json({ error: 'Unauthorized.' });
    if (status === 404) return res.status(404).json({ error: USER_PROFILE_MESSAGES.ERROR.USER_NOT_FOUND });
    if (status === 403) return res.status(403).json({ error: USER_PROFILE_MESSAGES.ERROR.FORBIDDEN });

    const { currentPassword, newPassword } = req.body as {
      currentPassword: string; newPassword: string;
    };

    // Fetch the stored hash (not included in normal findUserBySlugId for security)
    const userWithPassword = await UserProfileModel.findUserPasswordById(user!.id);
    if (!userWithPassword) {
      return res.status(404).json({ error: USER_PROFILE_MESSAGES.ERROR.USER_NOT_FOUND });
    }

    const isMatch = await bcrypt.compare(currentPassword, userWithPassword.password);
    if (!isMatch) {
      return res.status(401).json({ error: USER_PROFILE_MESSAGES.ERROR.INCORRECT_PASSWORD });
    }

    const isSame = await bcrypt.compare(newPassword, userWithPassword.password);
    if (isSame) {
      return res.status(400).json({ error: USER_PROFILE_MESSAGES.ERROR.SAME_PASSWORD });
    }

    const hashedPassword = await bcrypt.hash(newPassword, AUTH_CONSTANTS.BCRYPT_SALT_ROUNDS);
    await UserProfileModel.updatePassword(user!.id, hashedPassword);

    // Re-issue fresh cookie so active session doesn't break
    const roleId = req.user?.roleId || '';
    const signOptions: jwt.SignOptions = { expiresIn: (AUTH_CONSTANTS.JWT_EXPIRES_IN as string) as any };
    const token = jwt.sign({ userId: user!.id, roleId }, AUTH_CONSTANTS.JWT_SECRET, signOptions);
    res.cookie('flowscribe_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 60 * 1000,
    });

    return res.status(200).json({ message: USER_PROFILE_MESSAGES.SUCCESS.PASSWORD_CHANGED });
  } catch (error) {
    console.error('Change Password Error:', (error as Error).message);
    return res.status(500).json({ error: USER_PROFILE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR });
  }
};

// ─── PATCH /v1/user-profile/:slugId/slug ──────────────────────────────────────
// :slugId here is the user's CURRENT (auto-generated) slug. Body contains the
// desired new slug. One-time only — after this isSlugSet = true permanently.
export const confirmSlug = async (req: Request, res: Response) => {
  try {
    const currentSlugId = req.params.slugId as string;
    const { user, status } = await resolveAndVerify(currentSlugId, req.user?.id);

    if (status === 401) return res.status(401).json({ error: 'Unauthorized.' });
    if (status === 404) return res.status(404).json({ error: USER_PROFILE_MESSAGES.ERROR.USER_NOT_FOUND });
    if (status === 403) return res.status(403).json({ error: USER_PROFILE_MESSAGES.ERROR.FORBIDDEN });

    if (user!.isSlugSet) {
      return res.status(403).json({ error: USER_PROFILE_MESSAGES.ERROR.SLUG_ALREADY_SET });
    }

    const { slugId: newSlugId } = req.body as { slugId: string };

    if (RESERVED_SLUGS.has(newSlugId)) {
      return res.status(400).json({ error: USER_PROFILE_MESSAGES.ERROR.SLUG_RESERVED });
    }

    // Race condition safety — final uniqueness check before commit
    const existing = await UserProfileModel.findSlugById(newSlugId);
    if (existing && existing.id !== user!.id) {
      return res.status(409).json({ error: USER_PROFILE_MESSAGES.ERROR.SLUG_TAKEN });
    }

    const updatedUser = await UserProfileModel.confirmSlug(user!.id, newSlugId);

    return res.status(200).json({
      message: USER_PROFILE_MESSAGES.SUCCESS.SLUG_CONFIRMED,
      user: formatUserResponse(updatedUser),
    });
  } catch (error) {
    console.error('Confirm Slug Error:', (error as Error).message);
    return res.status(500).json({ error: USER_PROFILE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR });
  }
};

// ─── GET /v1/user-profile/:slugId/settings ────────────────────────────────────
export const getSettings = async (req: Request, res: Response) => {
  try {
    const slugId = req.params.slugId as string;
    const { user, status } = await resolveAndVerify(slugId, req.user?.id);

    if (status === 401) return res.status(401).json({ error: 'Unauthorized.' });
    if (status === 404) return res.status(404).json({ error: USER_PROFILE_MESSAGES.ERROR.USER_NOT_FOUND });
    if (status === 403) return res.status(403).json({ error: USER_PROFILE_MESSAGES.ERROR.FORBIDDEN });

    const settings = await UserProfileModel.getSettings(user!.id);

    return res.status(200).json({
      message: USER_PROFILE_MESSAGES.SUCCESS.SETTINGS_FETCHED,
      settings: settings
        ? { language: settings.language, theme: settings.theme, timezone: settings.timezone }
        : { language: 'en', theme: 'system', timezone: 'UTC' }, // row not created yet → defaults
    });
  } catch (error) {
    console.error('Get Preferences Error:', (error as Error).message);
    return res.status(500).json({ error: USER_PROFILE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR });
  }
};

// ─── PATCH /v1/user-profile/:slugId/settings ──────────────────────────────────
export const updateSettings = async (req: Request, res: Response) => {
  try {
    const slugId = req.params.slugId as string;
    const { user, status } = await resolveAndVerify(slugId, req.user?.id);

    if (status === 401) return res.status(401).json({ error: 'Unauthorized.' });
    if (status === 404) return res.status(404).json({ error: USER_PROFILE_MESSAGES.ERROR.USER_NOT_FOUND });
    if (status === 403) return res.status(403).json({ error: USER_PROFILE_MESSAGES.ERROR.FORBIDDEN });

    const { language, theme, timezone } = req.body as {
      language?: string; theme?: string; timezone?: string;
    };

    const updateData: Record<string, string> = {};
    if (language) updateData.language = language;
    if (theme) updateData.theme = theme;
    if (timezone) updateData.timezone = timezone;

    const settings = await UserProfileModel.upsertSettings(user!.id, updateData);

    return res.status(200).json({
      message: USER_PROFILE_MESSAGES.SUCCESS.SETTINGS_UPDATED,
      settings: {
        language: settings.language,
        theme: settings.theme,
        timezone: settings.timezone,
      },
    });
  } catch (error) {
    console.error('Update Preferences Error:', (error as Error).message);
    return res.status(500).json({ error: USER_PROFILE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR });
  }
};

// ─── GET /v1/auth/check-slug/:slugId (Public — mounted on auth routes) ────────
export const checkSlugAvailability = async (req: Request, res: Response) => {
  try {
    const slugId = req.params.slugId as string;

    if (RESERVED_SLUGS.has(slugId)) {
      return res.status(200).json({ available: false, reason: 'reserved' });
    }

    const existing = await UserProfileModel.findSlugById(slugId);

    return res.status(200).json({
      available: !existing,
      ...(existing ? { reason: 'taken' } : {}),
    });
  } catch (error) {
    console.error('Check Slug Error:', (error as Error).message);
    return res.status(500).json({ error: USER_PROFILE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR });
  }
};

// ─── DELETE /v1/user-profile/:slugId ──────────────────────────────────────────
export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const slugId = req.params.slugId as string;
    const { user, status } = await resolveAndVerify(slugId, req.user?.id);

    if (status === 401) return res.status(401).json({ error: 'Unauthorized.' });
    if (status === 404) return res.status(404).json({ error: USER_PROFILE_MESSAGES.ERROR.USER_NOT_FOUND });
    if (status === 403) return res.status(403).json({ error: USER_PROFILE_MESSAGES.ERROR.FORBIDDEN });

    // Ghost account logic — set deletedAt instead of hard delete
    await UserProfileModel.deleteUser(user!.id);

    // Clear session token
    res.clearCookie('flowscribe_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return res.status(200).json({ message: 'Account deleted successfully.' });
  } catch (error) {
    console.error('Delete Account Error:', (error as Error).message);
    return res.status(500).json({ error: USER_PROFILE_MESSAGES.ERROR.INTERNAL_SERVER_ERROR });
  }
};
