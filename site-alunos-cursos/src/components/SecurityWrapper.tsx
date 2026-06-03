'use client';

import { useEffect } from 'react';

export function SecurityWrapper({ email }: { email: string }) {
  useEffect(() => {
    // Disable right click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Disable devtools shortcuts and copy
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === 'F12') {
        e.preventDefault();
      }
      // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C
      if (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) {
        e.preventDefault();
      }
      // Ctrl+U (View Source)
      if (e.ctrlKey && e.key.toUpperCase() === 'U') {
        e.preventDefault();
      }
      // Ctrl+S (Save)
      if (e.ctrlKey && e.key.toUpperCase() === 'S') {
        e.preventDefault();
      }
      // Ctrl+C (Copy)
      if (e.ctrlKey && e.key.toUpperCase() === 'C') {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    // Make body unselectable
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.userSelect = 'auto';
      document.body.style.webkitUserSelect = 'auto';
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes float3d {
          0% { transform: translateY(0px) rotateX(10deg) rotateY(-10deg); }
          50% { transform: translateY(-10px) rotateX(-5deg) rotateY(10deg); }
          100% { transform: translateY(0px) rotateX(10deg) rotateY(-10deg); }
        }
        .watermark-3d {
          animation: float3d 6s infinite ease-in-out;
          transform-style: preserve-3d;
          perspective: 1000px;
        }
      `}</style>
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden opacity-20 flex items-center justify-center">
        <span 
          className="heading-display text-4xl text-white text-3d neon-glow whitespace-nowrap watermark-3d"
        >
          {email}
        </span>
      </div>
    </>
  );
}
