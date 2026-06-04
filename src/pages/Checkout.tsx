import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Zap, CheckCircle, ArrowRight } from 'lucide-react';
import { Layout } from '../components/Layout';
import { FloatingElements } from '../components/FloatingElements';

const TERMINAL_LINES = [
  { type: 'cmd', text: '$ ./cyberseg-scanner --deep-scan --modules=all' },
  { type: 'info', text: '[INFO] Inicializando CyberSeg Deep Scanner v2.4...' },
  { type: 'info', text: '[INFO] Conectando ao repositório de módulos...' },
  { type: 'ok', text: '[OK] Conexão estabelecida. Iniciando enumeração.' },
  { type: 'break', text: '' },
  { type: 'header', text: '═══════════════════════════════════════════════════' },
  { type: 'header', text: '  MÓDULO 01: REDES — FUNDAMENTOS & RECONHECIMENTO' },
  { type: 'header', text: '═══════════════════════════════════════════════════' },
  { type: 'item', text: '  ├── Modelo OSI vs TCP/IP: cada camada dissecada' },
  { type: 'item', text: '  ├── Three-Way Handshake: SYN, SYN-ACK, ACK' },
  { type: 'item', text: '  ├── Port Scanning com Nmap: -sV, -sC, -O flags' },
  { type: 'item', text: '  ├── DNS Enumeration & Zone Transfer attacks' },
  { type: 'item', text: '  ├── ARP Spoofing e Man-in-the-Middle (MitM)' },
  { type: 'item', text: '  ├── Subnetting, CIDR e cálculo de máscaras' },
  { type: 'item', text: '  └── Topologias: Star, Mesh, Hybrid — prós e riscos' },
  { type: 'ok', text: '[LOADED] 7 tópicos indexados.' },
  { type: 'break', text: '' },
  { type: 'header', text: '═══════════════════════════════════════════════════' },
  { type: 'header', text: '  MÓDULO 02: LINGUAGEM — PYTHON, C & C++' },
  { type: 'header', text: '═══════════════════════════════════════════════════' },
  { type: 'item', text: '  ├── Python Sockets: criando port scanners do zero' },
  { type: 'item', text: '  ├── Scapy: packet crafting & network sniffing' },
  { type: 'item', text: '  ├── Automação de brute-force com wordlists' },
  { type: 'item', text: '  ├── Keyloggers & RATs: entendendo o inimigo' },
  { type: 'item', text: '  ├── C: Ponteiros, alocação dinâmica, stacks' },
  { type: 'item', text: '  ├── Buffer Overflow: exploração e prevenção' },
  { type: 'item', text: '  └── Compilação, linking e engenharia reversa basics' },
  { type: 'ok', text: '[LOADED] 7 tópicos indexados.' },
  { type: 'break', text: '' },
  { type: 'header', text: '═══════════════════════════════════════════════════' },
  { type: 'header', text: '  MÓDULO 03: LÓGICA DE PROGRAMAÇÃO' },
  { type: 'header', text: '═══════════════════════════════════════════════════' },
  { type: 'item', text: '  ├── Pensamento algorítmico: decomposição de problemas' },
  { type: 'item', text: '  ├── Complexidade: Big-O, tempo vs espaço' },
  { type: 'item', text: '  ├── Ordenação: Bubble, Merge, Quick Sort' },
  { type: 'item', text: '  ├── Estruturas: Arrays, Linked Lists, Stacks, Queues' },
  { type: 'item', text: '  ├── Hash Tables: colisões e resolução' },
  { type: 'item', text: '  ├── Árvores Binárias & Grafos (BFS, DFS)' },
  { type: 'item', text: '  └── Recursão e programação dinâmica' },
  { type: 'ok', text: '[LOADED] 7 tópicos indexados.' },
  { type: 'break', text: '' },
  { type: 'header', text: '═══════════════════════════════════════════════════' },
  { type: 'header', text: '  MÓDULO 04: SISTEMAS OPERACIONAIS' },
  { type: 'header', text: '═══════════════════════════════════════════════════' },
  { type: 'item', text: '  ├── Linux Terminal: navegação, pipes, redirecionamento' },
  { type: 'item', text: '  ├── Bash Scripting: loops, condicionais, cron jobs' },
  { type: 'item', text: '  ├── Permissões Unix: chmod, chown, SUID/SGID' },
  { type: 'item', text: '  ├── Escalação de Privilégios em Linux' },
  { type: 'item', text: '  ├── Windows Server: Active Directory fundamentals' },
  { type: 'item', text: '  ├── GPO (Group Policy Objects) e Kerberos' },
  { type: 'item', text: '  └── Gerenciamento de processos & serviços' },
  { type: 'ok', text: '[LOADED] 7 tópicos indexados.' },
  { type: 'break', text: '' },
  { type: 'header', text: '═══════════════════════════════════════════════════' },
  { type: 'header', text: '  MÓDULO 05: BANCO DE DADOS' },
  { type: 'header', text: '═══════════════════════════════════════════════════' },
  { type: 'item', text: '  ├── SQL fundamentals: SELECT, JOIN, subqueries' },
  { type: 'item', text: '  ├── SQL Injection: UNION-based, Blind, Time-based' },
  { type: 'item', text: '  ├── Prevenção: Prepared Statements, ORM, WAF' },
  { type: 'item', text: '  ├── NoSQL: MongoDB queries & injection vectors' },
  { type: 'item', text: '  ├── Redis: cache poisoning & exploitation' },
  { type: 'item', text: '  ├── Backup strategies & disaster recovery' },
  { type: 'item', text: '  └── Propriedades ACID & transações' },
  { type: 'ok', text: '[LOADED] 7 tópicos indexados.' },
  { type: 'break', text: '' },
  { type: 'header', text: '═══════════════════════════════════════════════════' },
  { type: 'header', text: '  MÓDULO 06: CLOUD COMPUTING & AWS' },
  { type: 'header', text: '═══════════════════════════════════════════════════' },
  { type: 'item', text: '  ├── Cloud models: IaaS, PaaS, SaaS' },
  { type: 'item', text: '  ├── AWS EC2: instâncias, AMIs, security groups' },
  { type: 'item', text: '  ├── S3 Buckets: misconfigurations & data leaks' },
  { type: 'item', text: '  ├── IAM: policies, roles, privilege escalation' },
  { type: 'item', text: '  ├── VPC: subnets, NACLs, peering' },
  { type: 'item', text: '  ├── Lambda & serverless attack surfaces' },
  { type: 'item', text: '  └── CloudTrail, GuardDuty & compliance basics' },
  { type: 'ok', text: '[LOADED] 7 tópicos indexados.' },
  { type: 'break', text: '' },
  { type: 'success', text: '══════════════════════════════════════════════════════' },
  { type: 'success', text: '  [SCAN COMPLETE] 6 módulos // 42 tópicos carregados' },
  { type: 'success', text: '  [STATUS] READY_FOR_DEPLOYMENT' },
  { type: 'success', text: '══════════════════════════════════════════════════════' },
];

