'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const moduloSchema = z.object({
  title: z.string().min(3),
  courseId: z.string().uuid(),
  order: z.coerce.number().int().default(0),
  description: z.string().optional().nullable(),
  parentModuleId: z.string().optional().nullable().transform(val => val === '' ? null : val),
});

export async function createModuloAction(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') throw new Error('Unauthorized');

  const rawData = {
    title: formData.get('title') as string,
    courseId: formData.get('courseId') as string,
    order: formData.get('order') as string,
    description: formData.get('description') as string | null,
    parentModuleId: formData.get('parentModuleId') as string | null,
  };

  const parsed = moduloSchema.parse(rawData);

  const modulo = await prisma.module.create({
    data: {
      title: parsed.title,
      courseId: parsed.courseId,
      order: parsed.order,
      description: parsed.description,
      parentModuleId: parsed.parentModuleId,
    }
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: 'CREATE',
      entity: 'Module',
      entityId: modulo.id,
      details: JSON.stringify(parsed)
    }
  });

  revalidatePath('/admin/modulos');
  redirect('/admin/modulos');
}

export async function updateModuloAction(id: string, formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') throw new Error('Unauthorized');

  const rawData = {
    title: formData.get('title') as string,
    courseId: formData.get('courseId') as string,
    order: formData.get('order') as string,
    description: formData.get('description') as string | null,
    parentModuleId: formData.get('parentModuleId') as string | null,
  };

  const parsed = moduloSchema.parse(rawData);

  const modulo = await prisma.module.update({
    where: { id },
    data: {
      title: parsed.title,
      courseId: parsed.courseId,
      order: parsed.order,
      description: parsed.description,
      parentModuleId: parsed.parentModuleId,
    }
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: 'UPDATE',
      entity: 'Module',
      entityId: modulo.id,
      details: JSON.stringify(parsed)
    }
  });

  revalidatePath('/admin/modulos');
  redirect('/admin/modulos');
}

export async function deleteModuloAction(id: string) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') throw new Error('Unauthorized');

  await prisma.module.delete({
    where: { id }
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: 'DELETE',
      entity: 'Module',
      entityId: id,
      details: JSON.stringify({ id })
    }
  });

  revalidatePath('/admin/modulos');
  redirect('/admin/modulos');
}
