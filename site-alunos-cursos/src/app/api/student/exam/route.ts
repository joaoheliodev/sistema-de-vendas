import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { examId, answers } = await req.json();
  if (!examId || !answers) {
    return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
  }

  try {
    const exam = await prisma.finalExam.findUnique({
      where: { id: examId },
      include: { questions: true }
    });

    if (!exam) return NextResponse.json({ error: 'Exam not found' }, { status: 404 });

    let score = 0;
    const wrongAnswers = [];

    // Grade
    for (const question of exam.questions) {
      const userAnswerIndex = answers[question.id];
      if (userAnswerIndex === question.correct) {
        score++;
      } else {
        const rawOptions = typeof question.options === 'string' ? JSON.parse(question.options) : question.options;
        wrongAnswers.push({
          questionId: question.id,
          questionText: question.question,
          explanation: question.explanation,
          userAnswerText: userAnswerIndex !== undefined ? rawOptions[userAnswerIndex] : 'Não respondida'
        });
      }
    }

    const scorePercentage = Math.round((score / exam.questions.length) * 100);
    const approved = scorePercentage >= exam.passingScore;

    // Create Attempt
    await prisma.examAttempt.create({
      data: {
        userId: session.user.id,
        examId: exam.id,
        score,
        approved
      }
    });

    return NextResponse.json({
      approved,
      score,
      scorePercentage,
      wrongAnswers: approved ? [] : wrongAnswers // Optionally only show errors if reprovado, or always. Let's always show.
    });

  } catch (error) {
    console.error('Exam evaluation error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
