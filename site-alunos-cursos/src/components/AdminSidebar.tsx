'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, FolderOpen, Video, Users, Activity, Award, LogOut, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { signOut } from 'next-auth/react';
import { motion } from 'framer-motion';

const navItems = [
  { name: 'Visão Geral', href: '/admin', icon: LayoutDashboard },
  { name: 'Cursos', href: '/admin/cursos', icon: BookOpen },
  { name: 'Módulos', href: '/admin/modulos', icon: FolderOpen },
  { name: 'Aulas', href: '/admin/aulas', icon: Video },
  { name: 'Avaliações', href: '/admin/avaliacoes', icon: Award },
  { name: 'Alunos', href: '/admin/alunos', icon: Users },
  { name: 'Webhooks', href: '/admin/webhooks', icon: Activity },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:flex w-64 min-h-screen bg-[#0A0A0A] border-r-2 border-[#1A1A1A] flex-col">
        <div className="h-20 flex items-center px-6 border-b-2 border-[#1A1A1A] gap-2">
          <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <Zap className="w-5 h-5 text-[#CCFF00]" />
          </motion.div>
          <h1 className="heading-display text-2xl text-white">
            ADMIN<span className="text-[#CCFF00]">.</span>
          </h1>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1">
          {navItems.map((item, i) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 text-xs transition-all",
                    isActive 
                      ? "bg-[#CCFF00] text-black btn-brutal" 
                      : "text-zinc-500 hover:text-[#CCFF00] hover:bg-[#111]"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="heading-editorial tracking-[0.15em]">{item.name}</span>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        <div className="p-4 border-t-2 border-[#1A1A1A]">
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-xs text-zinc-600 transition-all hover:text-red-500 hover:bg-red-500/10"
          >
            <LogOut className="w-4 h-4" />
            <span className="heading-editorial tracking-[0.15em]">Sair</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-md border-t-2 border-[#1A1A1A] flex items-center justify-around px-1 py-1">
        {navItems.slice(0, 5).map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link key={item.name} href={item.href}
              className={cn("flex flex-col items-center gap-0.5 px-2 py-2", isActive ? "text-[#CCFF00]" : "text-zinc-600")}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[8px] tracking-wider uppercase">{item.name.split(' ')[0]}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
