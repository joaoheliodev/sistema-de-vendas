import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { CursoForm } from '@/components/CursoForm';

export default async function NovoCursoPage() {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') redirect('/dashboard');

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/cursos" className="p-2 bg-[#111] border-2 border-[#1A1A1A] hover:border-[#CCFF00]/30 text-zinc-400 hover:text-[#CCFF00] transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-white uppercase italic tracking-tight">Novo Curso</h1>
          <p className="text-zinc-500 font-mono text-sm">[ ADICIONAR NOVO CURSO ]</p>
        </div>
      </div>

      <CursoForm />
    </div>
  );
}
