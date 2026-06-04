import { Role } from '../generated/prisma';
import bcrypt from 'bcrypt';
import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('Start seeding...');

  // 1. Criar Usuário Admin
  const adminPassword = await bcrypt.hash(process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@cyberseg.com' },
    update: {},
    create: {
      name: 'Admin CyberSeg',
      email: 'admin@cyberseg.com',
      password: adminPassword,
      role: Role.ADMIN,
    },
  });
  console.log(`Created admin user with id: ${adminUser.id}`);

  // 2. Criar o Curso
  const course = await prisma.course.create({
    data: {
      title: 'Guia Completo de Cibersegurança',
      description: 'O treinamento definitivo para se tornar um especialista em Segurança da Informação.',
      published: true,
      coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop',
    },
  });
  console.log(`Created course: ${course.title}`);

  // 3. MÓDULO 01
  const mod1 = await prisma.module.create({
    data: {
      courseId: course.id,
      title: 'MÓDULO 01: REDES — FUNDAMENTOS & RECONHECIMENTO',
      order: 1,
    },
  });

  const mod1Topics = [
    'Modelo OSI vs TCP/IP',
    'Three-Way Handshake',
    'Port Scanning com Nmap',
    'DNS Enumeration',
    'ARP Spoofing e MitM',
    'Subnetting e CIDR',
    'Topologias de Rede',
  ];

  for (let i = 0; i < mod1Topics.length; i++) {
    await prisma.lesson.create({
      data: {
        moduleId: mod1.id,
        title: mod1Topics[i],
        content: `Conteúdo da aula sobre ${mod1Topics[i]}...`,
        order: i + 1,
        videos: {
          create: {
            title: 'Vídeo Principal',
            videoId: 'dQw4w9WgXcQ',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            isPrimary: true,
            duration: 1500,
          },
        },
      },
    });
  }

  // 4. MÓDULO 02
  const mod2 = await prisma.module.create({
    data: {
      courseId: course.id,
      title: 'MÓDULO 02: PYTHON, C & C++',
      order: 2,
    },
  });

  const mod2Topics = [
    'Python Sockets',
    'Scapy',
    'Automação de tarefas',
    'Compreensão de malware e defesa',
    'Ponteiros em C',
    'Buffer Overflow (conceitos e mitigação)',
    'Engenharia Reversa Básica',
  ];

  for (let i = 0; i < mod2Topics.length; i++) {
    await prisma.lesson.create({
      data: {
        moduleId: mod2.id,
        title: mod2Topics[i],
        content: `Conteúdo da aula sobre ${mod2Topics[i]}...`,
        order: i + 1,
      },
    });
  }

  // 5. MÓDULO 03
  const mod3 = await prisma.module.create({
    data: {
      courseId: course.id,
      title: 'MÓDULO 03: LÓGICA DE PROGRAMAÇÃO',
      order: 3,
    },
  });

  const mod3Topics = [
    'Pensamento Algorítmico',
    'Big O',
    'Algoritmos de Ordenação',
    'Estruturas de Dados',
    'Hash Tables',
    'Árvores e Grafos',
    'Recursão',
  ];

  for (let i = 0; i < mod3Topics.length; i++) {
    await prisma.lesson.create({
      data: {
        moduleId: mod3.id,
        title: mod3Topics[i],
        order: i + 1,
      },
    });
  }

  // 6. MÓDULO 04
  const mod4 = await prisma.module.create({
    data: {
      courseId: course.id,
      title: 'MÓDULO 04: SISTEMAS OPERACIONAIS',
      order: 4,
    },
  });

  const mod4Topics = [
    'Linux Terminal',
    'Bash Scripting',
    'Permissões Unix',
    'Segurança e Privilégios',
    'Active Directory',
    'GPO e Kerberos',
    'Processos e Serviços',
  ];

  for (let i = 0; i < mod4Topics.length; i++) {
    await prisma.lesson.create({
      data: {
        moduleId: mod4.id,
        title: mod4Topics[i],
        order: i + 1,
      },
    });
  }

  // 7. MÓDULO 05
  const mod5 = await prisma.module.create({
    data: {
      courseId: course.id,
      title: 'MÓDULO 05: BANCO DE DADOS',
      order: 5,
    },
  });

  const mod5Topics = [
    'SQL',
    'JOINS',
    'Segurança contra SQL Injection',
    'MongoDB',
    'Redis',
    'Backups',
    'ACID',
  ];

  for (let i = 0; i < mod5Topics.length; i++) {
    await prisma.lesson.create({
      data: {
        moduleId: mod5.id,
        title: mod5Topics[i],
        order: i + 1,
      },
    });
  }

  // 8. MÓDULO 06
  const mod6 = await prisma.module.create({
    data: {
      courseId: course.id,
      title: 'MÓDULO 06: CLOUD COMPUTING E AWS',
      order: 6,
    },
  });

  const mod6Topics = [
    'IaaS PaaS SaaS',
    'EC2',
    'S3',
    'IAM',
    'VPC',
    'Lambda',
    'CloudTrail',
  ];

  for (let i = 0; i < mod6Topics.length; i++) {
    await prisma.lesson.create({
      data: {
        moduleId: mod6.id,
        title: mod6Topics[i],
        order: i + 1,
      },
    });
  }

  // 9. FINAL EXAM
  const exam = await prisma.finalExam.create({
    data: {
      title: 'CyberSeg Final Assessment',
      description: 'Avaliação final obrigatória para emissão do certificado. A prova contém 30 questões abrangendo todos os módulos.',
      passingScore: 70,
    }
  });

  const questionCategories = [
    { cat: 'Redes', q: 'Qual protocolo é responsável pela tradução de nomes de domínio em endereços IP?' },
    { cat: 'Python/C/C++', q: 'O que caracteriza um Buffer Overflow?' },
    { cat: 'Lógica', q: 'Qual a complexidade de tempo do algoritmo Binary Search no pior caso?' },
    { cat: 'Sistemas Operacionais', q: 'Qual diretório no Linux armazena as senhas dos usuários criptografadas?' },
    { cat: 'Banco de Dados', q: 'O que o princípio ACID garante em bancos de dados relacionais?' },
    { cat: 'Cloud/AWS', q: 'Qual serviço da AWS fornece armazenamento de objetos altamente escalável?' }
  ];

  const allQuestions = [];
  // Gera 5 questões para cada categoria (total 30)
  for (const category of questionCategories) {
    for (let j = 0; j < 5; j++) {
      allQuestions.push({
        examId: exam.id,
        question: `[${category.cat}] ${category.q} (Variação ${j + 1})`,
        options: JSON.stringify([
          'Alternativa A (Incorreta)',
          'Alternativa B (Incorreta)',
          'Alternativa C (Correta)',
          'Alternativa D (Incorreta)'
        ]),
        correct: 2,
        explanation: 'A alternativa C está correta porque define exatamente o conceito abordado na aula correspondente.'
      });
    }
  }

  await prisma.examQuestion.createMany({
    data: allQuestions
  });
  console.log('Created Final Exam with 30 questions.');

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
