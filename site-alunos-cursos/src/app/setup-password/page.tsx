"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setupPassword } from "./actions";
import { Suspense } from "react";

interface SetupPasswordFormProps {
  tokenProp?: string;
}

export function SetupPasswordForm({ tokenProp }: SetupPasswordFormProps) {
  const searchParams = useSearchParams();
  const token = tokenProp || searchParams.get("token");
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Token Inválido</h1>
        <p className="text-gray-400">O link de acesso está incompleto ou inválido.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const pwd = formData.get("password") as string;
    const confirmPwd = formData.get("confirmPassword") as string;

    if (pwd !== confirmPwd) {
      setError("As senhas não coincidem.");
      setLoading(false);
      return;
    }

    const res = await setupPassword(token, pwd);

    if (res?.error) {
      setError(res.error);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-black text-[#CCFF00] uppercase italic">Acesso Liberado</h1>
        <p className="text-gray-400">Sua senha foi configurada com sucesso.</p>
        <p className="text-sm text-gray-500">Redirecionando para o login...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-sm">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-black text-white uppercase italic tracking-wider">Definir Senha</h1>
        <p className="text-gray-400 text-sm mt-2">Crie sua senha de acesso ao portal CyberSeg.</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-mono text-[#CCFF00] mb-1">NOVA SENHA</label>
          <input 
            type="password" 
            name="password"
            required
            minLength={6}
            className="w-full bg-[#0A0A0A] border border-gray-800 focus:border-[#CCFF00] text-white p-3 outline-none transition-colors"
            placeholder="Mínimo 6 caracteres"
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-[#CCFF00] mb-1">CONFIRMAR SENHA</label>
          <input 
            type="password" 
            name="confirmPassword"
            required
            className="w-full bg-[#0A0A0A] border border-gray-800 focus:border-[#CCFF00] text-white p-3 outline-none transition-colors"
            placeholder="Repita a senha"
          />
        </div>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-[#CCFF00] hover:bg-[#b3ff00] text-black font-black uppercase italic py-4 transition-colors disabled:opacity-50"
      >
        {loading ? "SALVANDO..." : "SALVAR SENHA E ACESSAR"}
      </button>
    </form>
  );
}

export default function SetupPasswordPage() {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <div className="bg-[#111] p-8 border border-gray-800 w-full max-w-md shadow-2xl">
        <Suspense fallback={<div className="text-[#CCFF00] text-center">Carregando...</div>}>
          <SetupPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
