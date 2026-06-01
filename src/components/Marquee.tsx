import React from 'react';
import { motion } from 'framer-motion';

export const Marquee: React.FC = () => {
  const items = [
    'REDES', 'TCP/IP', 'LINGUAGEM', 'PYTHON', 'C++',
    'LÓGICA', 'ALGORITMOS', 'LINUX', 'WINDOWS SERVER',
    'DATABASES', 'SQL INJECTION', 'CLOUD', 'AWS', 'PENTEST',
    'ZERO-DAY', 'FIREWALL', 'ENDPOINTS', 'BYPASS', 'HANDSHAKE',
  ];

  const marqueeContent = items.map((item, i) => (
    <span key={i} className="mx-4 md:mx-8 inline-flex items-center gap-4 md:gap-8">
      <span className="text-neon font-oswald uppercase italic text-lg md:text-2xl font-bold tracking-widest whitespace-nowrap">
        {item}
      </span>
      <span className="text-grid text-xl font-bold">{'//'}</span>
    </span>
  ));

  return (
    <div className="w-full overflow-hidden bg-black/80 backdrop-blur-sm border-y border-neon/40 py-3 md:py-4 relative">
      {/* Neon gradient edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-dark to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-dark to-transparent z-10 pointer-events-none" />
      
      <div className="flex">
        <motion.div
          className="flex shrink-0"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ repeat: Infinity, ease: 'linear', duration: 30 }}
        >
          {marqueeContent}
          {marqueeContent}
        </motion.div>
      </div>
    </div>
  );
};
