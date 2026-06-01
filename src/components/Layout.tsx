import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'INÍCIO', path: '/' },
    { name: 'DETALHES & CHECKOUT', path: '/checkout' },
  ];

  return (
    <div className="min-h-screen flex flex-col font-inter relative">
      {/* 3D Cyber Grid Background */}
      <div className="cyber-grid-bg" />

      {/* Scanline overlay */}
      <div className="scanline-overlay" />

      {/* Header */}
      <header className="border-b border-grid/60 py-4 px-4 md:px-8 relative z-50 bg-dark/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link 
            to="/" 
            className="font-oswald text-xl md:text-2xl font-bold uppercase italic text-white tracking-wider flex items-center gap-2 hover:text-neon transition-colors"
          >
            <Terminal size={20} className="text-neon" />
            <span className="text-neon">&gt;_</span>
            CYBER<span className="text-gray-600">SEG</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link, index) => (
              <React.Fragment key={link.path}>
                <Link 
                  to={link.path}
                  className={`
                    font-oswald uppercase italic tracking-wider text-sm font-bold
                    transition-all duration-300 relative py-1
                    ${location.pathname === link.path
                      ? 'text-neon neon-text-glow'
                      : 'text-gray-500 hover:text-white'}
                  `}
                >
                  {link.name}
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 right-0 h-px bg-neon"
                    />
                  )}
                </Link>
                {index < navLinks.length - 1 && (
                  <span className="text-grid/40 font-mono text-xs">{'//'}</span>
                )}
              </React.Fragment>
            ))}
            <Link 
              to="/checkout"
              className="ml-4 border border-neon text-neon font-oswald uppercase italic text-xs tracking-wider px-4 py-2 hover:bg-neon hover:text-dark transition-all duration-300"
            >
              R$ 34,67 → ACESSAR
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden border border-white/40 p-2 hover:border-neon hover:text-neon transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={22} strokeWidth={2.5} /> : <Menu size={22} strokeWidth={2.5} />}
          </button>
        </div>
      </header>

      {/* Mobile Fullscreen Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-dark z-40 flex flex-col items-center justify-center"
          >
            {/* Grid lines decoration */}
            <div className="absolute inset-0 border-x border-grid/20" />
            <div className="absolute top-1/3 left-0 right-0 border-t border-grid/10" />
            <div className="absolute top-2/3 left-0 right-0 border-t border-grid/10" />
            
            <nav className="flex flex-col items-center gap-10 relative z-10">
              <motion.div 
                className="font-mono text-neon/40 text-xs mb-4 tracking-[0.3em]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {'// NAVIGATION_MENU //'}
              </motion.div>
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * (i + 1), ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link 
                    to={link.path} 
                    onClick={() => setIsMenuOpen(false)}
                    className={`
                      font-oswald text-4xl uppercase italic font-bold tracking-wider
                      ${location.pathname === link.path ? 'text-neon neon-text-glow' : 'text-white'}
                    `}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8"
              >
                <Link
                  to="/checkout"
                  onClick={() => setIsMenuOpen(false)}
                  className="border-2 border-neon bg-neon text-dark font-oswald uppercase italic text-xl px-10 py-4 font-bold tracking-wider"
                >
                  ACESSAR POR R$ 34,67
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow relative z-10">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-grid/40 py-8 relative z-10 bg-dark/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono text-[10px] text-gray-600 tracking-wider">
            [SYS_LOG] CYBERSEG &copy; {new Date().getFullYear()} // ALL_RIGHTS_RESERVED // BUILD_V2.0
          </p>
          <div className="flex items-center gap-4 font-mono text-[10px] text-gray-600 tracking-wider">
            <span>ENCR: AES-256</span>
            <span className="text-grid/30">//</span>
            <span>STATUS: <span className="text-neon">ONLINE</span></span>
          </div>
        </div>
      </footer>
    </div>
  );
};
