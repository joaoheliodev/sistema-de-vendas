'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const cursoSchema = z.object({
  title: z.string().min(3, "O título precisa ter pelo menos 3 caracteres"),
  description: z.string().optional(),
  published: z.boolean().default(false),
  coverImage: z.string().optional(),
});

export async function createCursoAction(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') throw new Error('Unauthorized');

  const rawData = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    published: formData.get('published') === 'true',
    coverImage: formData.get('coverImage') as string || undefined,
  };

  const parsed = cursoSchema.parse(rawData);

  const curso = await prisma.course.create({
    data: {
      title: parsed.title,
      description: parsed.description,
      published: parsed.published,
      coverImage: parsed.coverImage,
    }
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: 'CREATE',
      entity: 'Course',
      entityId: curso.id,
      details: JSON.stringify(parsed)
    }
  });

  revalidatePath('/admin/cursos');
  redirect('/admin/cursos');
}

export async function updateCursoAction(id: string, formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') throw new Error('Unauthorized');

  const rawData = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    published: formData.get('published') === 'true',
    coverImage: formData.get('coverImage') as string || undefined,
  };

  const parsed = cursoSchema.parse(rawData);

  const curso = await prisma.course.update({
    where: { id },
    data: {
      title: parsed.title,
      description: parsed.description,
      published: parsed.published,
      coverImage: parsed.coverImage,
    }
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: 'UPDATE',
      entity: 'Course',
      entityId: curso.id,
      details: JSON.stringify(parsed)
    }
  });

  revalidatePath('/admin/cursos');
  redirect('/admin/cursos');
}

export async function deleteCursoAction(id: string) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') throw new Error('Unauthorized');

  await prisma.course.delete({
    where: { id }
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: 'DELETE',
      entity: 'Course',
      entityId: id,
      details: JSON.stringify({ id })
    }
  });

  revalidatePath('/admin/cursos');
  redirect('/admin/cursos');
}
