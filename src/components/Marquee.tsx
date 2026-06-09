import React from 'react';
import { motion } from 'framer-motion';

export const Marquee: React.FC = () => {
  const items = [
    'REDES', 'TCP/IP', 'LINGUAGEM', 'PYTHON', 'C++',
    'LÓGICA', 'ALGORITMOS', 'LINUX', 'WINDOWS SERVER',
    'DATABASES', 'SQL INJECTION', 'CLOUD', 'AWS', 'PENTEST',
    'ZERO-DAY', 'FIREWALL', 'ENDPOINTS', 'BYPASS', 'HANDSHAKE',
  ];

  // Alterna entre texto preenchido e contorno (ritmo editorial)
  const marqueeContent = items.map((item, i) => (
    <span key={i} className="mx-4 md:mx-7 inline-flex items-center gap-4 md:gap-7">
      <span
        className={`font-oswald uppercase italic text-2xl md:text-4xl font-extrabold tracking-tight whitespace-nowrap ${
          i % 2 === 0 ? 'text-neon' : 'text-outline'
        }`}
      >
        {item}
      </span>
      <span className="text-neon/30 text-lg md:text-xl font-bold">{'//'}</span>
    </span>
  ));

  return (
    <div className="w-full overflow-hidden glass border-y border-neon/40 py-4 md:py-6 relative">
      {/* Bordas com fade neon */}
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-40 bg-gradient-to-r from-dark to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-40 bg-gradient-to-l from-dark to-transparent z-10 pointer-events-none" />

      <div className="flex">
        <motion.div
          className="flex shrink-0 will-change-transform"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ repeat: Infinity, ease: 'linear', duration: 34 }}
        >
          {marqueeContent}
          {marqueeContent}
        </motion.div>
      </div>
    </div>
  );
};
