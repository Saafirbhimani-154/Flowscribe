import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding roles...');
  
  const roles = [
    { name: 'Super Admin' },
    { name: 'Workspace Owner' }
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: { name: role.name },
    });
    console.log(`✅ Role ensured: ${role.name}`);
  }
}

export default main;
