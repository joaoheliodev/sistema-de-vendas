import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Flame, PlayCircle, Trophy, Clock, CheckCircle, Award } from 'lucide-react';
import Link from 'next/link';
import { TiltCard } from '@/components/ui/TiltCard';
export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      progress: true,
      examAttempts: { orderBy: { createdAt: 'desc' }, take: 1 },
    },
  });

  if (!user) redirect('/login');

  const access = await prisma.courseAccess.findFirst({
    where: { userId: user.id },
    include: {
      course: {
        include: {
          modules: { include: { lessons: { include: { videos: true } } } }
        }
      }
    }
  });

  if (!access) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="heading-display text-5xl text-white text-3d mb-4">SEM ACESSO</h2>
        <p className="text-zinc-500" style={{ fontFamily: 'var(--font-space)' }}>Adquira o CyberSeg para iniciar.</p>
      </div>
    );
  }

  let totalLessons = 0;
  let totalCourseSeconds = 0;
  access.course.modules.forEach(mod => {
    totalLessons += mod.lessons.length;
    mod.lessons.forEach(lesson => {
      lesson.videos.forEach(video => {
        totalCourseSeconds += video.duration;
      });
    });
  });

  const completedLessons = user.progress.filter(p => p.completed).length;
  const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  
  const totalWatchedSeconds = user.progress.reduce((acc, curr) => acc + curr.watchedSeconds, 0);
  const hoursStudied = Math.floor(totalWatchedSeconds / 3600);
  const totalCourseHours = Math.floor(totalCourseSeconds / 3600);
  const hoursDisplay = totalCourseHours > 0 ? `${hoursStudied} / ${totalCourseHours}h` : `${hoursStudied}h`;
  const hasFinishedCourse = completedLessons >= totalLessons && totalLessons > 0;
  const bestExamAttempt = user.examAttempts.find(att => att.approved);
  const isApproved = !!bestExamAttempt;

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-zinc-600 text-xs tracking-[0.4em] uppercase mb-1" style={{ fontFamily: 'var(--font-space)' }}>Bem-vindo de volta</p>
          <h1 className="heading-display text-[clamp(3rem,8vw,5rem)] text-white text-3d-white leading-none">
            {user.name || 'ALUNO'}
          </h1>
        </div>
        <div className="flex items-center gap-3 bg-[#0A0A0A] border-2 border-[#1A1A1A] px-5 py-3 self-start">
          <Flame className="w-5 h-5 text-orange-500" />
          <div>
            <span className="heading-editorial text-[10px] tracking-[0.3em] text-zinc-600 block">SEQUÊNCIA</span>
            <span className="heading-display text-2xl text-white">{user.streakDays}</span>
            <span className="text-zinc-500 text-xs ml-1">dias</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-[#0A0A0A] border-2 border-[#1A1A1A] p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="heading-editorial text-xs tracking-[0.2em] text-zinc-500">PROGRESSO GERAL</span>
          <span className="heading-display text-3xl text-[#CCFF00] neon-glow">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-[#111] h-3">
          <div className="bg-[#CCFF00] h-full transition-all duration-700" style={{ width: `${progressPercentage}%` }} />
        </div>
        <p className="text-zinc-600 text-xs mt-2" style={{ fontFamily: 'var(--font-space)' }}>
          {completedLessons} de {totalLessons} aulas concluídas
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3" style={{ perspective: '1200px' }}>
        {[
          { label: 'AULAS', value: `${completedLessons}/${totalLessons}`, icon: PlayCircle, color: 'text-[#CCFF00]', bg: 'bg-[#CCFF00]/10' },
          { label: 'HORAS', value: hoursDisplay, icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'STATUS', value: hasFinishedCourse ? 'CONCLUÍDO' : 'EM CURSO', icon: CheckCircle, color: 'text-purple-400', bg: 'bg-purple-500/10' },
          { label: 'EXAME', value: isApproved ? 'APROVADO' : 'PENDENTE', icon: Trophy, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        ].map((stat) => (
          <TiltCard key={stat.label} className="h-full group">
            <div className="bg-[#0A0A0A] border-2 border-[#1A1A1A] p-4 md:p-6 h-full transition-colors duration-300 group-hover:border-zinc-800">
              <div className="flex items-center gap-3 mb-3" style={{ transform: 'translateZ(30px)' }}>
                <div className={`p-2 ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
              <span className="heading-editorial text-[10px] tracking-[0.3em] text-zinc-600 block" style={{ transform: 'translateZ(20px)' }}>{stat.label}</span>
              <span className="heading-display text-2xl md:text-3xl text-white block mt-1" style={{ transform: 'translateZ(40px)' }}>{stat.value}</span>
            </div>
          </TiltCard>
        ))}
      </div>

      {/* Certificate CTA */}
      <div className="bg-[#0A0A0A] border-2 border-[#1A1A1A] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="heading-display text-3xl md:text-4xl text-white text-3d-white mb-2">CERTIFICADO</h2>
          <p className="text-zinc-500 text-sm max-w-xl" style={{ fontFamily: 'var(--font-space)' }}>
            Conclua 100% + aprovação no teste final (70%+) para emitir.
          </p>
        </div>
        
        <div className="flex flex-col gap-3 w-full md:w-auto md:min-w-[250px]">
          {hasFinishedCourse ? (
            isApproved ? (
              <Link href="/dashboard/certificado/emitir" className="py-4 px-6 flex items-center justify-center gap-2 btn-brutal">
                <Award className="w-5 h-5" />
                <span className="heading-editorial text-sm tracking-[0.15em]">EMITIR CERTIFICADO</span>
              </Link>
            ) : (
              <Link href="/dashboard/teste-final" className="bg-indigo-600 text-white py-4 px-6 flex items-center justify-center gap-2 btn-brutal" style={{ backgroundColor: '#4f46e5', color: '#fff', borderColor: '#fff', boxShadow: '6px 6px 0px 0px #fff' }}>
                <span className="heading-editorial text-sm tracking-[0.15em]">INICIAR TESTE FINAL</span>
              </Link>
            )
          ) : (
            <div className="bg-[#111] text-zinc-600 py-4 px-6 flex items-center justify-center gap-2 cursor-not-allowed border-2 border-[#1A1A1A]">
              <span className="heading-editorial text-sm tracking-[0.15em]">🔒 BLOQUEADO</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
