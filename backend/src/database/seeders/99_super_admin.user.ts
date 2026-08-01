import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Super Admin user...');
  
  const email = process.env.SUPER_ADMIN_EMAIL;
  const password = process.env.SUPER_ADMIN_PASSWORD;

  if (!email || !password) {
    console.warn('⚠️ Super Admin credentials not found in .env. Skipping super admin creation.');
    return;
  }

  const superAdminRole = await prisma.role.findUnique({
    where: { name: 'Super Admin' }
  });

  if (!superAdminRole) {
    throw new Error('Super Admin role not found. Ensure 01_role.ts runs first.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const slugId = 'super-admin-workspace';

  await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      roleId: superAdminRole.id
    },
    create: {
      firstName: 'Super',
      lastName: 'Admin',
      email: email,
      password: hashedPassword,
      slugId: slugId,
      roleId: superAdminRole.id
    }
  });

  console.log(`✅ Super Admin ensured: ${email}`);
}

export default main;
