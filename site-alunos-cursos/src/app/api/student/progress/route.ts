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
      include: { videos: true }
    });
    
    let totalDuration = 0;
    if (lesson) {
      totalDuration = lesson.videos.reduce((acc, curr) => acc + curr.duration, 0);
    }

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
