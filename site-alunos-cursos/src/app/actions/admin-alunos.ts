'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { revalidatePath } from 'next/cache';

const resetPasswordSchema = z.object({
  userId: z.string().uuid(),
  password: z.string().min(6, "A senha precisa de pelo menos 6 caracteres"),
});

export async function blockStudentAction(userId: string, courseId: string) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') throw new Error('Unauthorized');

  await prisma.courseAccess.update({
    where: {
      userId_courseId: { userId, courseId }
    },
    data: { status: 'BLOCKED' }
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: 'BLOCK_STUDENT',
      entity: 'User',
      entityId: userId,
      details: JSON.stringify({ userId, courseId })
    }
  });

  revalidatePath('/admin/alunos');
}

export async function unblockStudentAction(userId: string, courseId: string) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') throw new Error('Unauthorized');

  await prisma.courseAccess.update({
    where: {
      userId_courseId: { userId, courseId }
    },
    data: { status: 'ACTIVE' }
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: 'UNBLOCK_STUDENT',
      entity: 'User',
      entityId: userId,
      details: JSON.stringify({ userId, courseId })
    }
  });

  revalidatePath('/admin/alunos');
}

export async function resetStudentPasswordAction(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') throw new Error('Unauthorized');

  const rawData = {
    userId: formData.get('userId') as string,
    password: formData.get('password') as string,
  };

  const parsed = resetPasswordSchema.parse(rawData);
  const hashedPassword = await bcrypt.hash(parsed.password, 10);

  await prisma.user.update({
    where: { id: parsed.userId },
    data: { password: hashedPassword }
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: 'RESET_PASSWORD',
      entity: 'User',
      entityId: parsed.userId,
      details: JSON.stringify({ userId: parsed.userId })
    }
  });

  revalidatePath('/admin/alunos');
}

export async function issueCertificateManualAction(userId: string, courseId: string) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') throw new Error('Unauthorized');

  const existingCert = await prisma.certificate.findUnique({
    where: {
      userId_courseId: { userId, courseId }
    }
  });

  if (existingCert) return { error: 'Certificado já emitido' };

  // Generate certificate number
  const count = await prisma.certificate.count();
  const nextNum = String(count + 1).padStart(5, '0');
  const certificateNumber = `CYB-MAN-${nextNum}`;

  const cert = await prisma.certificate.create({
    data: {
      userId,
      courseId,
      certificateNumber,
    }
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: 'MANUAL_ISSUE_CERTIFICATE',
      entity: 'Certificate',
      entityId: cert.id,
      details: JSON.stringify({ userId, courseId, certificateNumber })
    }
  });

  revalidatePath('/admin/alunos');
}

export async function revokeCertificateAction(certificateId: string) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') throw new Error('Unauthorized');

  await prisma.certificate.delete({
    where: { id: certificateId }
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: 'REVOKE_CERTIFICATE',
      entity: 'Certificate',
      entityId: certificateId,
      details: JSON.stringify({ certificateId })
    }
  });

  revalidatePath('/admin/alunos');
}
