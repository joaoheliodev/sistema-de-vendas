'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getYoutubeVideoDuration } from '@/lib/youtube';
import { processLessonForExam } from '@/lib/gemini';
const aulaSchema = z.object({
  title: z.string().min(3),
  moduleId: z.string().uuid(),
  order: z.coerce.number().int().default(0),
  content: z.string().optional(),
  videoTitle: z.string().optional(),
  videoProvider: z.enum(['YOUTUBE', 'VIMEO', 'BUNNY']).default('YOUTUBE'),
  videoId: z.string().min(1, "O ID do vídeo é obrigatório"),
  downloadTitle: z.string().optional(),
  downloadUrl: z.string().optional(),
});

export async function createAulaAction(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') throw new Error('Unauthorized');

  const rawData = {
    title: formData.get('title') as string,
    moduleId: formData.get('moduleId') as string,
    order: formData.get('order') as string,
    content: formData.get('content') as string,
    videoTitle: formData.get('videoTitle') as string,
    videoProvider: formData.get('videoProvider') as any,
    videoId: formData.get('videoId') as string,
    downloadTitle: formData.get('downloadTitle') as string || undefined,
    downloadUrl: formData.get('downloadUrl') as string || undefined,
  };

  const parsed = aulaSchema.parse(rawData);

  const aula = await prisma.lesson.create({
    data: {
      title: parsed.title,
      moduleId: parsed.moduleId,
      order: parsed.order,
      content: parsed.content,
      videos: {
        create: {
          title: parsed.videoTitle || 'Vídeo Principal',
          provider: parsed.videoProvider,
          videoId: parsed.videoId,
          isPrimary: true,
          duration: parsed.videoProvider === 'YOUTUBE' ? await getYoutubeVideoDuration(parsed.videoId) : 0
        }
      },
      ...(parsed.downloadUrl && parsed.downloadTitle ? {
        downloads: {
          create: {
            title: parsed.downloadTitle,
            fileUrl: parsed.downloadUrl
          }
        }
      } : {})
    }
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: 'CREATE',
      entity: 'Lesson',
      entityId: aula.id,
      details: JSON.stringify(parsed)
    }
  });

  if (parsed.content || parsed.videoId) {
    // Run in background without blocking the request
    const videoId = parsed.videoProvider === 'YOUTUBE' ? parsed.videoId : undefined;
    processLessonForExam(parsed.title, parsed.content || '', videoId).catch(console.error);
  }

  revalidatePath('/admin/aulas');
  redirect('/admin/aulas');
}

export async function updateAulaAction(id: string, formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') throw new Error('Unauthorized');

  const rawData = {
    title: formData.get('title') as string,
    moduleId: formData.get('moduleId') as string,
    order: formData.get('order') as string,
    content: formData.get('content') as string,
    videoTitle: formData.get('videoTitle') as string,
    videoProvider: formData.get('videoProvider') as any,
    videoId: formData.get('videoId') as string,
    downloadTitle: formData.get('downloadTitle') as string || undefined,
    downloadUrl: formData.get('downloadUrl') as string || undefined,
  };

  const parsed = aulaSchema.parse(rawData);

  // 1. Update the lesson details
  const aula = await prisma.lesson.update({
    where: { id },
    data: {
      title: parsed.title,
      moduleId: parsed.moduleId,
      order: parsed.order,
      content: parsed.content,
    }
  });

  // 2. Update or create the primary video
  const primaryVideo = await prisma.video.findFirst({
    where: { lessonId: id, isPrimary: true }
  });

  if (primaryVideo) {
    await prisma.video.update({
      where: { id: primaryVideo.id },
      data: {
        title: parsed.videoTitle || 'Vídeo Principal',
        provider: parsed.videoProvider,
        videoId: parsed.videoId,
        duration: parsed.videoProvider === 'YOUTUBE' ? await getYoutubeVideoDuration(parsed.videoId) : primaryVideo.duration
      }
    });
  } else {
    await prisma.video.create({
      data: {
        lessonId: id,
        title: parsed.videoTitle || 'Vídeo Principal',
        provider: parsed.videoProvider,
        videoId: parsed.videoId,
        isPrimary: true,
        duration: parsed.videoProvider === 'YOUTUBE' ? await getYoutubeVideoDuration(parsed.videoId) : 0
      }
    });
  }

  // 3. Update or create downloads
  if (parsed.downloadUrl && parsed.downloadTitle) {
    const existingDownload = await prisma.download.findFirst({
      where: { lessonId: id }
    });

    if (existingDownload) {
      await prisma.download.update({
        where: { id: existingDownload.id },
        data: {
          title: parsed.downloadTitle,
          fileUrl: parsed.downloadUrl
        }
      });
    } else {
      await prisma.download.create({
        data: {
          lessonId: id,
          title: parsed.downloadTitle,
          fileUrl: parsed.downloadUrl
        }
      });
    }
  }

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: 'UPDATE',
      entity: 'Lesson',
      entityId: aula.id,
      details: JSON.stringify(parsed)
    }
  });

  if (parsed.content || parsed.videoId) {
    // Run in background without blocking the request
    const videoId = parsed.videoProvider === 'YOUTUBE' ? parsed.videoId : undefined;
    processLessonForExam(parsed.title, parsed.content || '', videoId).catch(console.error);
  }

  revalidatePath('/admin/aulas');
  redirect('/admin/aulas');
}

export async function deleteAulaAction(id: string) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') throw new Error('Unauthorized');

  await prisma.lesson.delete({
    where: { id }
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: 'DELETE',
      entity: 'Lesson',
      entityId: id,
      details: JSON.stringify({ id })
    }
  });

  revalidatePath('/admin/aulas');
  redirect('/admin/aulas');
}
