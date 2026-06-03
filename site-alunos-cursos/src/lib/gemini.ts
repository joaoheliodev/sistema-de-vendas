import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@/lib/prisma';
import { YoutubeTranscript } from 'youtube-transcript';

// Fallback to empty string to prevent crashing during build if not set
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface GeneratedQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export async function generateExamQuestionsFromContent(title: string, content: string): Promise<GeneratedQuestion[]> {
  if (!process.env.GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY não definida. Nenhuma questão foi gerada.');
    return [];
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `
      Você é um professor especialista em segurança da informação e cibersegurança.
      Com base no seguinte conteúdo da aula e na transcrição do vídeo (Título: ${title}), gere 3 questões de múltipla escolha para um teste final.
      Cada questão deve ter 4 opções (índices 0, 1, 2, 3), a resposta correta e uma breve explicação.
      
      Conteúdo e transcrição da aula:
      ${content}

      Retorne APENAS um JSON válido no formato abaixo, sem formatação markdown em volta:
      [
        {
          "question": "Texto da questão",
          "options": ["Opção A", "Opção B", "Opção C", "Opção D"],
          "correct": 0,
          "explanation": "Explicação do porquê a opção 0 está correta"
        }
      ]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();
    
    // Remove markdown code blocks if present
    if (text.startsWith('```json')) {
      text = text.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (text.startsWith('```')) {
      text = text.replace(/^```/, '').replace(/```$/, '').trim();
    }

    const questions: GeneratedQuestion[] = JSON.parse(text);
    return questions;
  } catch (error) {
    console.error('Erro ao gerar questões com IA:', error);
    return [];
  }
}

export async function processLessonForExam(title: string, content: string, rawVideoId?: string) {
  let finalContent = content || '';

  function getYouTubeId(urlOrId: string) {
    if (!urlOrId) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = urlOrId.match(regExp);
    return (match && match[2].length === 11) ? match[2] : urlOrId;
  }

  if (rawVideoId) {
    const videoId = getYouTubeId(rawVideoId);
    try {
      const transcriptData = await YoutubeTranscript.fetchTranscript(videoId);
      const textTranscript = transcriptData.map(t => t.text).join(' ');
      finalContent += '\n\nTranscrição do Vídeo:\n' + textTranscript;
    } catch (e) {
      console.error('Falha ao obter transcrição do vídeo:', e);
    }
  }

  if (!finalContent || finalContent.length < 50) return; // Skip if content is too short

  const questions = await generateExamQuestionsFromContent(title, finalContent);
  
  if (questions.length === 0) return;

  // Find or create active final exam
  let exam = await prisma.finalExam.findFirst({
    where: { active: true }
  });

  if (!exam) {
    exam = await prisma.finalExam.create({
      data: {
        title: 'Exame Final - CyberSeg',
        description: 'Teste seus conhecimentos finais do curso.',
        passingScore: 70,
        active: true
      }
    });
  }

  // Insert the generated questions
  for (const q of questions) {
    await prisma.examQuestion.create({
      data: {
        examId: exam.id,
        question: q.question,
        options: q.options,
        correct: q.correct,
        explanation: q.explanation
      }
    });
  }
}
