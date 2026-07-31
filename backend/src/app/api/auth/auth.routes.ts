import { Router } from 'express';
import { register, login } from './auth.controller';
import { authValidators } from './auth.validators';

const router: Router = Router();

router.post('/register', authValidators.register, register);
router.post('/login', authValidators.login, login);

export default router;
