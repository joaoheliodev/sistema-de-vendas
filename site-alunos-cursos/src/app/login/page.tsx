"use client";

import { signIn } from "next-auth/react";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Shield, Lock, ArrowRight, ChevronDown } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [5, -5]);
  const rotateY = useTransform(mouseX, [-300, 300], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await signIn("credentials", { redirect: false, email, password });
      if (res?.error) {
        setError("Credenciais inválidas.");
      } else {
        // Redireciona para /dashboard - o middleware redireciona ADMINs para /admin automaticamente
        window.location.href = "/dashboard";
      }
    } catch {
      setError("Erro ao fazer login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4 relative overflow-hidden grain-overlay">
      
      {/* Animated BG */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full bg-[#CCFF00]/[0.03] blur-[150px]"
          animate={{ x: [0, 100, -80, 0], y: [0, -60, 80, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: '-10%', left: '10%' }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full bg-indigo-500/[0.02] blur-[120px]"
          animate={{ x: [0, -60, 40, 0], y: [0, 50, -30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          style={{ bottom: '5%', right: '10%' }}
        />
      </div>

      {/* Marquee Banner */}
      <div className="absolute top-0 left-0 w-full overflow-hidden border-b border-[#1A1A1A] bg-[#0A0A0A]/80 backdrop-blur-sm">
        <div className="animate-marquee whitespace-nowrap py-2 flex">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="heading-editorial text-[#CCFF00]/40 text-sm mx-8 tracking-[0.3em]">
              CYBERSEG ★ CIBERSEGURANÇA ★ ETHICAL HACKING ★ PROTEÇÃO DIGITAL ★
            </span>
          ))}
        </div>
      </div>

      {/* Giant Title */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-8 relative z-10"
      >
        <h1 className="heading-display text-[clamp(4rem,12vw,9rem)] text-white text-3d leading-none">
          CYBER<span className="text-[#CCFF00] neon-glow">SEG</span>
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-zinc-600 text-sm tracking-[0.5em] uppercase mt-2 font-light"
          style={{ fontFamily: 'var(--font-space)' }}
        >
          Portal do Aluno
        </motion.p>
      </motion.div>

      {/* 3D Login Card */}
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        style={{ rotateX, rotateY, perspective: 800, transformStyle: "preserve-3d" }}
        className="bg-[#0A0A0A] border-2 border-[#1A1A1A] w-full max-w-md relative z-10"
      >
        {/* Neon line */}
        <motion.div
          className="h-[2px] bg-gradient-to-r from-transparent via-[#CCFF00] to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.5 }}
        />

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-red-500/10 border-l-4 border-red-500 text-red-400 text-sm p-3 font-mono"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <label className="heading-editorial text-[#CCFF00] text-xs tracking-[0.3em]">E-MAIL</label>
              <input 
                type="email" name="email" required
                className="w-full bg-[#111] border-2 border-[#222] focus:border-[#CCFF00] text-white p-3.5 outline-none transition-all placeholder:text-zinc-800 text-sm"
                style={{ fontFamily: 'var(--font-space)' }}
                placeholder="seu@email.com"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <label className="heading-editorial text-[#CCFF00] text-xs tracking-[0.3em]">SENHA</label>
              <div className="relative">
                <input 
                  type="password" name="password" required
                  className="w-full bg-[#111] border-2 border-[#222] focus:border-[#CCFF00] text-white p-3.5 outline-none transition-all placeholder:text-zinc-800 text-sm"
                  placeholder="••••••••"
                />
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700" />
              </div>
            </motion.div>
          </div>

          <motion.button 
            type="submit" 
            disabled={loading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-[#CCFF00] text-black py-4 flex items-center justify-center gap-2 disabled:opacity-50 btn-brutal mt-4"
          >
            <span className="heading-editorial text-lg tracking-[0.2em]">
              {loading ? "AUTENTICANDO..." : "ACESSAR"}
            </span>
            {!loading && <ArrowRight className="w-5 h-5" />}
          </motion.button>
        </form>
      </motion.div>

      {/* Bottom subtle hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-6 flex flex-col items-center text-zinc-700"
      >
        <span className="text-[10px] tracking-[0.5em] uppercase mb-1" style={{ fontFamily: 'var(--font-space)' }}>Scroll</span>
        <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </div>
  );
}
