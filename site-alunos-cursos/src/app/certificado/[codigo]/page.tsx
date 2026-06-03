import { prisma } from '@/lib/prisma';
import { Award, CheckCircle2, ShieldX } from 'lucide-react';
import Link from 'next/link';
import { TiltCard } from '@/components/ui/TiltCard';
export default async function CertificadoValidadorPage(props: { params: Promise<{ codigo: string }> }) {
  const params = await props.params;
  const codigo = params.codigo;

  const certificate = await prisma.certificate.findUnique({
    where: { certificateNumber: codigo },
    include: {
      user: true,
      course: true
    }
  });

  if (!certificate) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-8 text-center space-y-6">
        <ShieldX className="w-24 h-24 text-red-500" />
        <h1 className="text-4xl font-bold text-white uppercase">Certificado Inválido</h1>
        <p className="text-zinc-400 max-w-lg">
          O código <strong>{codigo}</strong> não foi encontrado em nossa base de dados. 
          Este certificado não é autêntico ou foi digitado incorretamente.
        </p>
        <Link href="/" className="bg-zinc-800 text-white px-6 py-3 font-bold uppercase mt-4 hover:bg-zinc-700">
          Voltar ao Início
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-8 text-center space-y-12" style={{ perspective: '1500px' }}>
      <div className="space-y-4">
        <div className="mx-auto w-fit bg-emerald-500/10 p-6 rounded-full border-4 border-emerald-500 mb-6 flex items-center justify-center relative shadow-[0_0_40px_rgba(16,185,129,0.3)]">
          <CheckCircle2 className="w-16 h-16 md:w-24 md:h-24 text-emerald-500" />
        </div>
        <h1 className="heading-display text-5xl md:text-7xl text-emerald-500 text-3d neon-glow">CERTIFICADO<br/>AUTÊNTICO</h1>
        <p className="text-zinc-400 font-mono tracking-widest text-sm md:text-base">REGISTRO OFICIAL CYBERSEG</p>
      </div>

      <TiltCard className="w-full max-w-3xl">
        <div className="bg-[#111] border-4 border-[#1A1A1A] p-8 md:p-12 w-full text-left space-y-8 shadow-[12px_12px_0px_0px_#CCFF00] relative overflow-hidden group">
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#CCFF00 1px, transparent 1px), linear-gradient(90deg, #CCFF00 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          
          <div style={{ transform: 'translateZ(40px)' }}>
            <span className="heading-editorial text-sm tracking-[0.3em] text-zinc-500">CÓDIGO DE VALIDAÇÃO</span>
            <p className="heading-display text-4xl md:text-5xl text-[#CCFF00] mt-2">{certificate.certificateNumber}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t-4 border-[#1A1A1A] pt-8" style={{ transform: 'translateZ(30px)' }}>
            <div>
              <span className="heading-editorial text-sm tracking-[0.3em] text-zinc-500">ALUNO TITULAR</span>
              <p className="heading-display text-3xl md:text-4xl text-white mt-2">{certificate.user.name}</p>
            </div>
            <div>
              <span className="heading-editorial text-sm tracking-[0.3em] text-zinc-500">CURSO CONCLUÍDO</span>
              <p className="heading-display text-3xl md:text-4xl text-white mt-2">{certificate.course.title}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t-4 border-[#1A1A1A] pt-8" style={{ transform: 'translateZ(20px)' }}>
            <div>
              <span className="heading-editorial text-sm tracking-[0.3em] text-zinc-500">DATA DE EMISSÃO</span>
              <p className="heading-display text-3xl md:text-4xl text-white mt-2">{certificate.issuedAt.toLocaleDateString('pt-BR')}</p>
            </div>
            <div>
              <span className="heading-editorial text-sm tracking-[0.3em] text-zinc-500">STATUS</span>
              <p className="heading-display text-3xl md:text-4xl text-emerald-500 mt-2 flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8" /> VÁLIDO
              </p>
            </div>
          </div>
        </div>
      </TiltCard>

      <Link href="/" className="btn-brutal px-8 py-5 flex items-center justify-center bg-white text-black border-4 border-black mt-8" style={{ boxShadow: '8px 8px 0px 0px #CCFF00' }}>
        <span className="heading-editorial text-lg tracking-[0.2em]">ACESSAR PLATAFORMA</span>
      </Link>
    </div>
  );
}
