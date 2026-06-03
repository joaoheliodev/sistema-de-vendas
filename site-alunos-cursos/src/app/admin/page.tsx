import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Users, BookOpen, Video, Award, TrendingUp, DollarSign, FolderOpen, Activity, PlayCircle, Trophy, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') redirect('/dashboard');

  // Fetch basic counts
  const [
    totalUsers,
    activeStudents,
    totalCourses,
    totalLessons,
    totalCertificates,
    totalModules,
    courseAccesses,
    refundCount,
    progressList,
    totalCompletedLessons,
    studentsWithProgress,
    recentAccesses
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'STUDENT' } }),
    prisma.courseAccess.count({ where: { status: 'ACTIVE' } }),
    prisma.course.count(),
    prisma.lesson.count(),
    prisma.certificate.count(),
    prisma.module.count(),
    prisma.courseAccess.findMany({ select: { amountPaid: true, createdAt: true } }),
    prisma.webhookLog.count({
      where: {
        event: {
          in: ['refunded', 'chargeback', 'refund', 'chargeback_approved']
        }
      }
    }),
    prisma.progress.findMany({ select: { watchedSeconds: true } }),
    prisma.progress.count({ where: { completed: true } }),
    prisma.user.count({
      where: {
        role: 'STUDENT',
        progress: { some: {} }
      }
    }),
    prisma.courseAccess.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: true, course: true }
    })
  ]);

  // Calculations
  const totalRevenue = courseAccesses.reduce((acc, curr) => acc + (curr.amountPaid || 0), 0);
  
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const monthlyRevenue = courseAccesses
    .filter(acc => acc.createdAt >= thirtyDaysAgo)
    .reduce((acc, curr) => acc + (curr.amountPaid || 0), 0);

  const totalSeconds = progressList.reduce((acc, curr) => acc + curr.watchedSeconds, 0);
  const totalHoursStudied = Math.round(totalSeconds / 3600);

  const averageCompletionRate = (totalUsers > 0 && totalLessons > 0)
    ? Math.round((totalCompletedLessons / (totalUsers * totalLessons)) * 100)
    : 0;

  const retentionRate = totalUsers > 0
    ? Math.round((studentsWithProgress / totalUsers) * 100)
    : 0;

  const stats = [
    { label: 'ALUNOS TOTAL', value: totalUsers, icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { label: 'MATRÍCULAS ATIVAS', value: activeStudents, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'CURSOS', value: totalCourses, icon: BookOpen, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'AULAS', value: totalLessons, icon: Video, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { label: 'HORAS ASSISTIDAS', value: `${totalHoursStudied}h`, icon: PlayCircle, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'CERTIFICADOS', value: totalCertificates, icon: Award, color: 'text-[#CCFF00]', bg: 'bg-[#CCFF00]/10' },
  ];

  const financialStats = [
    { label: 'RECEITA TOTAL', value: `R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, icon: DollarSign, color: 'text-emerald-400' },
    { label: 'RECEITA MENSAL (30D)', value: `R$ ${monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, icon: TrendingUp, color: 'text-cyan-400' },
    { label: 'REEMBOLSOS / ESTORNOS', value: refundCount, icon: RefreshCw, color: 'text-red-400' },
  ];

  const engagementStats = [
    { label: 'CONCLUSÃO MÉDIA', value: `${averageCompletionRate}%`, desc: 'Percentual médio de progresso dos alunos' },
    { label: 'TAXA DE RETENÇÃO', value: `${retentionRate}%`, desc: 'Alunos que iniciaram pelo menos 1 aula' },
  ];

  const quickActions = [
    { label: 'NOVO CURSO', href: '/admin/cursos/novo', icon: BookOpen },
    { label: 'NOVO MÓDULO', href: '/admin/modulos/novo', icon: FolderOpen },
    { label: 'NOVA AULA', href: '/admin/aulas/nova', icon: Video },
    { label: 'VENDAS & WEBHOOKS', href: '/admin/webhooks', icon: Activity },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-zinc-600 text-xs tracking-[0.4em] uppercase mb-1" style={{ fontFamily: 'var(--font-space)' }}>Painel de controle</p>
        <h1 className="heading-display text-[clamp(3rem,8vw,5rem)] text-white text-3d-white leading-none">DASHBOARD</h1>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {financialStats.map((fStat) => (
          <div key={fStat.label} className="bg-[#0A0A0A] border-2 border-[#1A1A1A] p-6 card-3d flex items-center justify-between">
            <div>
              <span className="heading-editorial text-[10px] tracking-[0.3em] text-zinc-600 block">{fStat.label}</span>
              <span className="heading-display text-2xl lg:text-3xl text-white block mt-1">{fStat.value}</span>
            </div>
            <div className={`p-3 bg-zinc-900 ${fStat.color}`}>
              <fStat.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      {/* Basic Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-[#0A0A0A] border-2 border-[#1A1A1A] p-4 card-3d">
            <div className={`p-2 ${stat.bg} ${stat.color} inline-block mb-3`}>
              <stat.icon className="w-4 h-4" />
            </div>
            <span className="heading-editorial text-[9px] tracking-[0.3em] text-zinc-600 block">{stat.label}</span>
            <span className="heading-display text-2xl text-white block">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Engagement Analytics & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Engagement */}
        <div className="bg-[#0A0A0A] border-2 border-[#1A1A1A] p-6">
          <h2 className="heading-display text-2xl text-white mb-4">ANALYTICS DE ENGAJAMENTO</h2>
          <div className="space-y-4">
            {engagementStats.map((stat) => (
              <div key={stat.label} className="bg-[#111] border-2 border-[#1A1A1A] p-4 flex items-center justify-between">
                <div>
                  <h4 className="heading-editorial text-xs tracking-wider text-white font-bold">{stat.label}</h4>
                  <p className="text-[11px] text-zinc-600 font-mono mt-0.5">{stat.desc}</p>
                </div>
                <span className="heading-display text-4xl text-[#CCFF00] neon-glow">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#0A0A0A] border-2 border-[#1A1A1A] p-6">
          <h2 className="heading-display text-2xl text-white mb-4">AÇÕES RÁPIDAS</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <Link key={action.label} href={action.href}
                className="flex flex-col items-center justify-center p-5 bg-[#111] border-2 border-[#1A1A1A] text-zinc-500 hover:text-[#CCFF00] hover:border-[#CCFF00]/30 transition-all group card-3d"
              >
                <action.icon className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                <span className="heading-editorial text-[10px] tracking-[0.2em]">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Registrations */}
      <div className="bg-[#0A0A0A] border-2 border-[#1A1A1A] p-6">
        <h2 className="heading-display text-2xl text-white mb-4">MATRÍCULAS RECENTES</h2>
        <div className="space-y-3">
          {recentAccesses.length === 0 && (
            <p className="text-zinc-700 text-sm font-mono">[ NENHUMA MATRÍCULA REGISTRADA ]</p>
          )}
          {recentAccesses.map((acc) => (
            <div key={acc.id} className="flex items-center justify-between border-b border-[#1A1A1A] pb-3 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#CCFF00]/10 flex items-center justify-center heading-display text-[#CCFF00] text-sm">
                  {(acc.user.name || 'A').charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{acc.user.name || 'Anônimo'}</p>
                  <p className="text-zinc-600 text-xs font-mono">{acc.user.email} &bull; {acc.course.title}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-emerald-400 block font-mono">
                  R$ {(acc.amountPaid || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-zinc-700 text-[10px] font-mono block">
                  {acc.createdAt.toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
