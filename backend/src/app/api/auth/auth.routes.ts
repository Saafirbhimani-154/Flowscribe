import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, logout } from './auth.controller';
import { authValidators } from './auth.validators';
import { checkSlugAvailability } from '../user-profile/user-profile.controller';
import { userProfileValidators } from '../user-profile/user-profile.validators';

// B-5: Rate limiting on auth endpoints — 10 attempts per 15 minutes per IP
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many requests from this IP, please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const router: Router = Router();

router.post('/register', authRateLimit, authValidators.register, register);
router.post('/login', authRateLimit, authValidators.login, login);
router.post('/logout', logout);

// Public slug availability check (used by frontend slug setup page)
router.get('/check-slug/:slugId', userProfileValidators.checkSlug, checkSlugAvailability);

export default router;
