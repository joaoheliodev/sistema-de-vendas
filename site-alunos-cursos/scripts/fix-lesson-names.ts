import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

async function fixLessonNames() {
  const lessons = await prisma.lesson.findMany({
    include: { module: true }
  });

  console.log(`Found ${lessons.length} lessons to update.`);

  for (const lesson of lessons) {
    if (lesson.module) {
      // O nome do módulo está como "[MÓDULO 1] - Blabla"
      // Vamos renomear a aula para "[AULA 1] - Blabla" ou simplesmente usar o mesmo nome do módulo
      const newTitle = lesson.module.title.replace("[MÓDULO", "[AULA");
      
      await prisma.lesson.update({
        where: { id: lesson.id },
        data: { title: newTitle }
      });
      console.log(`Updated lesson ${lesson.id} to: ${newTitle}`);
    }
  }

  console.log("All lesson names updated successfully!");
}

fixLessonNames()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
