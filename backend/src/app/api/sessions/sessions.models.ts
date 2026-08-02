import prisma from '../../../database/prisma';
import type { CreateSessionRequest, SaveResultRequest, AddMessageRequest } from './sessions.interface';
import { SESSIONS_CONSTANTS } from './sessions.constants';

export const SessionsModel = {
  findAllByUser: async (userId: string) => {
    return prisma.flowSession.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { messages: true } },
      },
    });
  },

  findByIdAndUser: async (id: string, userId: string) => {
    return prisma.flowSession.findFirst({
      where: { id, userId },
    });
  },

  findDetailByIdAndUser: async (id: string, userId: string) => {
    return prisma.flowSession.findFirst({
      where: { id, userId },
      include: {
        result: true,
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });
  },

  create: async (userId: string, data: CreateSessionRequest) => {
    return prisma.flowSession.create({
      data: {
        userId,
        title: data.title || SESSIONS_CONSTANTS.DEFAULT_TITLE,
        messages: data.contextMessage
          ? { create: { role: 'USER', content: data.contextMessage, type: 'UPLOAD' } }
          : undefined,
      },
    });
  },

  upsertResult: async (sessionId: string, data: SaveResultRequest) => {
    const [result] = await prisma.$transaction([
      prisma.flowResult.upsert({
        where: { sessionId },
        create: { sessionId, ...data },
        update: { ...data },
      }),
      prisma.flowSession.update({
        where: { id: sessionId },
        data: { updatedAt: new Date() },
      }),
    ]);
    return result;
  },

  addMessage: async (sessionId: string, data: AddMessageRequest) => {
    return prisma.flowMessage.create({
      data: {
        sessionId,
        role: data.role,
        content: data.content,
        type: data.type,
      },
    });
  },

  delete: async (id: string) => {
    return prisma.flowSession.delete({ where: { id } });
  },
};
