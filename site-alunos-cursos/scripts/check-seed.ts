import 'dotenv/config';
import { prisma } from '../src/lib/prisma';
import { processLessonForExam } from '../src/lib/gemini';

async function checkAndFix() {
  const course = await prisma.course.findFirst();
  if (!course) {
    console.log("No course found.");
    return;
  }
  
  const module = await prisma.module.findFirst({ where: { courseId: course.id } });
  if (!module) {
    console.log("No module found.");
    return;
  }
  
  const lessons = await prisma.lesson.findMany({ 
    where: { moduleId: module.id },
    include: { videos: true } 
  });
  
  console.log(`Found ${lessons.length} lessons.`);
  for (const lesson of lessons) {
    console.log(`Lesson ${lesson.order}: ${lesson.title} - Video: ${lesson.videos[0]?.videoId}`);
  }
  
  const finalExam = await prisma.finalExam.findFirst({
    include: { questions: true }
  });
  
  console.log(`Final exam has ${finalExam?.questions?.length || 0} questions.`);
}

checkAndFix()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
