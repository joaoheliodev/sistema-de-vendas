import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?/~`!░▒▓█';
const TARGET_TEXT = 'ACCESS_GRANTED: CYBERSEG_';

const TERMINAL_LINES = [
  { prefix: '[INIT]', text: 'Establishing Secure TCP Handshake...', delay: 0 },
  { prefix: '[SYNC]', text: 'SYN → SYN-ACK → ACK // Connection Established', delay: 200 },
  { prefix: '[ OK ]', text: 'TLS 1.3 Ciphers Verified: ECDHE-AES256-GCM', delay: 400 },
  { prefix: '[SCAN]', text: 'Port Enumeration: 22/tcp, 80/tcp, 443/tcp', delay: 600 },
  { prefix: '[AUTH]', text: 'RSA-4096 Key Exchange Validated', delay: 800 },
  { prefix: '[LOAD]', text: 'Injecting Payload into Memory Stack...', delay: 1000 },
  { prefix: '[DECR]', text: 'Decrypting Modules... AES-256-CBC', delay: 1200 },
  { prefix: '[BYPS]', text: 'Firewall Bypass: Rule Override Applied', delay: 1400 },
  { prefix: '[ OK ]', text: 'Root Shell Acquired — UID=0(root)', delay: 1600 },
  { prefix: '[DONE]', text: 'All Systems Operational. Launching Interface...', delay: 1800 },
];

export const IntroLoader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'scramble' | 'terminal' | 'exit'>('scramble');
  const [scrambledText, setScrambledText] = useState('');
  const [visibleLines, setVisibleLines] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  // Phase 1: Brute-force text scramble
  useEffect(() => {
    if (phase !== 'scramble') return;

    let iteration = 0;
    const maxIterations = TARGET_TEXT.length * 3;

    const interval = setInterval(() => {
      const resolved = Math.floor(iteration / 3);
      let result = '';

      for (let i = 0; i < TARGET_TEXT.length; i++) {
        if (i < resolved) {
          result += TARGET_TEXT[i];
        } else if (TARGET_TEXT[i] === ' ') {
          result += ' ';
        } else {
          result += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }

      setScrambledText(result);
      iteration++;

      if (iteration >= maxIterations) {
        setScrambledText(TARGET_TEXT);
        clearInterval(interval);
        setTimeout(() => setPhase('terminal'), 400);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [phase]);

  // Phase 2: Terminal lines
  useEffect(() => {
    if (phase !== 'terminal') return;

    const interval = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev >= TERMINAL_LINES.length) {
          clearInterval(interval);
          setTimeout(() => setPhase('exit'), 500);
          return prev;
        }
        return prev + 1;
      });
    }, 180);

    return () => clearInterval(interval);
  }, [phase]);

  // Phase 3: Exit
  useEffect(() => {
    if (phase !== 'exit') return;
    setIsExiting(true);
    const timer = setTimeout(onComplete, 800);
    return () => clearTimeout(timer);
  }, [phase, onComplete]);

  // Allow skip on click/tap
  const handleSkip = useCallback(() => {
    setIsExiting(true);
    setTimeout(onComplete, 400);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isExiting ? (
        <motion.div
          className="fixed inset-0 z-[9999] bg-dark flex flex-col items-center justify-center cursor-pointer overflow-hidden"
          onClick={handleSkip}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Scanline effect */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="w-full h-full" style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(204,255,0,0.03) 2px, rgba(204,255,0,0.03) 4px)',
            }} />
          </div>

          {/* Binary rain background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.07]">
            {Array.from({ length: 20 }).map((_, col) => (
              <motion.div
                key={col}
                className="absolute top-0 font-mono text-neon text-[10px] leading-tight whitespace-pre select-none"
                style={{ left: `${col * 5}%` }}
                initial={{ y: '-100%' }}
                animate={{ y: '100vh' }}
                transition={{
                  duration: 4 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: 'linear',
                }}
              >
                {Array.from({ length: 60 }).map(() =>
                  Math.random() > 0.5 ? '1' : '0'
                ).join('\n')}
              </motion.div>
            ))}
          </div>

          {/* Main content */}
          <div className="relative z-10 w-full max-w-2xl px-6">
            {/* Scramble text */}
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="font-mono text-neon text-2xl md:text-4xl font-bold tracking-wider neon-text-glow">
                {scrambledText}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                >
                  _
                </motion.span>
              </div>
            </motion.div>

            {/* Terminal lines */}
            {phase !== 'scramble' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-mono text-xs md:text-sm space-y-1.5 border border-grid/40 bg-black/60 p-4 max-h-64 overflow-hidden"
              >
                {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.15 }}
                    className="flex gap-2"
                  >
                    <span className={
                      line.prefix.includes('OK') || line.prefix.includes('DONE')
                        ? 'text-neon'
                        : line.prefix.includes('BYPS')
                          ? 'text-red-400'
                          : 'text-gray-500'
                    }>
                      {line.prefix}
                    </span>
                    <span className="text-gray-400">{line.text}</span>
                  </motion.div>
                ))}
                {visibleLines < TERMINAL_LINES.length && (
                  <motion.span
                    className="text-neon"
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.4 }}
                  >
                    █
                  </motion.span>
                )}
              </motion.div>
            )}

            {/* Progress bar */}
            <div className="mt-8 w-full h-px bg-grid/30 relative overflow-hidden">
              <motion.div
                className="h-full bg-neon"
                initial={{ width: '0%' }}
                animate={{
                  width: phase === 'scramble' ? '30%'
                    : phase === 'terminal' ? `${30 + (visibleLines / TERMINAL_LINES.length) * 70}%`
                    : '100%'
                }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Skip hint */}
            <motion.p
              className="text-center mt-6 font-mono text-[10px] text-gray-600 tracking-widest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              [ CLICK / TAP TO SKIP ]
            </motion.p>
          </div>

          {/* Corner decorations */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-neon/30" />
          <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-neon/30" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-neon/30" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-neon/30" />
        </motion.div>
      ) : (
        /* Exit animation — diagonal wipe */
        <motion.div className="fixed inset-0 z-[9999] pointer-events-none">
          <motion.div
            className="absolute inset-0 bg-dark"
            initial={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
            animate={{ clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          />
          <motion.div
            className="absolute inset-0 bg-neon/10"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