const getLineColor = (type: string) => {
  switch (type) {
    case 'cmd': return 'text-white';
    case 'info': return 'text-gray-500';
    case 'ok': return 'text-neon';
    case 'header': return 'text-neon/70';
    case 'item': return 'text-gray-400';
    case 'success': return 'text-neon font-bold';
    default: return 'text-gray-600';
  }
};

const FEATURES = [
  'Download instantâneo após pagamento',
  'Acesso vitalício + atualizações futuras',
  'Conteúdo 100% em português',
  'Do zero ao intermediário em semanas',
  'Exercícios práticos em cada módulo',
  'Suporte por comunidade exclusiva',
];

export const Checkout: React.FC = () => {
  const [visibleLines, setVisibleLines] = useState(0);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev >= TERMINAL_LINES.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 60);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [visibleLines]);

  return (
    <Layout>
      <FloatingElements />

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-20">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="w-10 h-px bg-neon" />
            <span className="font-mono text-neon text-xs tracking-[0.3em]">DEEP_SCAN</span>
          </div>
          <h1 className="font-oswald text-4xl md:text-6xl uppercase italic font-black tracking-tight">
            EMENTA COMPLETA<span className="text-neon">_</span>
          </h1>
          <p className="text-gray-500 font-mono text-sm mt-3">
            Cada linha abaixo é um tópico real do guia. Sem enrolação. Sem conteúdo de preenchimento.
          </p>
        </motion.div>

        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16 border border-grid/60 bg-black relative"
        >
          {/* Terminal chrome */}
          <div className="flex items-center justify-between border-b border-grid/40 px-4 py-2.5 bg-dark-surface/50">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-red-500/80" />
              <div className="w-2.5 h-2.5 bg-yellow-500/80" />
              <div className="w-2.5 h-2.5 bg-green-500/80" />
              <span className="ml-3 text-gray-600 text-[10px] font-mono">root@cyberseg:~/scanner</span>
            </div>
            <span className="font-mono text-[10px] text-gray-600">
              {visibleLines}/{TERMINAL_LINES.length} lines
            </span>
          </div>

          {/* Terminal body */}
          <div
            ref={terminalRef}
            className="p-4 md:p-6 font-mono text-xs md:text-sm max-h-[500px] overflow-y-auto"
          >
            {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
              <div key={i} className={`${getLineColor(line.type)} ${line.type === 'break' ? 'h-3' : 'leading-relaxed'}`}>
                {line.text}
              </div>
            ))}
            {visibleLines < TERMINAL_LINES.length && (
              <motion.span 
                className="text-neon"
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.6 }}
              >
                █
              </motion.span>
            )}
          </div>
        </motion.section>

        <div className="grid md:grid-cols-5 gap-6 md:gap-8">
          {/* Left Column: Guarantee + Features */}
          <div className="md:col-span-2 space-y-6">
            {/* Guarantee */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="border border-grid/60 p-6 md:p-8 bg-dark-surface/50 relative"
            >
              <div className="absolute top-0 right-0 bg-neon text-dark text-[9px] px-2 py-1 font-mono font-bold tracking-wider">
                RISK_ZERO
              </div>
              <ShieldCheck size={48} className="text-neon mb-5" strokeWidth={1.5} />
              <h3 className="font-oswald text-2xl uppercase italic font-bold mb-3">
                GARANTIA<br />INCONDICIONAL<br />
                <span className="text-neon">DE 7 DIAS</span>
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Acesse todos os módulos. Execute os scripts. Estude as arquiteturas. 
                Se em 7 dias você não sentir que evoluiu — o reembolso é <span className="text-white font-semibold">imediato e automático</span>. 
                Sem perguntas. Sem burocracia.
              </p>
            </motion.section>

            {/* Features list */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="border border-grid/60 p-6 bg-dark-surface/50"
            >
              <h4 className="font-mono text-xs text-neon tracking-widest mb-4">O QUE ESTÁ INCLUSO:</h4>
              <ul className="space-y-3">
                {FEATURES.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                    <CheckCircle size={16} className="text-neon shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.section>
          </div>

          {/* Right Column: Checkout */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-3 border-2 border-neon/40 bg-dark-surface/80 backdrop-blur-sm p-6 md:p-10 relative flex flex-col justify-between hover:border-neon transition-colors duration-500 group"
          >
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-5 h-5 border-b border-r border-neon" />
            <div className="absolute top-0 right-0 w-5 h-5 border-b border-l border-neon" />
            <div className="absolute bottom-0 left-0 w-5 h-5 border-t border-r border-neon" />
            <div className="absolute bottom-0 right-0 w-5 h-5 border-t border-l border-neon" />

            <div>
              <div className="flex items-center gap-2 text-neon mb-6 font-mono text-xs border-b border-grid/40 pb-3 tracking-widest">
                <Lock size={14} />
                <span>CHECKOUT // ENCRYPTED // TLS 1.3</span>
              </div>

              <h3 className="font-oswald text-3xl md:text-4xl uppercase italic font-bold mb-2 tracking-tight">
                RESUMO DO PEDIDO
              </h3>
              <p className="text-gray-400 mb-8 text-sm">
                Guia Cibersegurança — Básico ao Intermediário
              </p>

              {/* Price box */}
              <div className="border border-grid/40 bg-black p-6 mb-8 relative">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="font-mono text-xs text-gray-600 block mb-1">VALOR_TOTAL:</span>
                    <span className="font-oswald text-5xl md:text-7xl text-neon font-black italic neon-text-glow">
                      R$ 67,50
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-[10px] text-gray-600 block">PAGAMENTO</span>
                    <span className="font-mono text-[10px] text-gray-600 block">ÚNICO</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-grid/20">
                  <span className="font-mono text-[10px] text-gray-600">
                    PIX // CARTÃO // BOLETO — PROCESSADO VIA GATEWAY SEGURO
                  </span>
                </div>
              </div>

              {/* Urgency notice */}
              <div className="flex items-center gap-3 mb-8 p-3 bg-neon/5 border border-neon/20">
                <Zap size={16} className="text-neon shrink-0" />
                <p className="font-mono text-[11px] text-gray-400">
                  <span className="text-neon font-bold">AVISO:</span> Este preço é promocional. 
                  Após o período de lançamento, o valor será reajustado sem aviso prévio.
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <a 
              href={import.meta.env.VITE_KIWIFY_CHECKOUT_URL || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="
                block w-full text-center border-2 border-neon bg-neon text-dark
                font-oswald uppercase italic px-8 py-5 text-xl md:text-2xl font-black
                transition-all duration-300
                hover:bg-transparent hover:text-neon hover:shadow-[0_0_40px_#CCFF0066,0_0_80px_#CCFF0033]
                active:translate-y-0.5
                cta-pulse relative overflow-hidden tracking-wide
              "
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                <ArrowRight size={24} strokeWidth={3} />
                CONCLUIR INSCRIÇÃO AGORA
              </span>
            </a>

            <p className="text-center font-mono text-[10px] text-gray-600 mt-4 tracking-wider">
              🔒 SEUS DADOS ESTÃO PROTEGIDOS COM CRIPTOGRAFIA AES-256
            </p>
          </motion.section>
        </div>
      </div>
    </Layout>
  );
};
