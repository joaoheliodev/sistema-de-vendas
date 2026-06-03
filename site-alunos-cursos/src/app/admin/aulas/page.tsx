import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Video, Plus, Edit2 } from 'lucide-react';
import Link from 'next/link';

export default async function AdminAulasPage() {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') redirect('/dashboard');

  const lessons = await prisma.lesson.findMany({
    include: {
      module: { include: { course: true } },
      _count: { select: { videos: true, downloads: true } }
    },
    orderBy: [{ moduleId: 'asc' }, { order: 'asc' }]
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white uppercase italic tracking-tight">Aulas & Vídeos</h1>
          <p className="text-zinc-500 mt-1 font-mono text-sm">[ GERENCIAR CONTEÚDO ]</p>
        </div>
        <Link
          href="/admin/aulas/nova"
          className="bg-[#CCFF00] hover:bg-[#b3ff00] text-black px-5 py-2.5 font-black uppercase text-sm flex items-center gap-2 transition-colors shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]"
        >
          <Plus className="w-4 h-4" />
          Nova Aula
        </Link>
      </div>

      <div className="space-y-3">
        {lessons.length === 0 && (
          <div className="bg-[#0A0A0A] border-2 border-[#1A1A1A] p-12 text-center">
            <Video className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-500 font-mono">Nenhuma aula cadastrada.</p>
          </div>
        )}
        {lessons.map((lesson) => (
          <div key={lesson.id} className="bg-[#0A0A0A] border-2 border-[#1A1A1A] p-5 flex items-center justify-between hover:border-[#CCFF00]/20 transition-colors group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 text-blue-400">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-white font-bold">{lesson.title}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-zinc-600 font-mono">{lesson.module.course.title}</span>
                  <span className="text-xs text-zinc-500">→ {lesson.module.title}</span>
                  <span className="text-xs text-zinc-600 bg-[#111] px-2 py-0.5 border border-[#1A1A1A]">{lesson._count.videos} vídeos</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Link href={`/admin/aulas/${lesson.id}/editar`} className="p-2 text-zinc-500 hover:text-[#CCFF00] transition-colors" title="Editar">
                <Edit2 className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
