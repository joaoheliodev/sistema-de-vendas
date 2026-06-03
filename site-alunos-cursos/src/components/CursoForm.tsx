'use client';

import { useState } from 'react';
import { createCursoAction, updateCursoAction, deleteCursoAction } from '@/app/actions/cursos';
import { UploadButton } from './UploadButton';
import { Save, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface CursoFormProps {
  course?: {
    id: string;
    title: string;
    description: string | null;
    coverImage: string | null;
    published: boolean;
  };
}

export function CursoForm({ course }: CursoFormProps) {
  const [coverImageUrl, setCoverImageUrl] = useState<string>(course?.coverImage || '');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!course) return;
    if (confirm('Tem certeza de que deseja excluir este curso? Todas as aulas e progresso dos alunos serão removidos.')) {
      setIsDeleting(true);
      try {
        await deleteCursoAction(course.id);
      } catch (err) {
        console.error(err);
        alert('Erro ao excluir curso.');
        setIsDeleting(false);
      }
    }
  };

  const actionWithId = course ? updateCursoAction.bind(null, course.id) : createCursoAction;

  return (
    <div className="bg-[#0A0A0A] border-2 border-[#1A1A1A] p-8 space-y-6">
      <form action={actionWithId} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-mono text-[#CCFF00] tracking-widest">TÍTULO DO CURSO</label>
          <input
            type="text"
            name="title"
            required
            defaultValue={course?.title || ''}
            className="w-full bg-[#111] border-2 border-[#222] focus:border-[#CCFF00] text-white p-3.5 outline-none transition-all font-mono placeholder:text-zinc-700"
            placeholder="Ex: Formação Defesa Cibernética"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-mono text-[#CCFF00] tracking-widest">DESCRIÇÃO (OPCIONAL)</label>
          <textarea
            name="description"
            rows={4}
            defaultValue={course?.description || ''}
            className="w-full bg-[#111] border-2 border-[#222] focus:border-[#CCFF00] text-white p-3.5 outline-none transition-all font-mono resize-none placeholder:text-zinc-700"
            placeholder="Descreva o conteúdo e objetivo do curso..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-mono text-[#CCFF00] tracking-widest block mb-1">IMAGEM DE CAPA</label>
          <UploadButton
            onUploadComplete={(url) => setCoverImageUrl(url)}
            label="Escolher Capa"
            defaultValue={coverImageUrl}
          />
          <input type="hidden" name="coverImage" value={coverImageUrl} />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="published"
            value="true"
            id="published"
            defaultChecked={course?.published}
            className="w-5 h-5 accent-[#CCFF00] bg-[#111]"
          />
          <label htmlFor="published" className="text-sm font-bold text-zinc-400 uppercase tracking-wider">
            Publicar imediatamente
          </label>
        </div>

        <div className="pt-6 border-t-2 border-[#1A1A1A] flex justify-between">
          {course ? (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-black border-2 border-red-500/20 hover:border-red-500 px-5 py-3 font-black uppercase text-xs flex items-center gap-2 transition-all card-3d"
            >
              <Trash2 className="w-4 h-4" />
              Excluir Curso
            </button>
          ) : (
            <div />
          )}

          <button
            type="submit"
            className="bg-[#CCFF00] hover:bg-[#b3ff00] text-black px-6 py-3 font-black uppercase flex items-center gap-2 transition-colors shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] btn-brutal"
          >
            <Save className="w-4 h-4" />
            Salvar Curso
          </button>
        </div>
      </form>
    </div>
  );
}
