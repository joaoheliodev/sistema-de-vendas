
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Zap, Shield, AlertTriangle } from 'lucide-react';
import { Button } from '../components/Button';
import { Marquee } from '../components/Marquee';
import { PillarCard } from '../components/PillarCard';
import { GlitchText } from '../components/GlitchText';
import { FloatingElements } from '../components/FloatingElements';
import { Layout } from '../components/Layout';
import { InteractiveHero } from '../components/InteractiveHero';

const PILLARS = [
  {
    num: '01',
    title: 'REDES',
    desc: 'Entenda cada pacote que trafega na rede. Domine o handshake TCP, mapeie portas abertas e identifique topologias vulneráveis antes que alguém faça isso por você.',
    topics: ['TCP/IP Stack & OSI Model', 'Port Scanning & Nmap', 'DNS Poisoning & ARP Spoofing', 'Topologias & Subnetting'],
  },
  {
    num: '02',
    title: 'LINGUAGEM',
    desc: 'Python para automação de exploits e scripts de pentest. C/C++ para entender o que acontece no nível do hardware — onde as vulnerabilidades realmente nascem.',
    topics: ['Python: Sockets & Scapy', 'Automação de Payloads', 'C: Memory Management', 'Buffer Overflow Basics'],
  },
  {
    num: '03',
    title: 'LÓGICA',
    desc: 'Sem lógica, não existe exploit. Domine algoritmos de busca, ordenação, recursão e estruturas de dados que sustentam cada ferramenta de segurança.',
    topics: ['Algoritmos de Busca & Sort', 'Complexidade Big-O', 'Hash Tables & Trees', 'Grafos & Pathfinding'],
  },
  {
    num: '04',
    title: 'SISTEMAS',
    desc: 'O terminal é sua arma. Navegue pelo Linux como root, gerencie permissões com precisão cirúrgica e administre Windows Server sem deixar rastros.',
    topics: ['Bash Scripting Avançado', 'Permissões & chmod/chown', 'Active Directory & GPO', 'Processos, Daemons & Cron'],
  },
  {
    num: '05',
    title: 'DATABASES',
    desc: 'SQL Injection ainda é o vetor #1 de ataques. Entenda as entranhas do banco de dados para proteger — ou para saber exatamente como ele pode ser quebrado.',
    topics: ['SQL Queries & Joins', 'SQL Injection & Prevenção', 'NoSQL: MongoDB & Redis', 'Backup, Replicação & ACID'],
  },
  {
    num: '06',
    title: 'CLOUD',
    desc: 'A infraestrutura migrou para a nuvem — e os ataques também. Domine os conceitos de cloud, IAM, VPCs e os serviços críticos da AWS que toda empresa utiliza.',
    topics: ['AWS EC2, S3 & Lambda', 'IAM Policies & Roles', 'VPC, Security Groups', 'Cloud Security Posture'],
  },
];

