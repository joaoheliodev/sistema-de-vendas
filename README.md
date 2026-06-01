# CyberSeg — Plataforma de Conversão Segura

Uma landing page brutalista (Neon/Dark Mode) desenvolvida como portfólio de cibersegurança e sistema de vendas de alta conversão. O projeto combina design premium, efeitos 3D responsivos e uma infraestrutura robusta de hardening (HTTP Headers e TLS strict).

---

## 🛠️ Stack Tecnológica

- **Core:** React 18 + TypeScript
- **Build Tool:** Vite (Ultra-fast HMR)
- **Styling:** Tailwind CSS v4 (Utilitários modernos e variáveis CSS embutidas)
- **Animações:** Framer Motion (Transições complexas, Tilt 3D, variantes e SVG drawing)
- **Ícones:** Lucide React

---

## 🛡️ Arquitetura de Segurança & Hardening

A plataforma foi construída com foco na integridade de ponta a ponta. Como se trata de um produto no nicho de infosec, a barreira de defesa contra vazamentos e explorações foi elevada.

### 1. Criptografia de Transporte (TLS)
- **Protocolos Restritos:** Apenas `TLS 1.2` e `TLS 1.3` permitidos. `SSL 2.0`, `SSL 3.0`, `TLS 1.0` e `TLS 1.1` estão explicitamente bloqueados.
- **Cipher Suites:** Forçado o uso de Forward Secrecy com algoritmos robustos como `ECDHE-AES256-GCM-SHA384`.
- A documentação interna (`/security`) contém os guias Nginx e Cloudflare para gerar chaves DH de 4096-bits.

### 2. Cabeçalhos HTTP de Segurança (Edge Injection)
Injetados na borda através do arquivo `vercel.json`:
- **HSTS (Strict-Transport-Security):** Configurado com `max-age=31536000; includeSubDomains; preload` para blindar contra ataques de downgrade.
- **CSP (Content-Security-Policy):** Diretivas rígidas que negam embeds de objetos perigosos (`object-src 'none'`), forçam o upgrade HTTP para HTTPS e limitam iFrames exclusivamente para os gateways de pagamento autorizados.
- **X-Frame-Options (`DENY`):** Prevenção efetiva contra Clickjacking.
- **Outros:** `X-Content-Type-Options: nosniff`, `Permissions-Policy`, e proteção contra Cross-Origin.

### 3. Gerenciamento de Credenciais e Anti-Leak
- `.env` restrito pelo `.gitignore` para bloquear commit acidental de chaves de API, URLs diretas de checkout (como Hotmart/Kiwify) e variáveis do servidor local.
- Checkout dinâmico carregado por `import.meta.env`.

---

## 🚀 Como Iniciar (Ambiente Local)

O projeto requer **Node.js 18+**.

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/joaoheliodev/sistema-de-vendas.git
   cd sistema-de-vendas
   ```

2. **Configure o ambiente:**
   Copie o arquivo de exemplo para injetar as variáveis necessárias no client.
   ```bash
   cp .env.example .env.local
   # Adicione sua URL de checkout na variável VITE_KIWIFY_CHECKOUT_URL
   ```

3. **Instale as dependências:**
   ```bash
   npm install
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

5. **Build de Produção:**
   ```bash
   npm run build
   ```

O diretório `./dist` será gerado, otimizado, empacotado e preparado para ingestão em CDNs (Cloudflare Pages, Vercel, Nginx).
