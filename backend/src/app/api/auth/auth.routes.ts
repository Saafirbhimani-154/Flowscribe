import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { register, login } from './auth.controller';
import { authValidators } from './auth.validators';

// B-5: Rate limiting on auth endpoints — 10 attempts per 15 minutes per IP
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { error: 'Too many requests from this IP, please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const router: Router = Router();

router.post('/register', authRateLimit, authValidators.register, register);
router.post('/login', authRateLimit, authValidators.login, login);

export default router;
