import 'dotenv/config';
import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcrypt';

async function main() {
  const adminPassword = await bcrypt.hash('ctRzygwKKCMnF1N3', 10);
  await prisma.user.upsert({
    where: { email: 'admin@cyberseg.com' },
    update: {
      password: adminPassword,
      role: 'ADMIN',
    },
    create: {
      name: 'Admin CyberSeg',
      email: 'admin@cyberseg.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  const alunoPassword = await bcrypt.hash('Aluno@123', 10);
  await prisma.user.upsert({
    where: { email: 'aluno@cyberseg.com' },
    update: {
      password: alunoPassword,
      role: 'STUDENT',
    },
    create: {
      name: 'Aluno Teste',
      email: 'aluno@cyberseg.com',
      password: alunoPassword,
      role: 'STUDENT',
    },
  });

  console.log('Users created/updated successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
