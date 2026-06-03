import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { ExamView } from './ExamView';

export default async function FinalExamPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const userId = session.user.id;

  // Verify Course Access
  const access = await prisma.courseAccess.findFirst({
    where: { userId, status: 'ACTIVE' }
  });

  if (!access) redirect('/dashboard');

  // Verify if 100% completed? For now, we will just allow access or check it.
  // The prompt said "bloqueado se não terminar", but they can click the link. Let's strictly enforce it.
  const courseData = await prisma.course.findUnique({
    where: { id: access.courseId },
    include: {
      modules: { include: { lessons: true } }
    }
  });

  let totalLessons = 0;
  courseData?.modules.forEach(m => { totalLessons += m.lessons.length });

  const completed = await prisma.progress.count({
    where: { userId, completed: true }
  });

  if (totalLessons > 0 && completed < totalLessons) {
    // Return a blocked screen
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <h1 className="text-3xl font-bold text-white">Acesso Negado</h1>
        <p className="text-zinc-400">Você precisa concluir 100% das aulas antes de fazer o Teste Final.</p>
      </div>
    );
  }

  // Fetch Exam
  const exam = await prisma.finalExam.findFirst({
    where: { active: true },
    include: { questions: true }
  });

  if (!exam) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <h1 className="text-3xl font-bold text-white">Prova Indisponível</h1>
        <p className="text-zinc-400">O teste final ainda não foi configurado.</p>
      </div>
    );
  }

  // Check past attempts
  const attempts = await prisma.examAttempt.findMany({
    where: { userId, examId: exam.id },
    orderBy: { createdAt: 'desc' }
  });

  const bestAttempt = attempts.find(a => a.approved);

  // Strip answers to prevent cheating in the client
  const safeQuestions = exam.questions.map(q => ({
    id: q.id,
    question: q.question,
    options: q.options
  }));

  const safeExam = {
    ...exam,
    questions: safeQuestions
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {bestAttempt ? (
        <div className="bg-emerald-500/10 border-2 border-emerald-500 p-8 text-center space-y-4">
          <h2 className="text-3xl font-bold text-emerald-500">Você já está Aprovado!</h2>
          <p className="text-zinc-300">
            Sua maior nota foi <strong>{Math.round((bestAttempt.score / exam.questions.length) * 100)}%</strong>.
          </p>
          <a href="/dashboard/certificado/emitir" className="inline-block bg-[#CCFF00] text-black px-6 py-3 font-bold uppercase tracking-wider mt-4">
            Emitir Certificado Agora
          </a>
        </div>
      ) : (
        <ExamView exam={safeExam} />
      )}
    </div>
  );
}
