import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ModuloForm } from '@/components/ModuloForm';

interface EditModuloPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarModuloPage({ params }: EditModuloPageProps) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') redirect('/dashboard');

  const { id } = await params;

  const module = await prisma.module.findUnique({
    where: { id }
  });

  if (!module) {
    notFound();
  }

  const courses = await prisma.course.findMany({
    select: { id: true, title: true },
    orderBy: { title: 'asc' }
  });

  const allModules = await prisma.module.findMany({
    select: { id: true, title: true },
    orderBy: { title: 'asc' }
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/modulos" className="p-2 bg-[#111] border-2 border-[#1A1A1A] hover:border-[#CCFF00]/30 text-zinc-400 hover:text-[#CCFF00] transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-white uppercase italic tracking-tight">Editar Módulo</h1>
          <p className="text-zinc-500 font-mono text-sm">[ ATUALIZAR MÓDULO ]</p>
        </div>
      </div>

      <ModuloForm courses={courses} allModules={allModules} module={module} />
    </div>
  );
}
