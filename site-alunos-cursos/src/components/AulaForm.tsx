'use client';

import { useState } from 'react';
import { createAulaAction, updateAulaAction, deleteAulaAction } from '@/app/actions/aulas';
import { UploadButton } from './UploadButton';
import { Save, Trash2, ArrowLeft } from 'lucide-react';

interface AulaFormProps {
  modules: { id: string; title: string; course: { title: string } }[];
  lesson?: {
    id: string;
    title: string;
    moduleId: string;
    order: number;
    content: string | null;
    videos?: {
      id: string;
      title: string | null;
      provider: 'YOUTUBE' | 'VIMEO' | 'BUNNY';
      videoId: string;
    }[];
    downloads?: {
      id: string;
      title: string;
      fileUrl: string;
    }[];
  };
}

export function AulaForm({ modules, lesson }: AulaFormProps) {
  const primaryVideo = lesson?.videos?.[0];
  const primaryDownload = lesson?.downloads?.[0];

  const [downloadUrl, setDownloadUrl] = useState<string>(primaryDownload?.fileUrl || '');
  const [downloadTitle, setDownloadTitle] = useState<string>(primaryDownload?.title || '');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!lesson) return;
    if (confirm('Tem certeza de que deseja excluir esta aula? Esta ação não pode ser desfeita.')) {
      setIsDeleting(true);
      try {
        await deleteAulaAction(lesson.id);
      } catch (err) {
        console.error(err);
        alert('Erro ao excluir aula.');
        setIsDeleting(false);
      }
    }
  };

  const actionWithId = lesson ? updateAulaAction.bind(null, lesson.id) : createAulaAction;

  return (
    <div className="bg-[#0A0A0A] border-2 border-[#1A1A1A] p-8 space-y-6">
      <form action={actionWithId} className="space-y-8">
        
        {/* Seção: Info da Aula */}
        <div className="space-y-6">
          <h3 className="text-sm font-black text-[#CCFF00] uppercase tracking-widest border-b-2 border-[#1A1A1A] pb-2">
            Informações da Aula
          </h3>

          <div className="space-y-2">
            <label className="text-xs font-mono text-zinc-400 tracking-widest">MÓDULO</label>
            <select
              name="moduleId"
              required
              defaultValue={lesson?.moduleId || ''}
              className="w-full bg-[#111] border-2 border-[#222] focus:border-[#CCFF00] text-white p-3.5 outline-none transition-all font-mono"
            >
              <option value="">Selecione um módulo...</option>
              {modules.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.course.title} → {m.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-mono text-zinc-400 tracking-widest">TÍTULO</label>
              <input
                type="text"
                name="title"
                required
                defaultValue={lesson?.title || ''}
                className="w-full bg-[#111] border-2 border-[#222] focus:border-[#CCFF00] text-white p-3.5 outline-none transition-all font-mono placeholder:text-zinc-700"
                placeholder="Ex: Tipos de Malware"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono text-zinc-400 tracking-widest">ORDEM</label>
              <input
                type="number"
                name="order"
                required
                defaultValue={lesson?.order !== undefined ? lesson.order : 0}
                className="w-full bg-[#111] border-2 border-[#222] focus:border-[#CCFF00] text-white p-3.5 outline-none transition-all font-mono"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-zinc-400 tracking-widest">CONTEÚDO TEÓRICO (MARKDOWN)</label>
            <textarea
              name="content"
              rows={5}
              defaultValue={lesson?.content || ''}
              className="w-full bg-[#111] border-2 border-[#222] focus:border-[#CCFF00] text-white p-3.5 outline-none transition-all font-mono text-sm resize-none placeholder:text-zinc-700"
              placeholder="Escreva em markdown..."
            />
          </div>
        </div>

        {/* Seção: Vídeo */}
        <div className="space-y-6">
          <h3 className="text-sm font-black text-[#CCFF00] uppercase tracking-widest border-b-2 border-[#1A1A1A] pb-2">
            Vídeo Principal
          </h3>

          <div className="space-y-2">
            <label className="text-xs font-mono text-zinc-400 tracking-widest">NOME DO VÍDEO</label>
            <input
              type="text"
              name="videoTitle"
              defaultValue={primaryVideo?.title || 'Vídeo Principal'}
              className="w-full bg-[#111] border-2 border-[#222] focus:border-[#CCFF00] text-white p-3.5 outline-none transition-all font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-mono text-zinc-400 tracking-widest">PROVEDOR</label>
              <select
                name="videoProvider"
                defaultValue={primaryVideo?.provider || 'YOUTUBE'}
                className="w-full bg-[#111] border-2 border-[#222] focus:border-[#CCFF00] text-white p-3.5 outline-none transition-all font-mono"
              >
                <option value="YOUTUBE">YouTube</option>
                <option value="VIMEO">Vimeo</option>
                <option value="BUNNY">Bunny CDN</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono text-zinc-400 tracking-widest">ID DO VÍDEO</label>
              <input
                type="text"
                name="videoId"
                required
                defaultValue={primaryVideo?.videoId || ''}
                className="w-full bg-[#111] border-2 border-[#222] focus:border-[#CCFF00] text-white p-3.5 outline-none transition-all font-mono placeholder:text-zinc-700"
                placeholder="Ex: dQw4w9WgXcQ"
              />
            </div>
          </div>
        </div>

        {/* Seção: Downloads / Material Complementar */}
        <div className="space-y-6">
          <h3 className="text-sm font-black text-[#CCFF00] uppercase tracking-widest border-b-2 border-[#1A1A1A] pb-2">
            Material de Apoio (Download)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-mono text-zinc-400 tracking-widest">TÍTULO DO MATERIAL</label>
              <input
                type="text"
                name="downloadTitle"
                value={downloadTitle}
                onChange={(e) => setDownloadTitle(e.target.value)}
                className="w-full bg-[#111] border-2 border-[#222] focus:border-[#CCFF00] text-white p-3.5 outline-none transition-all font-mono placeholder:text-zinc-700"
                placeholder="Ex: Slides da Aula PDF"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono text-zinc-400 tracking-widest block mb-1">ARQUIVO</label>
              <UploadButton
                onUploadComplete={(url) => setDownloadUrl(url)}
                label="Escolher Arquivo"
                accept=".pdf,.zip,.rar,.txt,.docx,.pptx"
                defaultValue={downloadUrl}
                bucket="cyberseg"
              />
              <input type="hidden" name="downloadUrl" value={downloadUrl} />
            </div>
          </div>
        </div>

        {/* Botoes */}
        <div className="pt-6 border-t-2 border-[#1A1A1A] flex justify-between">
          {lesson ? (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-black border-2 border-red-500/20 hover:border-red-500 px-5 py-3 font-black uppercase text-xs flex items-center gap-2 transition-all card-3d"
            >
              <Trash2 className="w-4 h-4" />
              Excluir Aula
            </button>
          ) : (
            <div />
          )}

          <button
            type="submit"
            className="bg-[#CCFF00] hover:bg-[#b3ff00] text-black px-6 py-3 font-black uppercase flex items-center gap-2 transition-colors shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] btn-brutal"
          >
            <Save className="w-4 h-4" />
            Salvar Aula
          </button>
        </div>
      </form>
    </div>
  );
}
