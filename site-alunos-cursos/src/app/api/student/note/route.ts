import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { lessonId, content } = await req.json();
  if (!lessonId) {
    return NextResponse.json({ error: 'Lesson ID required' }, { status: 400 });
  }

  try {
    // Verify if lesson exists and get its course ID
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
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

    const note = await prisma.lessonNote.upsert({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId
        }
      },
      update: { content },
      create: {
        userId: session.user.id,
        lessonId,
        content
      }
    });
    
    return NextResponse.json(note);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save note' }, { status: 500 });
  }
}
