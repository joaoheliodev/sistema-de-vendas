import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Award, Download, CheckCircle2 } from 'lucide-react';

export default async function EmitirCertificadoPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      examAttempts: {
        where: { approved: true }
      },
      certificates: true
    }
  });

  if (!user || user.examAttempts.length === 0) {
    redirect('/dashboard');
  }

  const cert = user.certificates[0];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="bg-[#CCFF00]/10 p-6 rounded-full text-[#CCFF00] mb-4 border-2 border-[#CCFF00]">
        <Award className="w-20 h-20" />
      </div>
      
      <h1 className="text-4xl font-bold text-white uppercase tracking-wider">
        Parabéns, {user.name}!
      </h1>
      
      <p className="text-zinc-400 max-w-2xl text-lg">
        Você concluiu o <strong className="text-white">Guia Completo de Cibersegurança</strong> e foi aprovado no <strong className="text-white">Final Assessment</strong>. Seu esforço e dedicação foram recompensados.
      </p>

      {cert && (
        <div className="bg-[#111111] border-2 border-[#2A2A2A] p-4 text-zinc-300">
          Código do seu Certificado: <strong className="text-[#CCFF00]">{cert.certificateNumber}</strong>
        </div>
      )}

      <a 
        href="/api/certificate/download" 
        target="_blank"
        className="bg-[#CCFF00] hover:bg-[#b3e600] text-black px-8 py-4 font-bold uppercase tracking-wider flex items-center gap-3 transition-colors shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
      >
        <Download className="w-6 h-6" />
        Baixar Certificado em PDF
      </a>
      
      <p className="text-zinc-500 text-sm mt-8 flex items-center justify-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        Certificado válido e verificável através do código de autenticidade.
      </p>
    </div>
  );
}
