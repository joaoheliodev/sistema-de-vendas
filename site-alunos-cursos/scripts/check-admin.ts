import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@cyberseg.com';
  let admin = await prisma.user.findUnique({
    where: { email },
  });

  if (admin) {
    console.log(`User found: ${admin.email}, Role: ${admin.role}`);
    if (admin.role !== 'ADMIN') {
      console.log('Updating role to ADMIN...');
      await prisma.user.update({
        where: { email },
        data: { role: 'ADMIN' },
      });
      console.log('Role updated successfully.');
    } else {
      console.log('Role is already ADMIN.');
    }
  } else {
    console.log('Admin user not found in the database!');
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
