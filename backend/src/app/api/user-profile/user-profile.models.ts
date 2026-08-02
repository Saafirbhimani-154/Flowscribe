import prisma from '../../../database/prisma';

export const UserProfileModel = {
  // ─── Find user by slugId (primary lookup for all profile routes) ──────────
  findUserBySlugId: async (slugId: string) => {
    return prisma.user.findUnique({
      where: { slugId },
      include: {
        role: { select: { id: true, name: true } },
        profile: true,
      },
    });
  },

  // ─── Find user by ID (used for password change, slug confirm) ─────────────
  findUserById: async (id: string) => {
    return prisma.user.findUnique({
      where: { id },
      include: {
        role: { select: { id: true, name: true } },
        profile: true,
      },
    });
  },

  // ─── Check email uniqueness (before updating email) ───────────────────────
  findUserByEmail: async (email: string) => {
    return prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
  },

  // ─── Update profile fields ────────────────────────────────────────────────
  updateProfile: async (id: string, data: {
    firstName?: string;
    lastName?: string;
    email?: string;
  }) => {
    return prisma.user.update({
      where: { id },
      data,
      include: {
        role: { select: { id: true, name: true } },
        profile: true,
      },
    });
  },

  // ─── Password: fetch hash for comparison ──────────────────────────────────
  findUserPasswordById: async (id: string) => {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, password: true },
    });
  },

  // ─── Update password hash ─────────────────────────────────────────────────
  updatePassword: async (id: string, hashedPassword: string) => {
    return prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  },

  // ─── Slug: check uniqueness by slugId ─────────────────────────────────────
  findSlugById: async (slugId: string) => {
    return prisma.user.findUnique({
      where: { slugId },
      select: { id: true },
    });
  },

  // ─── Confirm slug (one-time) ──────────────────────────────────────────────
  confirmSlug: async (id: string, slugId: string) => {
    return prisma.user.update({
      where: { id },
      data: { slugId, isSlugSet: true },
      include: {
        role: { select: { id: true, name: true } },
        profile: true,
      },
    });
  },

  // ─── Settings: upsert (create if not exists, else update) ─────────────────
  upsertSettings: async (userId: string, data: {
    language?: string;
    theme?: string;
    timezone?: string;
  }) => {
    return prisma.userProfile.upsert({
      where: { userId },
      create: { userId, ...data },
      update: data,
    });
  },

  // ─── Settings: get ────────────────────────────────────────────────────────
  getSettings: async (userId: string) => {
    return prisma.userProfile.findUnique({
      where: { userId },
    });
  },

  // ─── Account: Soft delete ──────────────────────────────────────────────────
  deleteUser: async (id: string) => {
    return prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },
};
