import { SessionsModel } from './sessions.models';
import type { CreateSessionRequest, SaveResultRequest, AddMessageRequest } from './sessions.interface';

export const SessionsService = {
  listSessions: async (userId: string) => {
    return SessionsModel.findAllByUser(userId);
  },

  createSession: async (userId: string, data: CreateSessionRequest) => {
    return SessionsModel.create(userId, data);
  },

  getSession: async (id: string, userId: string) => {
    return SessionsModel.findDetailByIdAndUser(id, userId);
  },

  verifyOwnership: async (id: string, userId: string) => {
    return SessionsModel.findByIdAndUser(id, userId);
  },

  saveResult: async (sessionId: string, data: SaveResultRequest) => {
    return SessionsModel.upsertResult(sessionId, data);
  },

  addMessage: async (sessionId: string, data: AddMessageRequest) => {
    return SessionsModel.addMessage(sessionId, data);
  },

  deleteSession: async (id: string) => {
    return SessionsModel.delete(id);
  },
};
