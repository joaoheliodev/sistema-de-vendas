import { config } from 'dotenv';
config({ path: '.env' });

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma';
import bcrypt from 'bcrypt';

const connectionString = (process.env.DATABASE_URL || '').replace(/^'|'$/g, '');
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_DEFAULT_PASSWORD || 'ctRzygwKKCMnF1N3', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: {
      name: 'admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
    create: {
      email: 'admin@admin.com',
      name: 'admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Admin user updated:', admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