const STATS = [
  { value: '6', label: 'MÓDULOS' },
  { value: '47+', label: 'TÓPICOS' },
  { value: '∞', label: 'ATUALIZAÇÕES' },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
} as const;

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <FloatingElements />

      {/* ============================================= */}
      {/* HERO SECTION */}
      {/* ============================================= */}
      <section className="relative w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 md:py-36 flex flex-col md:flex-row items-center gap-8 md:gap-16">
          {/* Left - Copy */}
          <motion.div 
            className="flex-1 text-center md:text-left z-10"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 border border-neon/30 bg-neon/5 px-4 py-1.5 mb-8 font-mono text-xs text-neon tracking-widest"
            >
              <span className="w-1.5 h-1.5 bg-neon animate-pulse" />
              THREAT_LEVEL: MÁXIMO — VAGAS LIMITADAS
            </motion.div>

            <h1 className="font-oswald text-[2.75rem] leading-[0.9] md:text-7xl lg:text-8xl xl:text-[6.5rem] uppercase italic font-black tracking-tighter mb-6">
              <GlitchText text="DOMINE O" className="block text-white" as="span" />
              <span className="block text-neon neon-text-glow my-1 md:my-2">SUBMUNDO</span>
              <span className="block text-white">DA SEGURANÇA</span>
              <span className="block text-white">DIGITAL<span className="text-neon">_</span></span>
            </h1>

            <p className="text-gray-400 text-base md:text-lg mb-8 max-w-xl mx-auto md:mx-0 leading-relaxed">
              O guia que transforma iniciantes em operadores. <span className="text-white font-semibold">6 pilares</span>, do 
              TCP/IP handshake até a infraestrutura AWS. Pare de assistir tutoriais — execute como um 
              <span className="text-neon font-semibold"> pentester</span>.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button 
                variant="primary" 
                pulse
                onClick={() => navigate('/checkout')}
                className="text-lg md:text-xl"
              >
                <Zap size={20} />
                BYPASS O SISTEMA — R$ 34,67
              </Button>
            </div>

            {/* Social proof line */}
            <motion.p 
              className="mt-6 font-mono text-[11px] text-gray-600 tracking-wider"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <span className="text-neon/60">▲</span> 237 OPERADORES JÁ ACESSARAM NAS ÚLTIMAS 48H
            </motion.p>
          </motion.div>

          {/* Right - Visual Code Block (Desktop Only) */}
          <motion.div 
            className="hidden lg:flex flex-1 justify-end select-none pointer-events-none"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <div className="border border-grid/60 bg-dark-surface/80 backdrop-blur-sm p-6 w-full max-w-md font-mono text-sm relative">
              {/* Window chrome */}
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-grid/40">
                <div className="w-2.5 h-2.5 bg-red-500/80" />
                <div className="w-2.5 h-2.5 bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 bg-green-500/80" />
                <span className="ml-3 text-gray-600 text-[10px]">root@cyberseg:~/exploit</span>
              </div>

              {/* Code content */}
              <motion.div
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="space-y-1 text-xs"
              >
                <p><span className="text-neon">$</span> <span className="text-gray-400">nmap -sV -sC target.local</span></p>
                <p className="text-gray-600">Starting Nmap 7.94 scan...</p>
                <p className="text-gray-600">PORT    STATE  SERVICE   VERSION</p>
                <p><span className="text-red-400">22</span>/tcp  open   ssh       OpenSSH 8.9</p>
                <p><span className="text-red-400">80</span>/tcp  open   http      Apache 2.4.54</p>
                <p><span className="text-red-400">443</span>/tcp open   ssl/http  nginx 1.23</p>
                <p><span className="text-yellow-400">3306</span>/tcp open   mysql     MySQL 8.0.32</p>
                <p className="text-gray-600 mt-2">Nmap done: 1 IP, 4 open ports</p>
                <p className="mt-3"><span className="text-neon">$</span> <span className="text-gray-400">python3 exploit.py --target 10.0.0.1</span></p>
                <p className="text-neon">[+] Payload delivered successfully</p>
                <p className="text-neon">[+] Reverse shell established</p>
                <p className="text-neon">[+] UID=0(root) access granted</p>
                <p className="mt-3 text-gray-600">{'>'} <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }}>_</motion.span></p>
              </motion.div>

              {/* Decorative corner */}
              <div className="absolute -bottom-px -right-px w-12 h-12 border-t border-l border-neon/30" />
              <div className="absolute -top-px -left-px w-12 h-12 border-b border-r border-neon/30" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================= */}
      {/* STATS BAR */}
      {/* ============================================= */}
      <motion.section 
        {...fadeUp}
        className="border-y border-grid/40 bg-dark-surface/50 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-3 divide-x divide-grid/30">
          {STATS.map((stat) => (
            <div key={stat.label} className="py-6 md:py-8 text-center">
              <div className="font-oswald text-3xl md:text-5xl font-bold text-neon italic">{stat.value}</div>
              <div className="font-mono text-[10px] md:text-xs text-gray-500 tracking-widest mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ============================================= */}
      {/* MARQUEE */}
      {/* ============================================= */}
      <Marquee />

      {/* ============================================= */}
      {/* INTERACTIVE HERO — BLACK HAT vs WHITE HAT */}
      {/* ============================================= */}
      <InteractiveHero />

      {/* ============================================= */}
      {/* PILLAR CARDS SECTION */}
      {/* ============================================= */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-20 md:py-32">
        <motion.div {...fadeUp} className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-px bg-neon" />
            <span className="font-mono text-neon text-xs tracking-[0.3em]">ARCHITECTURE</span>
          </div>
          <h2 className="font-oswald text-4xl md:text-6xl uppercase italic font-black tracking-tight">
            OS 6 PILARES<span className="text-neon">_</span>
          </h2>
          <p className="text-gray-500 font-mono text-sm mt-4 max-w-2xl">
            Cada módulo foi projetado como um vetor de ataque ao seu desconhecimento. 
            Sem enrolação. Sem teoria vazia. Apenas as habilidades que separam 
            <span className="text-white"> script kiddies</span> de <span className="text-neon">operadores reais</span>.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PILLARS.map((pillar, i) => (
            <PillarCard 
              key={pillar.num}
              moduleNumber={pillar.num}
              title={pillar.title}
              description={pillar.desc}
              topics={pillar.topics}
              delay={i * 0.08}
            />
          ))}
        </div>
      </section>

      {/* ============================================= */}
      {/* URGENCY STRIP */}
      {/* ============================================= */}
      <motion.section 
        {...fadeUp}
        className="bg-neon/5 border-y border-neon/20 py-6 px-4"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-center md:text-left">
          <AlertTriangle size={24} className="text-neon shrink-0" />
          <p className="font-oswald uppercase italic text-lg md:text-xl font-bold tracking-wide">
            <span className="text-neon">ZERO-DAY ALERT:</span> Este material não será gratuito para sempre. 
            O preço de <span className="text-neon">R$ 34,67</span> é temporário.
          </p>
        </div>
      </motion.section>

      {/* ============================================= */}
      {/* FINAL CTA - CONVERSION SECTION */}
      {/* ============================================= */}
      <section className="py-20 md:py-32 px-4 md:px-8">
        <motion.div
          {...fadeUp}
          className="max-w-4xl mx-auto border-2 border-neon/60 bg-dark-surface/80 backdrop-blur-sm p-8 md:p-16 relative text-center group hover:border-neon transition-all duration-500"
        >
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-6 h-6 border-b-2 border-r-2 border-neon" />
          <div className="absolute top-0 right-0 w-6 h-6 border-b-2 border-l-2 border-neon" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-t-2 border-r-2 border-neon" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-t-2 border-l-2 border-neon" />

          <div className="absolute inset-0 bg-neon/3 group-hover:bg-neon/5 transition-colors duration-500" />
          
          <div className="relative z-10">
            <Shield size={40} className="text-neon mx-auto mb-6" />
            <h2 className="font-oswald text-3xl md:text-5xl lg:text-6xl uppercase italic font-black mb-2 tracking-tight">
              ACESSO IMEDIATO
            </h2>
            <p className="font-mono text-gray-500 text-sm mb-8">
              DOWNLOAD INSTANTÂNEO // ATUALIZAÇÕES VITALÍCIAS // GARANTIA 7 DIAS
            </p>
            
            <div className="font-oswald text-6xl md:text-8xl text-neon font-black italic mb-2 neon-text-glow">
              R$ 34,67
            </div>
            <p className="font-mono text-xs text-gray-600 mb-10">PAGAMENTO ÚNICO // SEM ASSINATURA // SEM TAXA OCULTA</p>

            <Button 
              variant="primary" 
              pulse 
              onClick={() => navigate('/checkout')}
              className="text-xl md:text-2xl px-12 py-5"
            >
              <ChevronRight size={24} />
              EXECUTAR COMPRA AGORA
            </Button>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
};
