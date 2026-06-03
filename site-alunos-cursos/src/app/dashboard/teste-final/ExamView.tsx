'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export function ExamView({ exam }: { exam: any }) {
  const router = useRouter();
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    // Anti-cola: Embaralhar questões
    const shuffledQs = [...exam.questions].sort(() => Math.random() - 0.5);
    
    // Anti-cola: Embaralhar alternativas, mantendo o index original
    const qsWithOptions = shuffledQs.map(q => {
      let rawOptions = [];
      if (typeof q.options === 'string') rawOptions = JSON.parse(q.options);
      else rawOptions = q.options;

      const mappedOptions = rawOptions.map((opt: string, idx: number) => ({
        text: opt,
        originalIndex: idx
      })).sort(() => Math.random() - 0.5);

      return { ...q, displayOptions: mappedOptions };
    });

    setQuestions(qsWithOptions);
  }, [exam.questions]);

  const handleSelect = (questionId: string, originalIndex: number) => {
    if (result) return; // Prevent changing after submit
    setAnswers(prev => ({ ...prev, [questionId]: originalIndex }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      alert('Por favor, responda todas as questões antes de enviar.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/student/exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ examId: exam.id, answers })
      });
      const data = await res.json();
      setResult(data);
      if (data.approved) {
        window.scrollTo(0, 0);
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao enviar avaliação.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="space-y-8">
        <div className={`p-8 text-center border-2 ${result.approved ? 'border-emerald-500 bg-emerald-500/10' : 'border-red-500 bg-red-500/10'}`}>
          <h2 className={`text-4xl font-bold mb-4 ${result.approved ? 'text-emerald-500' : 'text-red-500'}`}>
            {result.approved ? 'Aprovado!' : 'Reprovado'}
          </h2>
          <p className="text-xl text-zinc-300">
            Sua nota final: <strong className="text-white">{result.scorePercentage}%</strong> ({result.score} de {questions.length})
          </p>
          <p className="text-zinc-400 mt-2">
            Nota mínima para aprovação: {exam.passingScore}%
          </p>
          
          {result.approved ? (
            <button onClick={() => router.push('/dashboard/certificado/emitir')} className="mt-6 bg-[#CCFF00] hover:bg-[#b3e600] text-black px-8 py-4 font-bold uppercase tracking-wider transition-colors inline-block">
              Emitir Certificado Agora
            </button>
          ) : (
            <button onClick={() => window.location.reload()} className="mt-6 bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-4 font-bold uppercase tracking-wider transition-colors inline-block">
              Tentar Novamente
            </button>
          )}
        </div>

        {!result.approved && result.wrongAnswers && (
          <div className="bg-[#111111] border-2 border-[#2A2A2A] p-6 space-y-6">
            <h3 className="text-xl font-bold text-white border-b-2 border-[#2A2A2A] pb-4 flex items-center gap-2">
              <AlertCircle className="text-red-500" />
              Revisão de Erros
            </h3>
            {result.wrongAnswers.map((wa: any, i: number) => (
              <div key={wa.questionId} className="space-y-2 p-4 bg-black border-2 border-[#2A2A2A]">
                <p className="font-bold text-white">Questão {i + 1}: {wa.questionText}</p>
                <div className="bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-200">
                  <span className="font-bold text-red-500">Sua Resposta: </span> 
                  {wa.userAnswerText}
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 text-sm text-emerald-200">
                  <span className="font-bold text-emerald-500">Explicação: </span>
                  {wa.explanation || 'Nenhuma explicação disponível.'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-4xl font-bold text-[#CCFF00] uppercase tracking-wider">
          {exam.title}
        </h1>
        <p className="text-zinc-400 max-w-2xl mx-auto">
          {exam.description}
        </p>
        <div className="inline-block bg-[#111111] border-2 border-[#2A2A2A] px-6 py-2 mt-4 text-zinc-300">
          Total de <strong>{questions.length}</strong> questões • Nota mínima: <strong>{exam.passingScore}%</strong>
        </div>
      </div>

      <div className="space-y-8">
        {questions.map((q, index) => (
          <div key={q.id} className="bg-[#111111] border-2 border-[#2A2A2A] p-6">
            <h3 className="text-lg font-bold text-white mb-6">
              <span className="text-[#CCFF00] mr-2">{index + 1}.</span>
              {q.question}
            </h3>
            <div className="space-y-3">
              {q.displayOptions.map((opt: any) => {
                const isSelected = answers[q.id] === opt.originalIndex;
                return (
                  <button
                    key={opt.originalIndex}
                    onClick={() => handleSelect(q.id, opt.originalIndex)}
                    className={`w-full text-left p-4 border-2 transition-all flex items-start gap-3 ${
                      isSelected 
                        ? 'border-[#CCFF00] bg-[#CCFF00]/10 text-white' 
                        : 'border-[#2A2A2A] hover:border-zinc-500 text-zinc-400 hover:text-zinc-300'
                    }`}
                  >
                    <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 ${isSelected ? 'border-[#CCFF00] bg-[#CCFF00]' : 'border-zinc-600'}`} />
                    <span>{opt.text}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-0 p-4 bg-[#0A0A0A] border-t-2 border-[#2A2A2A] flex justify-between items-center z-10">
        <span className="text-zinc-400">
          Respondidas: <strong className="text-white">{Object.keys(answers).length}</strong> de {questions.length}
        </span>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-[#CCFF00] hover:bg-[#b3e600] text-black px-8 py-3 font-bold uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Avaliando...' : 'Finalizar Teste'}
        </button>
      </div>
    </div>
  );
}
