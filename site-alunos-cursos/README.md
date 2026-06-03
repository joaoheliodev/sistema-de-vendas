<p align="center">
  <h1 align="center">🛡️ CyberSeg — Portal do Aluno</h1>
  <p align="center">
    Plataforma completa de ensino em Cibersegurança com dashboard do aluno, IA integrada, certificação digital e painel administrativo.
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" />
  <img src="https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss" />
  <img src="https://img.shields.io/badge/Gemini_AI-Integrated-4285F4?logo=google" />
</p>

---

## 📋 Sobre

O **CyberSeg Portal** é o sistema de gestão de alunos do curso **Guia Completo de Cibersegurança**. Ele integra:

- **Dashboard do Aluno** — Progresso, aulas em vídeo (YouTube/Vimeo/Bunny), anotações pessoais e sequência de estudo
- **IA Tutor** — Assistente com Gemini AI que responde dúvidas contextualizadas por aula
- **Teste Final** — Avaliação com questões embaralhadas, anti-cola e revisão de erros
- **Certificação Digital** — Geração de PDF com validação única após aprovação
- **Painel Admin** — CRUD de cursos, módulos, aulas, alunos, certificados e webhooks
- **Integração Kiwify** — Webhook automático para liberação de acesso após pagamento
- **Audit Log** — Registro completo de ações administrativas

## 🏗️ Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| **Frontend** | Next.js 16 (App Router + Turbopack), React 19, Framer Motion |
| **Styling** | Tailwind CSS 4, Shadcn UI, Design System "Neon Brutalism" |
| **Auth** | NextAuth.js v4 (JWT + Credentials) |
| **Database** | PostgreSQL via Prisma 7 (Driver Adapters + `sslmode=verify-full`) |
| **Storage** | Supabase Storage |
| **AI** | Google Gemini 2.5 Flash (Q&A contextual) |
| **Email** | Resend |
| **Payments** | Kiwify Webhooks (HMAC SHA1) |
| **PDF** | @react-pdf/renderer |
| **Deploy** | Vercel (TLS 1.2+ via HSTS) |

## 🔒 Segurança

- ✅ **TLS 1.2/1.3** — Enforced via HSTS header (`max-age=63072000; includeSubDomains; preload`)
- ✅ **Content Security Policy** — Restringe origens de scripts, styles, frames e conexões
- ✅ **HMAC SHA1** — Validação de assinatura nos webhooks da Kiwify
- ✅ **bcrypt** — Hash de senhas com salt rounds = 10
- ✅ **JWT** — Tokens de sessão assinados com NEXTAUTH_SECRET
- ✅ **SSL/TLS no banco** — `sslmode=verify-full` na conexão Prisma/PostgreSQL
- ✅ **Audit Logging** — Todas as ações admin são registradas
- ✅ **Rate limiting** — Headers de segurança (X-Frame-Options, X-XSS-Protection, etc.)
- ✅ **Watermark de segurança** — Overlay com e-mail do aluno no dashboard

## 🚀 Setup Local

### Pré-requisitos

- Node.js 18+
- PostgreSQL (ou Docker)

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/joaoheliodev/sistema-de-vendas.git
cd sistema-de-vendas/portal-aluno

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com seus valores reais

# 4. Rode as migrations
npx prisma migrate deploy

# 5. (Opcional) Popule o banco com dados de teste
npx tsx prisma/seed.ts

# 6. Inicie o servidor de desenvolvimento
npm run dev
```

O servidor estará disponível em [http://localhost:3000](http://localhost:3000).

## 📁 Estrutura do Projeto

```
portal-aluno/
├── prisma/
│   ├── schema.prisma       # Schema do banco de dados
│   ├── migrations/          # Migrações Prisma
│   └── seed.ts              # Dados de teste
├── src/
│   ├── app/
│   │   ├── admin/           # Painel administrativo
│   │   ├── dashboard/       # Dashboard do aluno
│   │   │   ├── aulas/       # Visualização de aulas + player
│   │   │   ├── teste-final/ # Avaliação final
│   │   │   └── certificado/ # Emissão de certificado
│   │   ├── api/
│   │   │   ├── auth/        # NextAuth endpoints
│   │   │   ├── student/     # APIs do aluno (progress, notes, QA, exam)
│   │   │   ├── webhooks/    # Kiwify webhook handler
│   │   │   └── certificate/ # Geração de PDF
│   │   ├── login/           # Página de login
│   │   └── setup-password/  # Primeiro acesso
│   ├── components/          # Componentes reutilizáveis
│   ├── lib/                 # Utilitários (prisma, mail, gemini, storage)
│   └── auth.ts              # Configuração NextAuth
├── .env.example             # Template de variáveis de ambiente
├── next.config.ts           # Config com security headers
└── package.json
```

## ⚙️ Variáveis de Ambiente

Veja `.env.example` para a lista completa. **Nunca commite o `.env` com valores reais.**

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | URL de conexão PostgreSQL (com SSL) |
| `NEXTAUTH_SECRET` | Chave secreta para JWT |
| `NEXTAUTH_URL` | URL base da aplicação |
| `GEMINI_API_KEY` | Chave da API Google Gemini |
| `RESEND_API_KEY` | Chave da API Resend (emails) |
| `KIWIFY_WEBHOOK_SECRET` | Secret para validação HMAC do webhook |
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Chave pública do Supabase |

## 📄 Licença

Projeto privado — Todos os direitos reservados © CyberSeg 2026.
