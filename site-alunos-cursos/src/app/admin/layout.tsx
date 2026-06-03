import { ReactNode } from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#050505] text-zinc-50">
      <AdminSidebar />
      <main className="flex-1 flex flex-col min-h-screen md:h-screen md:overflow-hidden">
        <header className="h-16 border-b-2 border-[#1A1A1A] flex items-center justify-between px-4 md:px-8 bg-[#0A0A0A] shrink-0">
          <h2 className="heading-editorial text-xs tracking-[0.3em] text-zinc-500">ADMINISTRAÇÃO</h2>
          <span className="heading-editorial text-[10px] tracking-[0.2em] text-[#CCFF00] bg-[#CCFF00]/10 px-3 py-1 border border-[#CCFF00]/20">ADMIN</span>
        </header>
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
