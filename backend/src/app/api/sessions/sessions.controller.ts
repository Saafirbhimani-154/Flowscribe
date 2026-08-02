import { Request, Response, NextFunction } from 'express';
import { SessionsService } from './sessions.service';
import { SESSIONS_MESSAGES } from './sessions.constants';

const getUserId = (req: Request): string => (req as any).user?.id;

export const listSessions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    const sessions = await SessionsService.listSessions(userId);
    res.status(200).json({ success: true, data: sessions });
  } catch (err) { next(err); }
};

export const createSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    const session = await SessionsService.createSession(userId, req.body);
    console.log(`[Sessions] Created session ${session.id} for user ${userId}`);
    res.status(201).json({ success: true, data: session, message: SESSIONS_MESSAGES.SUCCESS.CREATED });
  } catch (err) { next(err); }
};

export const getSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    const session = await SessionsService.getSession(req.params.id as string, userId);
    if (!session) return res.status(404).json({ success: false, message: SESSIONS_MESSAGES.ERROR.NOT_FOUND });
    res.status(200).json({ success: true, data: session });
  } catch (err) { next(err); }
};

export const saveResult = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    const session = await SessionsService.verifyOwnership(req.params.id as string, userId);
    if (!session) return res.status(404).json({ success: false, message: SESSIONS_MESSAGES.ERROR.NOT_FOUND });

    const result = await SessionsService.saveResult(req.params.id as string, req.body);
    console.log(`[Sessions] Saved result for session ${req.params.id as string}`);
    res.status(200).json({ success: true, data: result, message: SESSIONS_MESSAGES.SUCCESS.RESULT_SAVED });
  } catch (err) { next(err); }
};

export const addMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    const session = await SessionsService.verifyOwnership(req.params.id as string, userId);
    if (!session) return res.status(404).json({ success: false, message: SESSIONS_MESSAGES.ERROR.NOT_FOUND });

    const message = await SessionsService.addMessage(req.params.id as string, req.body);
    res.status(201).json({ success: true, data: message, message: SESSIONS_MESSAGES.SUCCESS.MESSAGE_ADDED });
  } catch (err) { next(err); }
};

export const deleteSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    const session = await SessionsService.verifyOwnership(req.params.id as string, userId);
    if (!session) return res.status(404).json({ success: false, message: SESSIONS_MESSAGES.ERROR.NOT_FOUND });

    await SessionsService.deleteSession(req.params.id as string);
    res.status(200).json({ success: true, message: SESSIONS_MESSAGES.SUCCESS.DELETED });
  } catch (err) { next(err); }
};
