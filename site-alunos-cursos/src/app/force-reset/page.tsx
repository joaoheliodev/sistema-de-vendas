'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ShieldCheck, Loader2 } from 'lucide-react';

export default function ForceResetPage() {
  const router = useRouter();
  const { update } = useSession();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao atualizar senha.');
      }

      // Update session to remove the restriction
      await update({ mustChangePassword: false });
      
      // Use standard alert since toast might not be globally available in all layouts directly
      // Alternatively, we could use a custom Toast if one is set up, but let's stick to a robust UI fallback or custom toast logic here.
      alert('Senha atualizada com sucesso!');
      
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] p-4 font-sans text-zinc-100">
      <div className="max-w-md w-full bg-[#0A0A0A] border-2 border-[#1A1A1A] p-8 shadow-[8px_8px_0px_0px_rgba(204,255,0,0.1)] relative">
        <div className="absolute -top-6 -left-6 bg-emerald-500/10 p-3 border-2 border-emerald-500">
          <ShieldCheck className="w-8 h-8 text-emerald-500" />
        </div>
        
        <h1 className="heading-display text-4xl text-white mt-4 mb-2">REDEFINIÇÃO OBRIGATÓRIA</h1>
        <p className="text-zinc-500 text-sm mb-8" style={{ fontFamily: 'var(--font-space)' }}>
          Por questões de segurança, você precisa definir uma nova senha antes de acessar o portal.
        </p>

        {error && (
          <div className="bg-red-500/10 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-500 text-sm font-bold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="heading-editorial text-xs tracking-[0.2em] text-zinc-400">NOVA SENHA</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#111] border-2 border-[#1A1A1A] p-4 text-white focus:border-[#CCFF00] focus:outline-none transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="heading-editorial text-xs tracking-[0.2em] text-zinc-400">CONFIRMAR NOVA SENHA</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[#111] border-2 border-[#1A1A1A] p-4 text-white focus:border-[#CCFF00] focus:outline-none transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-brutal py-4 flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span className="heading-editorial text-sm tracking-[0.15em]">SALVAR E CONTINUAR</span>}
          </button>
        </form>
      </div>
    </div>
  );
}
