'use client';

import { useState } from 'react';
import { Upload, Check, Loader2 } from 'lucide-react';
import { uploadFile } from '@/lib/storage';

interface UploadButtonProps {
  onUploadComplete: (url: string) => void;
  label?: string;
  bucket?: string;
  accept?: string;
  defaultValue?: string;
}

export function UploadButton({
  onUploadComplete,
  label = 'Fazer Upload',
  bucket = 'cyberseg',
  accept = 'image/*',
  defaultValue = '',
}: UploadButtonProps) {
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [previewUrl, setPreviewUrl] = useState<string>(defaultValue);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus('uploading');
    try {
      const url = await uploadFile(file, bucket);
      setPreviewUrl(url);
      setStatus('success');
      onUploadComplete(url);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <label className="relative cursor-pointer bg-[#111] border-2 border-dashed border-[#222] hover:border-[#CCFF00] hover:bg-[#111]/80 text-zinc-400 hover:text-white px-5 py-4 flex flex-col items-center justify-center gap-1.5 transition-all text-center min-w-[150px] card-3d">
          <input
            type="file"
            className="hidden"
            accept={accept}
            onChange={handleFileChange}
            disabled={status === 'uploading'}
          />
          {status === 'idle' && (
            <>
              <Upload className="w-5 h-5 text-zinc-500" />
              <span className="text-[10px] font-mono tracking-wider">{label}</span>
            </>
          )}
          {status === 'uploading' && (
            <>
              <Loader2 className="w-5 h-5 text-[#CCFF00] animate-spin" />
              <span className="text-[10px] font-mono tracking-wider text-zinc-500">Enviando...</span>
            </>
          )}
          {status === 'success' && (
            <>
              <Check className="w-5 h-5 text-emerald-400" />
              <span className="text-[10px] font-mono tracking-wider text-emerald-400">Sucesso</span>
            </>
          )}
          {status === 'error' && (
            <>
              <span className="text-red-500 text-xs font-bold">Erro</span>
              <span className="text-[10px] font-mono tracking-wider text-zinc-600">Tentar novamente</span>
            </>
          )}
        </label>

        {previewUrl && (
          <div className="h-16 w-24 border-2 border-[#1A1A1A] bg-[#111] overflow-hidden flex items-center justify-center relative">
            {accept.startsWith('image/') ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewUrl} alt="Preview" className="object-cover h-full w-full" />
            ) : (
              <span className="text-[10px] font-mono text-zinc-500 text-center px-1 truncate w-full">Documento</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
