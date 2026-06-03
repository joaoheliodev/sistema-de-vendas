import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { BookOpen, Plus, Edit2, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default async function AdminCursosPage() {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') redirect('/dashboard');

  const courses = await prisma.course.findMany({
    include: {
      _count: { select: { modules: true, accesses: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-display text-5xl text-white text-3d-white">CURSOS</h1>
          <p className="text-zinc-600 text-xs tracking-[0.4em] uppercase" style={{ fontFamily: 'var(--font-space)' }}>Gerenciar cursos</p>
        </div>
        <Link
          href="/admin/cursos/novo"
          className="bg-[#CCFF00] text-black px-5 py-2.5 flex items-center gap-2 btn-brutal heading-editorial text-xs tracking-[0.2em]"
        >
          <Plus className="w-4 h-4" />
          Novo Curso
        </Link>
      </div>

      <div className="space-y-3">
        {courses.length === 0 && (
          <div className="bg-[#0A0A0A] border-2 border-[#1A1A1A] p-12 text-center">
            <BookOpen className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-500 font-mono">Nenhum curso cadastrado ainda.</p>
            <Link href="/admin/cursos/novo" className="text-[#CCFF00] font-bold text-sm mt-2 inline-block hover:underline">
              + Criar primeiro curso
            </Link>
          </div>
        )}
        {courses.map((course) => (
          <div key={course.id} className="bg-[#0A0A0A] border-2 border-[#1A1A1A] p-5 flex items-center justify-between hover:border-[#CCFF00]/20 transition-colors group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-500/10 text-indigo-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-white font-bold">{course.title}</h3>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-xs text-zinc-500 font-mono">{course._count.modules} módulos</span>
                  <span className="text-xs text-zinc-500 font-mono">{course._count.accesses} alunos</span>
                  {course.published ? (
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20">PUBLICADO</span>
                  ) : (
                    <span className="text-xs font-bold text-zinc-500 bg-zinc-800 px-2 py-0.5 border border-zinc-700">RASCUNHO</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Link href={`/admin/cursos/${course.id}/editar`} className="p-2 text-zinc-500 hover:text-[#CCFF00] transition-colors" title="Editar">
                <Edit2 className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
