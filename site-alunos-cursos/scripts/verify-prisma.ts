import { prisma } from '../src/lib/prisma.js';

async function verify() {
  try {
    const userCount = await prisma.user.count();
    console.log(`✅ Connected. Found ${userCount} users.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error);
    process.exit(1);
  }
}

verify();
