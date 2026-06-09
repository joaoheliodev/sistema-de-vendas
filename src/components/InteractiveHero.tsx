import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldOff, ShieldCheck, Lock, LockOpen, Wifi, WifiOff, AlertTriangle, CheckCircle } from 'lucide-react';

const VULNERABLE_LOGS = [
  '> Port 22: OPEN — Default SSH credentials',
  '> Port 3306: OPEN — MySQL unauthenticated',
  '> Firewall: DISABLED',
  '> WAF: NOT_DETECTED',
  '> TLS: v1.0 (DEPRECATED)',
  '> CVE-2024-3094: VULNERABLE',
  '> SQLi Vector: /api/user?id=1\' OR 1=1--',
  '> Admin Panel: /admin (NO_AUTH)',
];

const SECURE_LOGS = [
  '> All ports filtered — Cloudflare Proxy',
  '> WAF: ACTIVE — OWASP Ruleset Enabled',
  '> TLS: v1.3 — ECDHE-AES256-GCM-SHA384',
  '> HSTS: max-age=31536000; preload',
  '> CSP: strict-dynamic; nonce-based',
  '> Rate Limit: 100 req/min per IP',
  '> SQLi: Parameterized Queries Only',
  '> Admin: MFA + IP Whitelist',
];

export const InteractiveHero: React.FC = () => {
  const [isSecure, setIsSecure] = useState(false);

  return (
    <section className="max-w-7xl mx-auto px-5 md:px-8 py-20 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Cabeçalho da seção */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <span className="font-mono text-neon/40 text-sm">[01]</span>
            <div className="w-12 h-px bg-neon" />
            <span className="section-kicker">INTERACTIVE_DEMO</span>
          </div>
          <h2 className="editorial-heading mb-4">
            ANTES <span className="text-gray-500">&</span> DEPOIS<span className="text-neon">_</span>
          </h2>
          <p className="text-gray-500 font-mono text-sm md:text-base max-w-xl leading-relaxed">
            Passe o mouse sobre o painel para ver a diferença entre um sistema vulnerável e um sistema protegido pelo conhecimento do guia.
          </p>
        </div>

        {/* Container interativo */}
        <div
          className="relative border border-grid bg-black/90 overflow-hidden cursor-crosshair group"
          onMouseEnter={() => setIsSecure(true)}
          onMouseLeave={() => setIsSecure(false)}
          onTouchStart={() => setIsSecure(true)}
          onTouchEnd={() => setIsSecure(false)}
        >
          {/* Scanner line — fires on state change */}
          <motion.div
            key={isSecure ? 'scan-in' : 'scan-out'}
            className={`absolute left-0 right-0 h-[2px] z-30 ${isSecure ? 'bg-neon' : 'bg-red-500'}`}
            style={{ boxShadow: isSecure ? '0 0 20px #CCFF00, 0 0 60px #CCFF0044' : '0 0 20px #ff0040, 0 0 60px #ff004044' }}
            initial={{ top: '-2px' }}
            animate={{ top: '100%' }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          />

          {/* Content grid */}
          <div className="grid md:grid-cols-2 min-h-[400px] md:min-h-[350px] relative">

            {/* LEFT PANEL: Status display */}
            <div className="p-6 md:p-10 border-b md:border-b-0 md:border-r border-grid/40 flex flex-col justify-center items-center text-center relative overflow-hidden">
              {/* Background pulse */}
              <motion.div
                className="absolute inset-0"
                animate={{
                  backgroundColor: isSecure ? 'rgba(204,255,0,0.03)' : 'rgba(255,0,64,0.03)',
                }}
                transition={{ duration: 0.4 }}
              />

              <div className="relative z-10">
                {/* Icon transition */}
                <motion.div
                  key={isSecure ? 'secure' : 'vuln'}
                  initial={{ scale: 0.5, opacity: 0, rotateY: 90 }}
                  animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                  exit={{ scale: 0.5, opacity: 0, rotateY: -90 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="mb-6"
                >
                  {isSecure ? (
                    <ShieldCheck size={80} className="text-neon mx-auto" strokeWidth={1} />
                  ) : (
                    <ShieldOff size={80} className="text-red-500/70 mx-auto" strokeWidth={1} />
                  )}
                </motion.div>

                {/* Status text */}
                <motion.div
                  key={isSecure ? 'status-s' : 'status-v'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <h3 className={`font-oswald text-3xl md:text-4xl uppercase italic font-black mb-2 ${isSecure ? 'text-neon neon-text-glow' : 'text-red-500'}`}>
                    {isSecure ? 'FIREWALL_ACTIVE' : 'SYSTEM_VULNERABLE'}
                  </h3>
                  <p className={`font-mono text-xs tracking-widest ${isSecure ? 'text-neon/60' : 'text-red-500/50'}`}>
                    {isSecure ? '[ ALL DEFENSES OPERATIONAL ]' : '[ CRITICAL EXPOSURE DETECTED ]'}
                  </p>
                </motion.div>

                {/* Status indicators */}
                <div className="flex items-center justify-center gap-6 mt-6 font-mono text-xs">
                  <div className={`flex items-center gap-1.5 ${isSecure ? 'text-neon' : 'text-red-500/60'}`}>
                    {isSecure ? <Lock size={12} /> : <LockOpen size={12} />}
                    <span>{isSecure ? 'ENCRYPTED' : 'PLAIN_TEXT'}</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${isSecure ? 'text-neon' : 'text-red-500/60'}`}>
                    {isSecure ? <Wifi size={12} /> : <WifiOff size={12} />}
                    <span>{isSecure ? 'MONITORED' : 'EXPOSED'}</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${isSecure ? 'text-neon' : 'text-red-500/60'}`}>
                    {isSecure ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
                    <span>{isSecure ? 'PATCHED' : '6 CVEs'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT PANEL: Terminal logs */}
            <div className="p-6 md:p-10 flex flex-col justify-center relative overflow-hidden">
              <motion.div
                className="absolute inset-0"
                animate={{
                  backgroundColor: isSecure ? 'rgba(204,255,0,0.02)' : 'rgba(255,0,64,0.02)',
                }}
                transition={{ duration: 0.4 }}
              />

              <div className="relative z-10">
                {/* Terminal header */}
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-grid/30">
                  <div className="flex gap-1.5">
                    <div className={`w-2 h-2 ${isSecure ? 'bg-green-500' : 'bg-red-500'}`} />
                    <div className="w-2 h-2 bg-yellow-500/60" />
                    <div className="w-2 h-2 bg-gray-600" />
                  </div>
                  <span className="font-mono text-[10px] text-gray-600 ml-2">
                    {isSecure ? 'security-audit@cyberseg:~/protected' : 'attacker@kali:~/recon'}
                  </span>
                </div>

                {/* Log lines */}
                <div className="font-mono text-[11px] md:text-xs space-y-1.5 min-h-[200px]">
                  {(isSecure ? SECURE_LOGS : VULNERABLE_LOGS).map((log, i) => (
                    <motion.div
                      key={`${isSecure ? 's' : 'v'}-${i}`}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: i * 0.05 }}
                      className={isSecure ? 'text-neon/70' : 'text-red-400/70'}
                    >
                      {log}
                    </motion.div>
                  ))}
                </div>

                {/* Threat counter */}
                <div className={`mt-4 pt-3 border-t border-grid/20 flex justify-between font-mono text-[10px] ${isSecure ? 'text-neon/50' : 'text-red-500/50'}`}>
                  <span>THREATS: {isSecure ? '0 DETECTED' : '14 CRITICAL'}</span>
                  <span>SCORE: {isSecure ? '98/100' : '12/100'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom status bar */}
          <div className={`border-t border-grid/30 px-4 py-2 flex justify-between items-center font-mono text-[9px] tracking-widest transition-colors duration-300 ${isSecure ? 'text-neon/40 bg-neon/[0.02]' : 'text-red-500/40 bg-red-500/[0.02]'}`}>
            <span>{isSecure ? 'STATUS: ALL_CLEAR' : 'STATUS: BREACH_IMMINENT'}</span>
            <span>{isSecure ? 'CYBERSEG PROTECTION: ON' : 'PROTECTION: NONE'}</span>
            <span className="hidden md:inline">{isSecure ? 'HOVER TO INSPECT' : 'HOVER TO DEPLOY DEFENSE'}</span>
          </div>
        </div>

        {/* Caption */}
        <p className="font-mono text-[11px] text-gray-600 mt-4 text-center md:text-left">
          <span className="text-neon/60">▲</span> Demonstração interativa — Passe o mouse sobre o painel acima para alternar entre os estados.
        </p>
      </motion.div>
    </section>
  );
};
