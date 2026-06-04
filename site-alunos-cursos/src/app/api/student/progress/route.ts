import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { lessonId, completed } = await req.json();
  if (!lessonId) {
    return NextResponse.json({ error: 'Lesson ID required' }, { status: 400 });
  }

  try {
    // Calculate total duration
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { 
        videos: true,
        module: {
          select: { courseId: true }
        }
      }
    });
    
    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    // Verify if user has active access to the course of this lesson (IDOR prevention)
    const access = await prisma.courseAccess.findFirst({
      where: {
        userId: session.user.id,
        courseId: lesson.module.courseId,
        status: 'ACTIVE'
      }
    });

    if (!access) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    const totalDuration = lesson.videos.reduce((acc, curr) => acc + curr.duration, 0);

    const progress = await prisma.progress.upsert({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId
        }
      },
      update: { 
        completed,
        watchedSeconds: completed ? totalDuration : undefined
      },
      create: {
        userId: session.user.id,
        lessonId,
        completed,
        watchedSeconds: completed ? totalDuration : 0
      }
    });
    
    return NextResponse.json(progress);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
  }
}
