import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const AuthModel = {
  findUserByEmail: async (email: string) => {
    return prisma.user.findUnique({
      where: { email },
      include: { role: true }
    });
  },

  findRoleByName: async (name: string) => {
    return prisma.role.findUnique({
      where: { name }
    });
  },

  createUser: async (data: any) => {
    return prisma.user.create({
      data,
      include: { role: true }
    });
  },

  restoreUser: async (id: string, data: any) => {
    return prisma.user.update({
      where: { id },
      data: {
        ...data,
        deletedAt: null // Clear soft delete flag
      },
      include: { role: true }
    });
  }
};
