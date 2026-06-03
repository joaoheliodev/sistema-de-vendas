'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle2, PlayCircle, Lock, FileText, Download, Edit3, Save, Bot, Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark.css';

export function LessonView({ lesson, courseData, progressMap, initialNote, userId }: any) {
  const router = useRouter();
  const [activeVideo, setActiveVideo] = useState(lesson.videos[0]);
  const [noteContent, setNoteContent] = useState(initialNote);
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [watchPercentage, setWatchPercentage] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);

  // Q&A AI State
  const [qaQuestion, setQaQuestion] = useState('');
  const [qaAnswer, setQaAnswer] = useState('');
  const [isAsking, setIsAsking] = useState(false);

  const currentProgress = progressMap[lesson.id];
  const isCompleted = currentProgress?.completed || false;
  const canComplete = watchPercentage >= 80 && !isCompleted;

  function getYouTubeId(urlOrId: string) {
    if (!urlOrId) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = urlOrId.match(regExp);
    return (match && match[2].length === 11) ? match[2] : urlOrId;
  }

  // Simulate watching the video for testing purposes
  useEffect(() => {
    if (isCompleted) return;
    const interval = setInterval(() => {
      setWatchPercentage(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10; // Increments fast for testing
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [isCompleted]);

  async function handleCompleteLesson() {
    setIsCompleting(true);
    // Call server action or API route to mark as complete
    try {
      await fetch('/api/student/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId: lesson.id, completed: true })
      });
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsCompleting(false);
    }
  }

  async function handleSaveNote() {
    setIsSavingNote(true);
    try {
      await fetch('/api/student/note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId: lesson.id, content: noteContent })
      });
      // Optionally show a toast
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingNote(false);
    }
  }

  async function handleAskAI() {
    if (!qaQuestion.trim()) return;
    setIsAsking(true);
    try {
      const res = await fetch('/api/student/qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId: lesson.id, question: qaQuestion })
      });
      const data = await res.json();
      if (data.answer) {
        setQaAnswer(data.answer);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAsking(false);
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      
      {/* Left Content Area (Player + Details) */}
      <div className="flex-1 space-y-6">
        
        {/* Title */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">{lesson.title}</h1>
          <button 
            disabled={!canComplete && !isCompleted}
            onClick={handleCompleteLesson}
            className={`px-4 py-2 font-bold flex items-center gap-2 transition-all ${
              isCompleted 
                ? 'bg-emerald-500 text-white cursor-default' 
                : canComplete
                  ? 'bg-[#CCFF00] hover:bg-[#b3e600] text-black shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
            {isCompleted ? 'Aula Concluída' : 'Concluir Aula'}
          </button>
        </div>

        {/* Fake Progress Bar for testing */}
        {!isCompleted && (
          <div className="w-full bg-zinc-900 h-1 mt-2">
            <div className="bg-[#CCFF00] h-full transition-all" style={{ width: `${watchPercentage}%` }} />
          </div>
        )}

        {/* Video Player Placeholder */}
        <div className="aspect-video bg-black border-2 border-[#2A2A2A] relative flex items-center justify-center overflow-hidden">
          {activeVideo ? (
            activeVideo.provider === 'YOUTUBE' ? (
              <iframe
                src={`https://www.youtube.com/embed/${getYouTubeId(activeVideo.videoId)}?autoplay=0&rel=0&modestbranding=1`}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="text-center space-y-4">
                <PlayCircle className="w-16 h-16 text-[#CCFF00] mx-auto opacity-50" />
                <p className="text-zinc-500">Player Mock: {activeVideo.provider} ({activeVideo.videoId})</p>
              </div>
            )
          ) : (
            <p className="text-zinc-500">Nenhum vídeo disponível.</p>
          )}
        </div>

        {/* Video Tabs */}
        {lesson.videos.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {lesson.videos.map((vid: any) => (
              <button
                key={vid.id}
                onClick={() => setActiveVideo(vid)}
                className={`px-4 py-2 text-sm font-medium border-2 transition-all ${
                  activeVideo?.id === vid.id 
                    ? 'border-[#CCFF00] text-[#CCFF00] bg-[#CCFF00]/10' 
                    : 'border-[#2A2A2A] text-zinc-400 hover:border-zinc-500'
                }`}
              >
                {vid.title || 'Vídeo'} {vid.isPrimary && '⭐'}
              </button>
            ))}
          </div>
        )}

        {/* Tabs for Markdown / Notes / Downloads */}
        <div className="bg-[#111111] border-2 border-[#2A2A2A] p-6 space-y-8">
          
          {/* Markdown Content */}
          <section>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 border-b-2 border-[#2A2A2A] pb-2">
              <FileText className="w-5 h-5 text-[#CCFF00]" /> Descrição da Aula
            </h3>
            <div className="prose prose-invert prose-pre:bg-[#0A0A0A] prose-pre:border-2 prose-pre:border-[#2A2A2A] max-w-none">
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {lesson.content || 'Nenhuma descrição fornecida.'}
              </ReactMarkdown>
            </div>
          </section>

          {/* Notes */}
          <section>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 border-b-2 border-[#2A2A2A] pb-2">
              <Edit3 className="w-5 h-5 text-[#CCFF00]" /> Minhas Anotações
            </h3>
            <div className="space-y-3">
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Escreva suas anotações aqui..."
                className="w-full h-32 bg-[#0A0A0A] border-2 border-[#2A2A2A] p-4 text-zinc-300 focus:border-[#CCFF00] focus:ring-0 resize-none transition-colors"
              />
              <button 
                onClick={handleSaveNote}
                disabled={isSavingNote}
                className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 text-sm font-bold flex items-center gap-2 transition-colors"
              >
                <Save className="w-4 h-4" />
                {isSavingNote ? 'Salvando...' : 'Salvar Anotação'}
              </button>
            </div>
          </section>

          {/* Downloads */}
          {lesson.downloads.length > 0 && (
            <section>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 border-b-2 border-[#2A2A2A] pb-2">
                <Download className="w-5 h-5 text-[#CCFF00]" /> Materiais
              </h3>
              <div className="flex flex-col gap-2">
                {lesson.downloads.map((dl: any) => (
                  <a 
                    key={dl.id} 
                    href={dl.fileUrl} 
                    target="_blank"
                    className="flex items-center gap-3 p-3 bg-[#0A0A0A] border-2 border-[#2A2A2A] hover:border-[#CCFF00] transition-colors text-zinc-300 hover:text-white"
                  >
                    <Download className="w-4 h-4" />
                    {dl.title}
                  </a>
                ))}
              </div>
            </section>
          )}


        </div>
      </div>

      {/* Right Sidebar */}
      <aside className="w-full lg:w-96 shrink-0 space-y-4">
        
        {/* AI Q&A */}
        <div className="bg-[#111111] border-2 border-[#2A2A2A] p-4 sticky top-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 border-b-2 border-[#2A2A2A] pb-2 uppercase tracking-wider">
            <Bot className="w-5 h-5 text-[#CCFF00]" /> Dúvidas com IA
          </h3>
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <textarea
                rows={3}
                value={qaQuestion}
                onChange={(e) => setQaQuestion(e.target.value)}
                placeholder="Pergunte sobre a aula..."
                className="w-full bg-[#0A0A0A] border-2 border-[#2A2A2A] p-3 text-sm text-zinc-300 focus:border-[#CCFF00] focus:ring-0 transition-colors resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAskAI();
                  }
                }}
              />
              <button 
                onClick={handleAskAI}
                disabled={isAsking || !qaQuestion.trim()}
                className="w-full bg-[#CCFF00] text-black py-3 font-bold disabled:opacity-50 hover:bg-[#b3e600] transition-colors flex items-center justify-center gap-2"
              >
                {isAsking ? 'Pensando...' : <><Send className="w-4 h-4" /> Enviar</>}
              </button>
            </div>

            {qaAnswer && (
              <div className="bg-[#1a1a1a] border-l-4 border-[#CCFF00] p-4 text-sm text-zinc-300 prose prose-invert prose-p:leading-relaxed prose-pre:bg-[#0A0A0A] max-h-96 overflow-y-auto custom-scrollbar">
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {qaAnswer}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>

        {/* Modules Accordion */}
        <div className="bg-[#111111] border-2 border-[#2A2A2A] p-4">
          <h3 className="font-bold text-white uppercase tracking-wider mb-4 border-b-2 border-[#2A2A2A] pb-2">Conteúdo do Curso</h3>
          
          <div className="space-y-2">
            {courseData.modules.map((mod: any) => {
              // Basic logic to expand the module that contains the current lesson
              const isCurrentModule = mod.id === lesson.moduleId;
              
              return (
                <details key={mod.id} className="group" open={isCurrentModule}>
                  <summary className="flex items-center justify-between p-3 bg-[#0A0A0A] border-2 border-[#2A2A2A] cursor-pointer hover:border-zinc-500 transition-colors">
                    <span className="font-bold text-sm text-zinc-300 group-open:text-[#CCFF00] truncate">
                      {mod.title}
                    </span>
                  </summary>
                  
                  <div className="flex flex-col gap-1 p-2 bg-black border-2 border-t-0 border-[#2A2A2A]">
                    {mod.lessons.map((l: any) => {
                      const isCurrentLesson = l.id === lesson.id;
                      const isCompletedLesson = progressMap[l.id]?.completed;
                      
                      return (
                        <Link 
                          key={l.id} 
                          href={`/dashboard/aulas/${l.id}`}
                          className={`flex items-start gap-3 p-2 text-sm transition-colors ${
                            isCurrentLesson ? 'bg-[#CCFF00]/10 text-[#CCFF00]' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                          }`}
                        >
                          <span className="mt-0.5 shrink-0">
                            {isCompletedLesson ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            ) : isCurrentLesson ? (
                              <PlayCircle className="w-4 h-4 text-[#CCFF00]" />
                            ) : (
                              <Lock className="w-4 h-4 text-zinc-600" />
                            )}
                          </span>
                          <span className="leading-tight">{l.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                </details>
              );
            })}
          </div>
        </div>
      </aside>

    </div>
  );
}
