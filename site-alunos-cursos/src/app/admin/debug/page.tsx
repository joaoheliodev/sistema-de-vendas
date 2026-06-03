import { prisma } from "@/lib/prisma";

// Forçamos a página a ser dinâmica para sempre buscar os dados mais recentes
export const dynamic = 'force-dynamic';

export default async function DebugPage() {
  const [
    totalUsers,
    totalCourses,
    totalModules,
    totalLessons,
    totalTokens,
    totalSubscriptions,
    webhookLogs
  ] = await Promise.all([
    prisma.user.count(),
    prisma.course.count(),
    prisma.module.count(),
    prisma.lesson.count(),
    prisma.verificationToken.count(),
    prisma.courseAccess.count(),
    prisma.webhookLog.findMany({ orderBy: { createdAt: 'desc' }, take: 5 })
  ]);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-mono">
      <h1 className="text-4xl font-black text-[#CCFF00] uppercase italic mb-8">Admin Debug Panel</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
        <StatCard title="Usuários" value={totalUsers} />
        <StatCard title="Cursos" value={totalCourses} />
        <StatCard title="Módulos" value={totalModules} />
        <StatCard title="Aulas" value={totalLessons} />
        <StatCard title="Tokens (Acesso)" value={totalTokens} />
        <StatCard title="Assinaturas (Access)" value={totalSubscriptions} />
      </div>

      <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">Últimos Webhooks (Kiwify)</h2>
      <div className="space-y-4">
        {webhookLogs.length === 0 ? (
          <p className="text-gray-500">Nenhum log registrado ainda.</p>
        ) : (
          webhookLogs.map(log => (
            <div key={log.id} className="bg-[#111] p-4 border border-gray-800">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[#CCFF00] font-bold uppercase">{log.event}</span>
                <span className="text-xs text-gray-500">{new Date(log.createdAt).toLocaleString()}</span>
              </div>
              <span className={`text-xs px-2 py-1 ${log.status === 'SUCCESS' || log.status === 'RECEIVED' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
                {log.status}
              </span>
              <pre className="mt-4 text-xs text-gray-400 overflow-x-auto p-2 bg-[#0A0A0A]">
                {JSON.stringify(log.payload, null, 2)}
              </pre>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string, value: number }) {
  return (
    <div className="bg-[#111] border border-gray-800 p-6 flex flex-col justify-center items-center hover:border-[#CCFF00] transition-colors">
      <span className="text-gray-400 text-sm mb-2">{title}</span>
      <span className="text-5xl font-black text-white">{value}</span>
    </div>
  );
}
