import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Activity, CheckCircle2, XCircle, Clock } from 'lucide-react';

export default async function WebhooksAdminPage() {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') redirect('/dashboard');

  const logs = await prisma.webhookLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white uppercase italic tracking-tight">Webhooks</h1>
          <p className="text-zinc-500 mt-1 font-mono text-sm">[ LOGS KIWIFY ]</p>
        </div>
        <div className="p-3 bg-[#CCFF00]/10 text-[#CCFF00] border-2 border-[#CCFF00]/20">
          <Activity className="w-5 h-5" />
        </div>
      </div>

      <div className="space-y-3">
        {logs.length === 0 && (
          <div className="bg-[#0A0A0A] border-2 border-[#1A1A1A] p-12 text-center">
            <Activity className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-500 font-mono">Nenhum webhook recebido ainda.</p>
          </div>
        )}
        {logs.map((log) => {
          const eventStr = String(log.event).toUpperCase();
          let icon = <Clock className="w-4 h-4 text-zinc-500" />;
          let borderColor = 'border-[#1A1A1A]';
          if (eventStr === 'PAID' || eventStr === 'APPROVED') {
            icon = <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
            borderColor = 'border-emerald-500/20';
          } else if (eventStr === 'REFUNDED' || eventStr === 'CHARGEBACK') {
            icon = <XCircle className="w-4 h-4 text-red-500" />;
            borderColor = 'border-red-500/20';
          }

          let payloadPreview = "{}";
          try {
            const parsed = typeof log.payload === 'string' ? JSON.parse(log.payload) : log.payload;
            payloadPreview = JSON.stringify(parsed, null, 2);
          } catch {}

          return (
            <div key={log.id} className={`bg-[#0A0A0A] border-2 ${borderColor} p-5`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {icon}
                  <span className="font-bold text-white text-sm uppercase">{log.event}</span>
                  <span className="text-xs font-bold text-zinc-500 bg-[#111] px-2 py-0.5 border border-[#1A1A1A]">{log.status}</span>
                </div>
                <span className="text-xs text-zinc-600 font-mono">{log.createdAt.toLocaleString('pt-BR')}</span>
              </div>
              <details className="cursor-pointer">
                <summary className="text-xs text-[#CCFF00] font-bold hover:underline">VER PAYLOAD</summary>
                <pre className="mt-2 p-3 bg-[#111] border-2 border-[#1A1A1A] text-xs overflow-x-auto text-zinc-400 font-mono">
                  {payloadPreview}
                </pre>
              </details>
            </div>
          );
        })}
      </div>
    </div>
  );
}
