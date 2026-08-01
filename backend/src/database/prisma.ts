import { PrismaClient } from '@prisma/client';

// m-8: Singleton PrismaClient — prevents connection pool exhaustion on hot reload / in tests
const prisma = new PrismaClient();

export default prisma;
