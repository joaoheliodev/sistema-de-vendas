import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';

interface PillarCardProps {
  moduleNumber: string;
  title: string;
  description: string;
  topics: string[];
  delay?: number;
}

const GLITCH_CHARS = '!@#$%^&*()_+-=[]{}|;:<>?/~`░▒▓█▀▄';

export const PillarCard: React.FC<PillarCardProps> = ({ moduleNumber, title, description, topics, delay = 0 }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [glitchTitle, setGlitchTitle] = useState(title);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile/touch device
  useEffect(() => {
    const check = () => setIsMobile(window.matchMedia('(max-width: 768px)').matches || 'ontouchstart' in window);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // 3D Tilt — mouse tracking (desktop only)
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({
      x: (y - 0.5) * -15,
      y: (x - 0.5) * 15,
    });
  }, [isMobile]);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
    setGlitchTitle(title);
  }, [title]);

  // Glitch text scramble on hover
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);

    if (isMobile) return;

    let iteration = 0;
    const scrambleInterval = setInterval(() => {
      let result = '';
      for (let i = 0; i < title.length; i++) {
        if (i < iteration) {
          result += title[i];
        } else if (title[i] === ' ') {
          result += ' ';
        } else {
          result += GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        }
      }
      setGlitchTitle(result);
      iteration += 1;

      if (iteration > title.length) {
        setGlitchTitle(title);
        clearInterval(scrambleInterval);
      }
    }, 35);

    return () => clearInterval(scrambleInterval);
  }, [title, isMobile]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        ref={cardRef}
        className="tilt-card cursor-default"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: isMobile
            ? 'none'
            : `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
        }}
      >
        <div className={`
          border glass p-7 relative overflow-hidden
          transition-all duration-300
          ${isHovered ? 'border-neon neon-glow' : 'border-grid'}
        `}>
          {/* Número do módulo como marca d'água editorial */}
          <span
            className={`absolute -top-4 -right-2 font-oswald italic font-extrabold leading-none select-none pointer-events-none transition-all duration-300 ${
              isHovered ? 'text-neon/10' : 'text-white/[0.03]'
            }`}
            style={{ fontSize: '7rem' }}
          >
            {moduleNumber}
          </span>

          {/* Top loading bar */}
          <div className="absolute top-0 left-0 w-full h-0.5 bg-grid">
            <motion.div 
              className="h-full bg-neon"
              initial={{ width: '0%' }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: delay + 0.3 }}
            />
          </div>

          {/* Hover glow overlay */}
          <motion.div
            className="absolute inset-0 pointer-events-none bg-neon/[0.03]"
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Header */}
          <div className="flex justify-between items-center mb-4 border-b border-grid pb-3 relative z-10">
            <div className="flex items-center gap-2">
              <motion.span
                className="w-2 h-2 bg-neon inline-block"
                animate={isHovered ? { scale: [1, 1.5, 1] } : {}}
                transition={{ repeat: Infinity, duration: 1 }}
              />
              <span className="font-mono text-neon text-xs tracking-widest">
                MOD_{moduleNumber}
              </span>
            </div>
            <span className={`font-mono text-[10px] tracking-wider transition-colors duration-300 ${isHovered ? 'text-neon/60' : 'text-grid'}`}>
              {isHovered ? '[ACCESSING...]' : '[LOCKED]'}
            </span>
          </div>

          {/* Title — with glitch scramble */}
          <h3 className="font-oswald text-2xl md:text-3xl uppercase italic font-bold mb-3 text-white tilt-card-inner relative z-10 min-h-[2em]">
            {glitchTitle}
            <motion.span
              className="text-neon"
              animate={{ opacity: isHovered ? [1, 0, 1] : 1 }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            >
              _
            </motion.span>
          </h3>

          {/* Description */}
          <p className={`text-sm leading-relaxed mb-4 font-inter relative z-10 transition-colors duration-300 ${isHovered ? 'text-gray-300' : 'text-gray-400'}`}>
            {description}
          </p>

          {/* Topics List — Terminal style with neon glow on hover */}
          <div className="font-mono text-[11px] space-y-1 border-t border-grid pt-3 relative z-10">
            {topics.map((topic, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-2"
                animate={isHovered ? { x: [0, 2, 0] } : {}}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <span className={`transition-colors duration-300 ${isHovered ? 'text-neon' : 'text-neon/40'}`}>
                  &gt;
                </span>
                <span className={`transition-colors duration-300 ${isHovered ? 'text-neon/90' : 'text-gray-500'}`}>
                  {topic}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Bottom corner accent */}
          <div className={`absolute bottom-0 right-0 w-8 h-8 border-t border-l transition-colors duration-300 ${isHovered ? 'border-neon' : 'border-grid'}`} />
          <div className={`absolute top-0 left-0 w-5 h-5 border-b border-r transition-colors duration-300 ${isHovered ? 'border-neon/50' : 'border-transparent'}`} />
        </div>
      </div>
    </motion.div>
  );
};
