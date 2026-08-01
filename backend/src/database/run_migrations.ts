// @ts-nocheck
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

console.log('🔄 Starting database migrations...');

try {
  // We execute Prisma Migrate Deploy programmatically.
  // This natively reads the migrations folder one by one and applies them securely.
  const schemaPath = path.join(__dirname, 'schema.prisma');
  
  console.log(`Using schema at: ${schemaPath}`);
  
  // Find all .sql files in the migrations directory
  const migrationsDir = path.join(__dirname, 'migrations');
  
  if (fs.existsSync(migrationsDir)) {
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort(); // ensures 01_ runs before 02_
      
    if (files.length === 0) {
      console.log('No migration scripts found.');
    } else {
      for (const file of files) {
        const filePath = path.join(migrationsDir, file);
        console.log(`Executing migration: ${file}...`);
        execSync(`npx prisma db execute --file "${filePath}" --schema="${schemaPath}"`, {
          encoding: 'utf-8',
          stdio: 'inherit'
        });
      }
    }
  }

  // Generate Prisma Client after migrations to ensure types match DB
  console.log('Generating Prisma Client...');
  execSync(`npx prisma generate --schema="${schemaPath}"`, {
    encoding: 'utf-8',
    stdio: 'inherit'
  });
  
  console.log('✅ Migrations completed successfully!');
} catch (error) {
  console.error('❌ Failed to run migrations:', error);
  process.exit(1);
}

