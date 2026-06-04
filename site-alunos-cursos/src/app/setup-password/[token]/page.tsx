"use client";

import { use } from "react";
import { SetupPasswordForm } from "../page";
import { Suspense } from "react";

export default function SetupPasswordTokenPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <div className="bg-[#111] p-8 border border-gray-800 w-full max-w-md shadow-2xl">
        <Suspense fallback={<div className="text-[#CCFF00] text-center">Carregando...</div>}>
          <SetupPasswordForm tokenProp={token} />
        </Suspense>
      </div>
    </div>
  );
}
