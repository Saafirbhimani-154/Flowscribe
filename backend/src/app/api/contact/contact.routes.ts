import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { createContactMessage } from './contact.controller';
import { validateContact } from './contact.validators';

const router: Router = Router();

// IP-based rate limit: max 5 messages per 15 minutes
const contactRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many messages sent. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// POST /api/v1/contact/send
router.post('/send', contactRateLimit, validateContact, createContactMessage);

export const contactRoutes = router;
