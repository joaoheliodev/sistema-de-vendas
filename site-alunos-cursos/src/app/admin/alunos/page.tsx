import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Users, Ban, UserCheck, KeyRound, Award, Trash2 } from 'lucide-react';
import {
  blockStudentAction,
  unblockStudentAction,
  resetStudentPasswordAction,
  issueCertificateManualAction,
  revokeCertificateAction
} from '@/app/actions/admin-alunos';

export const dynamic = 'force-dynamic';

export default async function AdminAlunosPage() {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') redirect('/dashboard');

  const students = await prisma.user.findMany({
    where: { role: 'STUDENT' },
    include: {
      courseAccess: { include: { course: true } },
      certificates: { include: { course: true } },
      _count: { select: { examAttempts: true, progress: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  const allCourses = await prisma.course.findMany({
    select: { id: true, title: true }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white uppercase italic tracking-tight">Alunos</h1>
        <p className="text-zinc-500 mt-1 font-mono text-sm">[ GESTÃO DE ACESSOS E CERTIFICADOS ]</p>
      </div>

      <div className="space-y-4">
        {students.length === 0 && (
          <div className="bg-[#0A0A0A] border-2 border-[#1A1A1A] p-12 text-center">
            <Users className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-500 font-mono">Nenhum aluno encontrado.</p>
          </div>
        )}
        
        {students.map((student) => {
          return (
            <div key={student.id} className="bg-[#0A0A0A] border-2 border-[#1A1A1A] p-6 hover:border-[#CCFF00]/20 transition-colors space-y-6">
              
              {/* Header Info */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#CCFF00]/10 text-[#CCFF00] flex items-center justify-center font-black text-lg border-2 border-[#CCFF00]/20">
                    {(student.name || 'A').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">{student.name || 'Sem Nome'}</h3>
                    <p className="text-xs text-zinc-500 font-mono">{student.email}</p>
                    <p className="text-[10px] text-zinc-600 font-mono">Cadastrado em: {student.createdAt.toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <div>
                    <span className="text-zinc-600 block">TENTATIVAS DE EXAME</span>
                    <span className="text-white font-bold text-sm">{student._count.examAttempts}</span>
                  </div>
                  <div className="border-l border-[#1A1A1A] pl-4">
                    <span className="text-zinc-600 block">AULAS ASSISTIDAS</span>
                    <span className="text-white font-bold text-sm">{student._count.progress}</span>
                  </div>
                </div>
              </div>

              {/* Course Access Status & Access Management */}
              <div className="border-t border-[#1A1A1A] pt-4 space-y-3">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Matrículas e Acesso</h4>
                
                {student.courseAccess.length === 0 && (
                  <p className="text-xs text-zinc-600 font-mono">[ Sem matrículas ativas ]</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {student.courseAccess.map((access) => {
                    const isBlocked = access.status === 'BLOCKED';
                    return (
                      <div key={access.id} className="bg-[#111] p-4 border-2 border-[#1A1A1A] flex items-center justify-between">
                        <div>
                          <p className="text-white text-xs font-bold font-mono">{access.course.title}</p>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 border mt-1 inline-block ${
                            isBlocked ? 'text-red-400 bg-red-500/10 border-red-500/20' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                          }`}>
                            {access.status}
                          </span>
                        </div>

                        <div>
                          {isBlocked ? (
                            <form action={async () => {
                              'use server';
                              await unblockStudentAction(student.id, access.courseId);
                            }}>
                              <button type="submit" className="text-xs font-mono font-bold bg-emerald-500 text-black px-3 py-1.5 hover:bg-emerald-400 transition-colors flex items-center gap-1">
                                <UserCheck className="w-3.5 h-3.5" /> Reativar
                              </button>
                            </form>
                          ) : (
                            <form action={async () => {
                              'use server';
                              await blockStudentAction(student.id, access.courseId);
                            }}>
                              <button type="submit" className="text-xs font-mono font-bold bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-black px-3 py-1.5 transition-all">
                                <Ban className="w-3.5 h-3.5" /> Bloquear
                              </button>
                            </form>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Certificates Control */}
              <div className="border-t border-[#1A1A1A] pt-4 space-y-3">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Certificados</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* List active certificates */}
                  {student.certificates.map((cert) => (
                    <div key={cert.id} className="bg-[#111] p-4 border-2 border-[#1A1A1A] flex items-center justify-between">
                      <div>
                        <p className="text-white text-xs font-bold">{cert.course.title}</p>
                        <span className="text-[10px] text-zinc-500 font-mono block mt-0.5">Código: {cert.certificateNumber}</span>
                      </div>

                      <form action={async () => {
                        'use server';
                        await revokeCertificateAction(cert.id);
                      }}>
                        <button type="submit" className="text-xs font-mono font-bold text-red-500 hover:bg-red-500/10 p-2 border border-red-500/10 hover:border-red-500/30 transition-all" title="Revogar Certificado">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  ))}

                  {/* Manual Certificate Issue Form */}
                  {allCourses.map((c) => {
                    const hasCert = student.certificates.some(cert => cert.courseId === c.id);
                    const hasAccess = student.courseAccess.some(acc => acc.courseId === c.id);
                    
                    if (hasCert || !hasAccess) return null;

                    return (
                      <div key={c.id} className="bg-[#111] p-4 border-2 border-dashed border-[#1A1A1A] flex items-center justify-between">
                        <div>
                          <p className="text-zinc-500 text-xs font-bold font-mono">{c.title}</p>
                          <span className="text-[9px] text-zinc-600 font-mono block mt-0.5">Certificado pendente</span>
                        </div>

                        <form action={async () => {
                          'use server';
                          await issueCertificateManualAction(student.id, c.id);
                        }}>
                          <button type="submit" className="text-xs font-mono font-bold bg-[#CCFF00]/10 text-[#CCFF00] border border-[#CCFF00]/20 hover:bg-[#CCFF00] hover:text-black px-3 py-1.5 transition-all flex items-center gap-1">
                            <Award className="w-3.5 h-3.5" /> Emitir Manual
                          </button>
                        </form>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Password Reset Section */}
              <div className="border-t border-[#1A1A1A] pt-4">
                <details className="group cursor-pointer">
                  <summary className="text-xs font-mono text-[#CCFF00] font-bold hover:underline list-none flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5" /> REDEFINIR SENHA DO ALUNO
                  </summary>
                  <div className="mt-3 bg-[#111] border-2 border-[#1A1A1A] p-4 max-w-md">
                    <form action={resetStudentPasswordAction} className="flex gap-2">
                      <input type="hidden" name="userId" value={student.id} />
                      <input
                        type="password"
                        name="password"
                        required
                        placeholder="Nova senha (min 6 caracteres)"
                        className="flex-1 bg-[#0A0A0A] border-2 border-[#222] focus:border-[#CCFF00] text-white px-3 py-2 text-xs font-mono outline-none"
                      />
                      <button type="submit" className="bg-[#CCFF00] text-black text-xs font-mono font-bold px-4 py-2 hover:bg-[#b3ff00] transition-colors btn-brutal">
                        Alterar
                      </button>
                    </form>
                  </div>
                </details>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
