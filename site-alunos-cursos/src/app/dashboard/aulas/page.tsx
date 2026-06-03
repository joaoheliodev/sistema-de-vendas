import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { PlayCircle, CheckCircle2, Lock, FolderOpen } from 'lucide-react';

export default async function AulasIndexPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const access = await prisma.courseAccess.findFirst({
    where: { userId: session.user.id, status: 'ACTIVE' },
    include: {
      course: {
        include: {
          modules: {
            orderBy: { order: 'asc' },
            include: {
              lessons: { orderBy: { order: 'asc' } }
            }
          }
        }
      }
    }
  });

  if (!access) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Lock className="w-16 h-16 text-zinc-700 mb-4" />
        <h2 className="text-2xl font-black text-white uppercase">Sem Acesso</h2>
        <p className="text-zinc-500 mt-2 font-mono">Você ainda não possui acesso a nenhum curso.</p>
      </div>
    );
  }

  const userProgress = await prisma.progress.findMany({
    where: { userId: session.user.id }
  });

  const progressMap = userProgress.reduce((acc, curr) => {
    acc[curr.lessonId] = curr.completed;
    return acc;
  }, {} as Record<string, boolean>);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white uppercase italic tracking-tight">{access.course.title}</h1>
        <p className="text-zinc-500 mt-1 font-mono text-sm">[ CONTEÚDO DO CURSO ]</p>
      </div>

      <div className="space-y-4">
        {access.course.modules.map((mod) => (
          <div key={mod.id} className="bg-[#0A0A0A] border-2 border-[#1A1A1A]">
            <div className="flex items-center gap-3 p-4 border-b-2 border-[#1A1A1A]">
              <div className="w-8 h-8 bg-[#CCFF00]/10 text-[#CCFF00] flex items-center justify-center font-black text-sm">
                {mod.order + 1}
              </div>
              <h2 className="text-lg font-black text-white uppercase tracking-wide">{mod.title}</h2>
              <span className="text-xs text-zinc-600 font-mono ml-auto">{mod.lessons.length} aulas</span>
            </div>

            <div className="divide-y-2 divide-[#1A1A1A]">
              {mod.lessons.map((lesson) => {
                const isCompleted = progressMap[lesson.id];
                return (
                  <Link
                    key={lesson.id}
                    href={`/dashboard/aulas/${lesson.id}`}
                    className="flex items-center gap-4 p-4 hover:bg-[#111] transition-colors group"
                  >
                    <span className="shrink-0">
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <PlayCircle className="w-5 h-5 text-zinc-600 group-hover:text-[#CCFF00] transition-colors" />
                      )}
                    </span>
                    <div className="flex-1">
                      <h3 className={`font-bold text-sm ${isCompleted ? 'text-zinc-400' : 'text-white'}`}>
                        {lesson.title}
                      </h3>
                    </div>
                    {isCompleted && (
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20">CONCLUÍDA</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
