import prisma from '../../../database/prisma';

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

  // Used for slug uniqueness collision check
  findSlugById: async (slugId: string) => {
    return prisma.user.findUnique({
      where: { slugId },
      select: { id: true }
    });
  },

  // M-9: Strict typed — no `any` to prevent mass assignment
  createUser: async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    slugId: string;
    roleId: string;
  }) => {
    return prisma.user.create({
      data,
      include: { role: true }
    });
  },

  // M-9: Strict typed — only allowed fields can be updated on restore
  restoreUser: async (id: string, data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    slugId: string;
    roleId: string;
  }) => {
    return prisma.user.update({
      where: { id },
      data: {
        ...data,
        deletedAt: null // Clear soft delete flag (ghost logic)
      },
      include: { role: true }
    });
  }
};
