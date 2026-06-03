import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { LessonView } from './LessonView';

export default async function AulaPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const userId = session.user.id;
  const lessonId = params.id;

  // Fetch current lesson with relations
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      videos: { orderBy: { order: 'asc' } },
      downloads: true,
      module: {
        include: {
          course: true
        }
      }
    }
  });

  if (!lesson) redirect('/dashboard');

  // Ensure user has access
  const access = await prisma.courseAccess.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: lesson.module.courseId
      }
    }
  });

  if (!access || access.status !== 'ACTIVE') {
    redirect('/dashboard');
  }

  // Fetch all modules and lessons for the sidebar playlist
  const courseData = await prisma.course.findUnique({
    where: { id: lesson.module.courseId },
    include: {
      modules: {
        orderBy: { order: 'asc' },
        include: {
          lessons: {
            orderBy: { order: 'asc' }
          }
        }
      }
    }
  });

  // Fetch user's progress for the whole course to show checks
  const userProgress = await prisma.progress.findMany({
    where: {
      userId,
      lesson: {
        module: {
          courseId: lesson.module.courseId
        }
      }
    }
  });

  // Map progress easily
  const progressMap = userProgress.reduce((acc, curr) => {
    acc[curr.lessonId] = {
      completed: curr.completed,
      watchedSeconds: curr.watchedSeconds
    };
    return acc;
  }, {} as Record<string, { completed: boolean; watchedSeconds: number }>);

  // Fetch user's note for this specific lesson
  const note = await prisma.lessonNote.findUnique({
    where: {
      userId_lessonId: { userId, lessonId }
    }
  });

  return (
    <LessonView 
      lesson={lesson} 
      courseData={courseData!} 
      progressMap={progressMap}
      initialNote={note?.content || ''}
      userId={userId}
    />
  );
}
