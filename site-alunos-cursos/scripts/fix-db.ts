import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

async function main() {
  // 1. Delete all lessons and videos
  await prisma.video.deleteMany({});
  await prisma.lesson.deleteMany({});
  console.log('Deleted all lessons and videos.');

  // 2. Grant course access to student
  const student = await prisma.user.findUnique({
    where: { email: 'aluno@cyberseg.com' }
  });
  
  const course = await prisma.course.findFirst();

  if (student && course) {
    await prisma.courseAccess.upsert({
      where: {
        userId_courseId: {
          userId: student.id,
          courseId: course.id
        }
      },
      update: {
        status: 'ACTIVE'
      },
      create: {
        userId: student.id,
        courseId: course.id,
        status: 'ACTIVE'
      }
    });
    console.log('Granted course access to aluno@cyberseg.com.');
  } else {
    console.log('Student or Course not found.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
