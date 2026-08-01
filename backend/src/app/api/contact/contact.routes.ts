import { Router } from 'express';
import { createContactMessage } from './contact.controller';
import { validateContact } from './contact.validators';

const router: Router = Router();

// POST /api/v1/contact/send
router.post('/send', validateContact, createContactMessage);

export const contactRoutes = router;
