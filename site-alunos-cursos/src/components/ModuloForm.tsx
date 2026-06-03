'use client';

import { useState } from 'react';
import { createModuloAction, updateModuloAction, deleteModuloAction } from '@/app/actions/modulos';
import { Save, Trash2, LayoutGrid, FileText, Link as LinkIcon, Layers } from 'lucide-react';
import Link from 'next/link';

interface ModuloFormProps {
  courses: { id: string; title: string }[];
  allModules?: { id: string; title: string }[];
  module?: {
    id: string;
    title: string;
    courseId: string;
    order: number;
    description?: string | null;
    parentModuleId?: string | null;
  };
}

export function ModuloForm({ courses, allModules = [], module }: ModuloFormProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'content' | 'videos' | 'submodules'>('basic');

  const handleDelete = async () => {
    if (!module) return;
    if (confirm('Tem certeza de que deseja excluir este módulo? Todas as aulas contidas nele serão removidas.')) {
      setIsDeleting(true);
      try {
        await deleteModuloAction(module.id);
      } catch (err) {
        console.error(err);
        alert('Erro ao excluir módulo.');
        setIsDeleting(false);
      }
    }
  };

  const actionWithId = module ? updateModuloAction.bind(null, module.id) : createModuloAction;

  return (
    <div className="bg-[#0A0A0A] border-2 border-[#1A1A1A] rounded-xl shadow-2xl overflow-hidden card-3d">
      <div className="flex border-b-2 border-[#1A1A1A] bg-[#050505] overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('basic')}
          className={`flex items-center gap-2 px-6 py-4 font-mono text-sm uppercase transition-all ${activeTab === 'basic' ? 'bg-[#CCFF00] text-black font-bold' : 'text-zinc-500 hover:text-white hover:bg-[#111]'}`}
        >
          <LayoutGrid className="w-4 h-4" /> Informações
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('content')}
          className={`flex items-center gap-2 px-6 py-4 font-mono text-sm uppercase transition-all ${activeTab === 'content' ? 'bg-[#CCFF00] text-black font-bold' : 'text-zinc-500 hover:text-white hover:bg-[#111]'}`}
        >
          <FileText className="w-4 h-4" /> Instruções do Módulo
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('videos')}
          className={`flex items-center gap-2 px-6 py-4 font-mono text-sm uppercase transition-all ${activeTab === 'videos' ? 'bg-[#CCFF00] text-black font-bold' : 'text-zinc-500 hover:text-white hover:bg-[#111]'}`}
        >
          <LinkIcon className="w-4 h-4" /> Links & Vídeos
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('submodules')}
          className={`flex items-center gap-2 px-6 py-4 font-mono text-sm uppercase transition-all ${activeTab === 'submodules' ? 'bg-[#CCFF00] text-black font-bold' : 'text-zinc-500 hover:text-white hover:bg-[#111]'}`}
        >
          <Layers className="w-4 h-4" /> Submódulos
        </button>
      </div>

      <form action={actionWithId} className="p-8 space-y-6">
        
        {/* TAB: BÁSICO */}
        <div className={activeTab === 'basic' ? 'space-y-6 block' : 'hidden'}>
          <div className="space-y-2">
            <label className="text-xs font-mono text-[#CCFF00] tracking-widest">CURSO PERTENCENTE</label>
            <select
              name="courseId"
              required
              defaultValue={module?.courseId || ''}
              className="w-full bg-[#111] border-2 border-[#222] focus:border-[#CCFF00] text-white p-3.5 outline-none transition-all font-mono rounded"
            >
              <option value="">Selecione um curso...</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-[#CCFF00] tracking-widest">TÍTULO DO MÓDULO</label>
            <input
              type="text"
              name="title"
              required
              defaultValue={module?.title || ''}
              className="w-full bg-[#111] border-2 border-[#222] focus:border-[#CCFF00] text-white p-3.5 outline-none transition-all font-mono placeholder:text-zinc-700 rounded"
              placeholder="Ex: Introdução à Cibersegurança"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-[#CCFF00] tracking-widest">ORDEM</label>
            <input
              type="number"
              name="order"
              required
              defaultValue={module?.order !== undefined ? module.order : 0}
              className="w-full bg-[#111] border-2 border-[#222] focus:border-[#CCFF00] text-white p-3.5 outline-none transition-all font-mono rounded"
            />
          </div>
        </div>

        {/* TAB: CONTEÚDO */}
        <div className={activeTab === 'content' ? 'space-y-6 block' : 'hidden'}>
          <div className="space-y-2">
            <label className="text-xs font-mono text-[#CCFF00] tracking-widest">INSTRUÇÕES / TEXTO DO MÓDULO</label>
            <p className="text-xs text-zinc-500 mb-2 font-mono">Forneça as diretrizes, texto de apoio ou instruções gerais para este módulo.</p>
            <textarea
              name="description"
              defaultValue={module?.description || ''}
              rows={10}
              className="w-full bg-[#111] border-2 border-[#222] focus:border-[#CCFF00] text-white p-3.5 outline-none transition-all font-mono placeholder:text-zinc-700 rounded"
              placeholder="Escreva aqui as instruções do módulo..."
            />
          </div>
        </div>

        {/* TAB: VÍDEOS / LINKS */}
        <div className={activeTab === 'videos' ? 'space-y-6 block' : 'hidden'}>
          <div className="p-6 border-2 border-dashed border-[#222] rounded bg-[#0a0a0a] text-center space-y-4">
            <LinkIcon className="w-12 h-12 text-[#CCFF00] mx-auto opacity-50" />
            <h3 className="text-white font-mono uppercase tracking-widest">Adicionar Links de Vídeos</h3>
            <p className="text-sm text-zinc-500 max-w-md mx-auto">
              Para adicionar vídeos, utilize a seção de "Aulas" dentro do curso para estruturar os vídeos passo a passo. 
              Em breve, suporte para links rápidos anexados diretamente ao módulo.
            </p>
          </div>
        </div>

        {/* TAB: SUBMÓDULOS */}
        <div className={activeTab === 'submodules' ? 'space-y-6 block' : 'hidden'}>
          <div className="space-y-2">
            <label className="text-xs font-mono text-[#CCFF00] tracking-widest">MÓDULO PAI (CRIAR SUBMÓDULO)</label>
            <p className="text-xs text-zinc-500 mb-2 font-mono">Se este item for um submódulo, selecione a qual módulo principal ele pertence.</p>
            <select
              name="parentModuleId"
              defaultValue={module?.parentModuleId || ''}
              className="w-full bg-[#111] border-2 border-[#222] focus:border-[#CCFF00] text-white p-3.5 outline-none transition-all font-mono rounded"
            >
              <option value="">Nenhum (Módulo Principal)</option>
              {allModules.filter(m => m.id !== module?.id).map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-6 border-t-2 border-[#1A1A1A] flex justify-between items-center">
          {module ? (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-black border-2 border-red-500/20 hover:border-red-500 px-5 py-3 font-black uppercase text-xs flex items-center gap-2 transition-all rounded"
            >
              <Trash2 className="w-4 h-4" />
              Excluir
            </button>
          ) : (
            <div />
          )}

          <button
            type="submit"
            className="bg-[#CCFF00] hover:bg-[#b3ff00] text-black px-8 py-4 font-black uppercase tracking-wider flex items-center gap-3 transition-colors shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] btn-brutal rounded"
          >
            <Save className="w-5 h-5" />
            Salvar Módulo
          </button>
        </div>
      </form>
    </div>
  );
}
