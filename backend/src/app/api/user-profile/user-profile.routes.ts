import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  changePassword,
  confirmSlug,
  getSettings,
  updateSettings,
  deleteAccount,
  getUsage,
} from './user-profile.controller';
import { userProfileValidators } from './user-profile.validators';

const router: Router = Router();

// All routes protected by authMiddleware (applied in app.routes.ts)
// :slugId is the authenticated user's current slugId — ownership is verified in each controller

// ─── Profile ──────────────────────────────────────────────────────────────────
router.get('/:slugId', getProfile);
router.patch('/:slugId', userProfileValidators.updateProfile, updateProfile);
router.get('/:slugId/usage', getUsage);

// ─── Password ─────────────────────────────────────────────────────────────────
router.patch('/:slugId/password', userProfileValidators.changePassword, changePassword);

// ─── Slug (one-time setup) ────────────────────────────────────────────────────
router.patch('/:slugId/slug', userProfileValidators.confirmSlug, confirmSlug);

// ─── Settings ─────────────────────────────────────────────────────────────────
router.get('/:slugId/settings', getSettings);
router.patch('/:slugId/settings', userProfileValidators.updateSettings, updateSettings);

// ─── Account ──────────────────────────────────────────────────────────────────
router.delete('/:slugId', deleteAccount);

export default router;
