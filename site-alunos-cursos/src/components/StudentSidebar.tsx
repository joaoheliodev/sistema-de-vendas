'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, ClipboardCheck, Award, LogOut, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { signOut } from 'next-auth/react';
import { motion } from 'framer-motion';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Minhas Aulas', href: '/dashboard/aulas', icon: BookOpen },
  { name: 'Teste Final', href: '/dashboard/teste-final', icon: ClipboardCheck },
  { name: 'Certificado', href: '/dashboard/certificado/emitir', icon: Award },
];

export function StudentSidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 min-h-screen bg-[#0A0A0A] border-r-2 border-[#1A1A1A] flex-col">
        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b-2 border-[#1A1A1A] gap-3">
          <motion.div
            animate={{ rotateY: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            style={{ perspective: 200 }}
          >
            <Shield className="w-6 h-6 text-[#CCFF00]" />
          </motion.div>
          <h1 className="heading-display text-3xl text-white">
            CYBER<span className="text-[#CCFF00]">SEG</span>
          </h1>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-6 px-4 space-y-1">
          {navItems.map((item, i) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 text-sm transition-all",
                    isActive 
                      ? "bg-[#CCFF00] text-black btn-brutal" 
                      : "text-zinc-500 hover:text-[#CCFF00] hover:bg-[#111]"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="heading-editorial tracking-[0.15em] text-xs">{item.name}</span>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Version Badge */}
        <div className="px-6 py-2">
          <span className="text-[10px] tracking-[0.3em] text-zinc-800 uppercase" style={{ fontFamily: 'var(--font-space)' }}>v2.0 // Neon Brutalism</span>
        </div>

        {/* Logout */}
        <div className="p-4 border-t-2 border-[#1A1A1A]">
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-zinc-600 transition-all hover:text-red-500 hover:bg-red-500/10"
          >
            <LogOut className="w-4 h-4" />
            <span className="heading-editorial tracking-[0.15em] text-xs">Sair</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-md border-t-2 border-[#1A1A1A] flex items-center justify-around px-2 py-1 safe-area-bottom">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 min-w-0",
                isActive ? "text-[#CCFF00]" : "text-zinc-600"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[9px] tracking-wider uppercase truncate">{item.name}</span>
            </Link>
          );
        })}
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex flex-col items-center gap-1 px-3 py-2 text-zinc-600"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-[9px] tracking-wider uppercase">Sair</span>
        </button>
      </nav>
    </>
  );
}
