import { execSync } from 'child_process';
import path from 'path';

console.log('🔄 Starting database migrations...');

try {
  // We execute Prisma Migrate Deploy programmatically.
  // This natively reads the migrations folder one by one and applies them securely.
  const schemaPath = path.join(__dirname, 'schema.prisma');
  
  console.log(`Using schema at: ${schemaPath}`);
  
  // Run the migration
  const output = execSync(`npx prisma migrate deploy --schema=${schemaPath}`, {
    encoding: 'utf-8',
    stdio: 'inherit'
  });
  
  console.log('✅ Migrations completed successfully!');
} catch (error) {
  console.error('❌ Failed to run migrations:', error);
  process.exit(1);
}
