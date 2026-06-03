import { ReactNode } from 'react';
import { StudentSidebar } from '@/components/StudentSidebar';
import { SecurityWrapper } from '@/components/SecurityWrapper';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  
  if (session?.user?.mustChangePassword) {
    redirect('/force-reset');
  }

  const email = session?.user?.email || 'aluno@cyberseg.com';

  return (
    <div className="flex min-h-screen bg-[#050505] text-zinc-50 relative">
      <SecurityWrapper email={email} />
      <StudentSidebar />
      <main className="flex-1 flex flex-col min-h-screen md:h-screen md:overflow-hidden">
        {/* Topbar */}
        <header className="h-16 border-b-2 border-[#1A1A1A] flex items-center px-4 md:px-8 bg-[#0A0A0A] shrink-0">
          <h2 className="heading-editorial text-xs tracking-[0.3em] text-zinc-500">PORTAL DO ALUNO</h2>
        </header>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
