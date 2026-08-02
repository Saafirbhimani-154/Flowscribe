// @ts-nocheck
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runSeeders() {
  console.log('🚀 Starting database seeders...');
  
  const seedersDir = path.join(__dirname, 'seeders');
  
  if (fs.existsSync(seedersDir)) {
    const files = fs.readdirSync(seedersDir)
      .filter(f => f.endsWith('.ts') && !f.endsWith('.d.ts'))
      .sort(); // ensures 01_ runs before 99_
      
    if (files.length === 0) {
      console.log('No seeder scripts found.');
    } else {
      for (const file of files) {
        const filePath = path.join(seedersDir, file);
        console.log(`\nExecuting seeder: ${file}...`);
        
        try {
          // Dynamic import for TS/JS module
          // Convert path to file:// URL for cross-platform compatibility (especially Windows)
          const { pathToFileURL } = require('url');
          const fileUrl = pathToFileURL(filePath).href;
          const seederModule = await import(fileUrl);
          if (typeof seederModule.default === 'function') {
            await seederModule.default();
          } else {
            console.warn(`⚠️ Seeder ${file} does not export a default function. Skipping.`);
          }
        } catch (error) {
          console.error(`❌ Failed to execute seeder ${file}:`, error);
          await prisma.$disconnect();
          process.exit(1);
        }
      }
    }
  }

  console.log('\n✅ All seeders completed successfully!');
  await prisma.$disconnect();
}

runSeeders().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
