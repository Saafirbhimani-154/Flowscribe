import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { sessionsValidators } from './sessions.validators';
import {
  listSessions,
  createSession,
  getSession,
  saveResult,
  addMessage,
  deleteSession,
} from './sessions.controller';

const router: Router = Router();

// All session routes are protected
router.use(authMiddleware);

router.get('/', listSessions);
router.post('/', sessionsValidators.createSession, createSession);
router.get('/:id', getSession);
router.patch('/:id/result', sessionsValidators.saveResult, saveResult);
router.post('/:id/messages', sessionsValidators.addMessage, addMessage);
router.delete('/:id', deleteSession);

export default router;
