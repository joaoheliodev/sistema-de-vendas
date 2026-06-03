import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { AulaForm } from '@/components/AulaForm';

interface EditAulaPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarAulaPage({ params }: EditAulaPageProps) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') redirect('/dashboard');

  const { id } = await params;

  const lesson = await prisma.lesson.findUnique({
    where: { id },
    include: {
      videos: { orderBy: { order: 'asc' } },
      downloads: true
    }
  });

  if (!lesson) {
    notFound();
  }

  const modules = await prisma.module.findMany({
    include: { course: true },
    orderBy: [{ course: { title: 'asc' } }, { order: 'asc' }]
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/aulas" className="p-2 bg-[#111] border-2 border-[#1A1A1A] hover:border-[#CCFF00]/30 text-zinc-400 hover:text-[#CCFF00] transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-white uppercase italic tracking-tight">Editar Aula</h1>
          <p className="text-zinc-500 font-mono text-sm">[ ATUALIZAR CONTEÚDO ]</p>
        </div>
      </div>

      <AulaForm modules={modules} lesson={lesson} />
    </div>
  );
}
