import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Award, CheckCircle2, XCircle } from 'lucide-react';

export default async function AdminAvaliacoesPage() {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') redirect('/dashboard');

  const exams = await prisma.finalExam.findMany({
    include: { _count: { select: { questions: true, attempts: true } } },
    orderBy: { id: 'desc' }
  });

  const recentAttempts = await prisma.examAttempt.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: { user: true, exam: true }
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white uppercase italic tracking-tight">Avaliações</h1>
        <p className="text-zinc-500 mt-1 font-mono text-sm">[ TESTES FINAIS ]</p>
      </div>

      {/* Exams */}
      <div className="space-y-3">
        {exams.map((exam) => (
          <div key={exam.id} className="bg-[#0A0A0A] border-2 border-[#1A1A1A] p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-500/10 text-yellow-500">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-white font-bold">{exam.title}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-zinc-500 font-mono">{exam._count.questions} questões</span>
                  <span className="text-xs text-zinc-500 font-mono">Nota mínima: {exam.passingScore}%</span>
                  <span className="text-xs text-zinc-500 font-mono">{exam._count.attempts} tentativas</span>
                  {exam.active ? (
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20">ATIVO</span>
                  ) : (
                    <span className="text-xs font-bold text-zinc-500 bg-zinc-800 px-2 py-0.5 border border-zinc-700">INATIVO</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Attempts */}
      <div>
        <h2 className="text-xl font-black text-white uppercase mb-4">Tentativas Recentes</h2>
        <div className="space-y-2">
          {recentAttempts.length === 0 && (
            <p className="text-zinc-600 font-mono text-sm">Nenhuma tentativa registrada.</p>
          )}
          {recentAttempts.map((attempt) => (
            <div key={attempt.id} className="bg-[#0A0A0A] border-2 border-[#1A1A1A] p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 flex items-center justify-center ${attempt.approved ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                  {attempt.approved ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{attempt.user.name || attempt.user.email}</p>
                  <p className="text-xs text-zinc-600 font-mono">{attempt.exam.title} — Nota: {attempt.score}</p>
                </div>
              </div>
              <span className="text-xs text-zinc-600 font-mono">{attempt.createdAt.toLocaleDateString('pt-BR')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
