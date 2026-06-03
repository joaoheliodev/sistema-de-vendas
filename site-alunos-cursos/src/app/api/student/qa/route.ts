import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { prisma } from '@/lib/prisma';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { lessonId, question } = await req.json();

    if (!lessonId || !question) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    // Get lesson context
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId }
    });

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    const prompt = `Você é um tutor especialista em Cibersegurança na plataforma "CyberSeg", respondendo à dúvida de um aluno.
Contexto da aula atual do aluno:
Título: "${lesson.title}"
Descrição da aula: "${lesson.content}"

Dúvida do aluno: "${question}"

Responda de forma extremamente didática, direta e educada. Não invente informações se não souber. Utilize formatação Markdown para deixar o texto bonito (negrito, listas, blocos de código se precisar). Mantenha o tom profissional mas encorajador.`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return NextResponse.json({ answer: responseText }, { status: 200 });
  } catch (error: any) {
    console.error('QA Error:', error);
    
    // Check if error is related to invalid API key
    if (error?.message?.includes('403') || error?.message?.includes('404')) {
      return NextResponse.json({ 
        answer: "⚠️ **Erro de Autenticação na IA:** A chave da API fornecida parece estar incorreta ou não pertence ao Google Gemini. Verifique o seu arquivo `.env`." 
      }, { status: 200 }); // Return 200 so the UI displays the message as a chat response
    }

    return NextResponse.json({ 
      answer: "Ocorreu um erro interno ao processar a resposta. Tente novamente." 
    }, { status: 200 });
  }
}
