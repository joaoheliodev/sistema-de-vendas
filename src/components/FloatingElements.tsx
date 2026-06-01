import React from 'react';
import { motion } from 'framer-motion';

interface FloatingElement {
  id: number;
  type: 'square' | 'diamond' | 'line' | 'cross';
  size: number;
  left: string;
  duration: number;
  delay: number;
}

const elements: FloatingElement[] = [
  { id: 1, type: 'square', size: 12, left: '5%', duration: 25, delay: 0 },
  { id: 2, type: 'diamond', size: 8, left: '15%', duration: 30, delay: 5 },
  { id: 3, type: 'line', size: 40, left: '25%', duration: 22, delay: 2 },
  { id: 4, type: 'cross', size: 14, left: '40%', duration: 28, delay: 8 },
  { id: 5, type: 'square', size: 6, left: '55%', duration: 35, delay: 3 },
  { id: 6, type: 'diamond', size: 10, left: '70%', duration: 20, delay: 12 },
  { id: 7, type: 'line', size: 30, left: '85%', duration: 27, delay: 6 },
  { id: 8, type: 'cross', size: 8, left: '92%', duration: 32, delay: 10 },
];

const renderShape = (el: FloatingElement) => {
  const baseClass = 'border border-neon/30';
  
  switch (el.type) {
    case 'square':
      return (
        <div
          className={baseClass}
          style={{ width: el.size, height: el.size }}
        />
      );
    case 'diamond':
      return (
        <div
          className={baseClass}
          style={{
            width: el.size,
            height: el.size,
            transform: 'rotate(45deg)',
          }}
        />
      );
    case 'line':
      return (
        <div
          className="bg-neon/20"
          style={{ width: el.size, height: 1 }}
        />
      );
    case 'cross':
      return (
        <div className="relative" style={{ width: el.size, height: el.size }}>
          <div className="absolute top-1/2 left-0 w-full h-px bg-neon/30" />
          <div className="absolute top-0 left-1/2 w-px h-full bg-neon/30" />
        </div>
      );
  }
};

export const FloatingElements: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden hidden md:block">
      {elements.map((el) => (
        <motion.div
          key={el.id}
          className="absolute floating-element"
          style={{ left: el.left, bottom: '-5%' }}
          animate={{
            y: [0, -window.innerHeight * 1.2],
            rotate: [0, 360],
            opacity: [0, 0.15, 0.15, 0],
          }}
          transition={{
            duration: el.duration,
            delay: el.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {renderShape(el)}
        </motion.div>
      ))}
    </div>
  );
};
