import { prisma } from '../src/lib/prisma';

async function main() {
  const templates = [
    {
      name: 'Lando Norris Neon',
      description: 'Template escuro brutalista com bordas verde neon, inspirado em F1.',
    },
    {
      name: 'Minimalista Dark',
      description: 'Design escuro e limpo para quem prefere simplicidade.',
    },
    {
      name: 'Cyber Security Pro',
      description: 'Estilo clássico corporativo em tons de azul profundo.',
    }
  ];

  for (const t of templates) {
    await prisma.certificateTemplate.create({
      data: t
    });
    console.log(`Template ${t.name} criado.`);
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
