<h1 align="center">⚡ CyberSeg — Landing & Funil de Vendas</h1>

<p align="center">
  <strong>Landing page de alta conversão, com estética neon/cyberpunk, para o curso "Guia Completo de Cibersegurança":</strong> hero interativo, terminal animado de currículo e checkout direto na Kiwify.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" alt="Vite 8" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/Framer_Motion-12-0055FF?logo=framer&logoColor=white" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/React_Router-7-CA4245?logo=reactrouter&logoColor=white" alt="React Router 7" />
  <img src="https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white" alt="Vercel" />
</p>

---

## 📋 Sobre

Este é o **topo do funil** do ecossistema **CyberSeg**. É uma SPA (Single Page Application) construída em **Vite + React** cuja função é apresentar o curso **"Guia Completo de Cibersegurança"** e converter o visitante em comprador, enviando-o ao **checkout da Kiwify**.

Depois do pagamento, o cliente é provisionado automaticamente na **Plataforma do Aluno** (o repositório irmão `site-alunos-cursos`, em Next.js), que recebe um webhook da Kiwify, libera o acesso ao curso e envia o e-mail de definição de senha. Ou seja:

```
Visitante ──▶ Landing (este repo) ──▶ Checkout Kiwify ──▶ pagamento aprovado
                                                              │ webhook
                                                              ▼
                                              Plataforma do Aluno (Next.js)
```

A landing tem como diferencial o **design e a experiência**: tema dark/neon, animações de "glitch", elementos flutuantes, hero 3D interativo e um terminal animado que "escaneia" e revela o currículo módulo a módulo.

## 🧱 Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| **Core** | React 19 + TypeScript |
| **Build / Dev** | Vite (HMR ultrarrápido), build via `tsc -b && vite build` |
| **Roteamento** | React Router DOM 7 (`/` e `/checkout`) |
| **Estilo** | Tailwind CSS 4 (plugin `@tailwindcss/vite`) |
| **Animações** | Framer Motion (transições, tilt 3D, variantes, SVG) |
| **Ícones** | Lucide React |
| **Deploy** | Vercel (cabeçalhos de segurança via `vercel.json`) |

## 🏗️ Arquitetura

Aplicação **client-side** simples e enxuta — sem backend próprio. O fluxo:

- `src/main.tsx` monta o app; `src/App.tsx` controla um **intro loader** (mostrado uma vez por sessão via `sessionStorage`) e define as rotas com React Router.
- Duas páginas: **`Home`** (`/`) com hero, pilares do curso, marquee e CTAs; e **`Checkout`** (`/checkout`) com prova social e terminal animado do currículo.
- Componentes de UI reutilizáveis em `src/components/` (`InteractiveHero`, `GlitchText`, `FloatingElements`, `Marquee`, `PillarCard`, `IntroLoader`, `Button`, `Layout`).
- A **URL do checkout** é injetada em build via `import.meta.env.VITE_KIWIFY_CHECKOUT_URL` e usada em todos os botões de compra — nenhuma URL de pagamento fica hardcoded no repositório.

```
src/
├── main.tsx              # entry point
├── App.tsx               # intro loader + rotas (/ e /checkout)
├── pages/
│   ├── Home.tsx          # landing principal (hero, pilares, CTAs)
│   └── Checkout.tsx      # página de conversão + terminal animado
├── components/           # Button, Layout, GlitchText, InteractiveHero, ...
├── index.css / App.css   # estilos globais (tema neon)
└── assets/
```

## ⚡ Destaques de engenharia

- **Estética "Neon Brutalism" coesa** — tema dark/neon alinhado com a Plataforma do Aluno e com os e-mails transacionais, reforçando a identidade da marca de ponta a ponta.
- **Hero 3D interativo e micro-interações** — `InteractiveHero` com efeito de tilt, `GlitchText`, `FloatingElements` e `Marquee`, tudo orquestrado com Framer Motion.
- **Terminal animado de currículo** — na página de checkout, o conteúdo do curso é revelado como a saída de um "scanner" de terminal, vendendo o produto de forma temática.
- **Intro loader por sessão** — exibido apenas no primeiro carregamento da sessão (via `sessionStorage`), evitando atrito em navegações seguintes.
- **Checkout desacoplado por env** — o destino de pagamento vem de `VITE_KIWIFY_CHECKOUT_URL`, permitindo trocar/AB-testar o checkout sem alterar código.
- **Hardening de borda na Vercel** — `vercel.json` injeta HSTS, CSP rígida (`object-src 'none'`, `frame-ancestors 'none'`, `upgrade-insecure-requests`, `frame-src`/`form-action` restritos aos gateways de pagamento autorizados), `X-Frame-Options: DENY`, COOP/CORP, `X-Content-Type-Options: nosniff` e cache imutável para `/assets`.

## ✨ Funcionalidades

- **Página inicial** (`/`) com hero animado, seção de pilares/módulos do curso (Redes, Linguagem, Lógica, Sistemas, Databases, Cloud) e CTAs de compra.
- **Página de checkout** (`/checkout`) com prova social, lista de benefícios e terminal animado do currículo.
- **Botões de compra** que apontam para o checkout da Kiwify configurado por variável de ambiente.
- **Cabeçalhos de segurança** aplicados na borda (Vercel).

## 🚀 Rodando localmente

O projeto requer **Node.js 18+**.

```bash
# 1. Instale as dependências
npm install

# 2. Crie o arquivo de ambiente e preencha a URL do checkout
cp .env.example .env.local

# 3. Suba o servidor de desenvolvimento (Vite)
npm run dev
```

## 🔧 Scripts úteis

| Script | O que faz |
|--------|-----------|
| `npm run dev` | Servidor de desenvolvimento (Vite + HMR) |
| `npm run build` | Type-check (`tsc -b`) + build de produção em `./dist` |
| `npm run preview` | Serve localmente o build de produção |
| `npm run lint` | Lint com ESLint |

## 🔐 Variáveis de ambiente

Definida em `.env.example` (apenas o **nome** — nunca comite valores reais):

| Variável | Uso |
|----------|-----|
| `VITE_KIWIFY_CHECKOUT_URL` | URL do checkout da Kiwify usada nos botões de compra |

> Por serem expostas ao cliente (prefixo `VITE_`), aqui só entram valores **públicos** (uma URL de checkout). Segredos e chaves de API ficam exclusivamente na Plataforma do Aluno.

---

<p align="center"><sub>Projeto de portfólio — ecossistema CyberSeg.</sub></p>
