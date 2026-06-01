# 🔒 CyberSeg — Guia de Security Hardening & Infraestrutura

> **Versão:** 2.0  
> **Data:** Junho 2026  
> **Classificação:** INTERNO — USO DO OPERADOR

---

## Sumário

1. [Visão Geral da Arquitetura de Segurança](#1-visão-geral-da-arquitetura-de-segurança)
2. [Criptografia de Transporte (TLS 1.2/1.3)](#2-criptografia-de-transporte-tls-1213)
3. [Cabeçalhos de Segurança HTTP](#3-cabeçalhos-de-segurança-http)
4. [WAF & Proxy Reversa (Cloudflare)](#4-waf--proxy-reversa-cloudflare)
5. [Deploy por Provedor](#5-deploy-por-provedor)
6. [Checklist de Validação](#6-checklist-de-validação)
7. [Referências Técnicas](#7-referências-técnicas)

---

## 1. Visão Geral da Arquitetura de Segurança

```
┌─────────────────────────────────────────────────────────────────────┐
│                        USUÁRIO (Browser)                           │
│                     Chrome / Firefox / Safari                      │
└───────────────────────────┬─────────────────────────────────────────┘
                            │
                            │ HTTPS (TLS 1.3 / TLS 1.2)
                            │ Cipher: ECDHE-ECDSA-AES128-GCM-SHA256
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    CLOUDFLARE EDGE (Camada 7)                      │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────────────┐  │
│  │ DDoS Shield │  │  WAF Engine  │  │  Bot Management           │  │
│  │ (L3/L4/L7)  │  │  OWASP Rules │  │  Rate Limiting            │  │
│  │  Anycast IP │  │  Custom Rules│  │  Threat Score Gating      │  │
│  └─────────────┘  └──────────────┘  └───────────────────────────┘  │
│                                                                     │
│  Security Headers injetados:                                        │
│  HSTS | CSP | X-Frame-Options | X-Content-Type | Referrer-Policy   │
└───────────────────────────┬─────────────────────────────────────────┘
                            │
                            │ HTTPS (Full Strict) + Authenticated Origin Pull
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    ORIGIN SERVER                                    │
│                                                                     │
│  Opção A: Vercel (Serverless)                                      │
│    └── vercel.json (headers de segurança)                           │
│                                                                     │
│  Opção B: Cloudflare Pages (Edge)                                  │
│    └── public/_headers (headers de segurança)                       │
│                                                                     │
│  Opção C: VPS + Nginx                                              │
│    └── security/nginx-security.conf                                 │
│                                                                     │
│  Todos servem: /dist (build estático do Vite)                      │
└─────────────────────────────────────────────────────────────────────┘
```

**Princípio:** O tráfego NUNCA chega diretamente ao servidor de origem. Cloudflare atua como proxy reversa, interceptando e filtrando todo o tráfego na camada TCP antes de encaminhá-lo.

---

## 2. Criptografia de Transporte (TLS 1.2/1.3)

### 2.1 Protocolos Permitidos

| Protocolo | Status    | Justificativa                                    |
|-----------|-----------|--------------------------------------------------|
| SSL 2.0   | ❌ BLOQUEADO | Vulnerável a DROWN                               |
| SSL 3.0   | ❌ BLOQUEADO | Vulnerável a POODLE                              |
| TLS 1.0   | ❌ BLOQUEADO | Vulnerável a BEAST, CRIME. PCI-DSS não-compliant |
| TLS 1.1   | ❌ BLOQUEADO | Ciphers fracos, sem AEAD. Obsoleto RFC 8996      |
| TLS 1.2   | ✅ ATIVO     | Suporte amplo, AEAD ciphers disponíveis          |
| TLS 1.3   | ✅ ATIVO     | Handshake otimizado (1-RTT), Forward Secrecy nativo |

### 2.2 Cipher Suites Autorizadas

Apenas ciphers com **Forward Secrecy** (ECDHE/DHE) e **AEAD** (GCM/ChaCha20-Poly1305):

```
# TLS 1.3 (seleção automática pelo protocolo)
TLS_AES_128_GCM_SHA256
TLS_AES_256_GCM_SHA384
TLS_CHACHA20_POLY1305_SHA256

# TLS 1.2 (ordem do servidor)
ECDHE-ECDSA-AES128-GCM-SHA256
ECDHE-RSA-AES128-GCM-SHA256
ECDHE-ECDSA-AES256-GCM-SHA384
ECDHE-RSA-AES256-GCM-SHA384
ECDHE-ECDSA-CHACHA20-POLY1305
ECDHE-RSA-CHACHA20-POLY1305
DHE-RSA-AES128-GCM-SHA256
DHE-RSA-AES256-GCM-SHA384
```

### 2.3 Curvas Elípticas

```
X25519          (preferido — mais rápido, resistente a side-channel)
secp384r1       (fallback — NIST P-384)
secp256r1       (fallback — NIST P-256)
```

### 2.4 Diffie-Hellman Parameters

Para TLS 1.2 DHE ciphers, gerar parâmetros DH de 4096 bits:

```bash
openssl dhparam -out /etc/nginx/dhparam.pem 4096
```

> ⚠️ **Nota:** Este comando pode levar vários minutos. Execute uma vez e reutilize.

### 2.5 OCSP Stapling

Ativado para eliminar latência na verificação de revogação de certificados. O servidor faz a consulta OCSP e "grampe" a resposta no handshake TLS, evitando que o browser precise consultar a CA separadamente.

---

## 3. Cabeçalhos de Segurança HTTP

Todos os cabeçalhos são injetados em **toda resposta HTTP** (código `always` no Nginx):

### 3.1 Tabela de Cabeçalhos

| Header                       | Valor                                                           | Protege Contra                   |
|------------------------------|-----------------------------------------------------------------|----------------------------------|
| `Strict-Transport-Security`  | `max-age=31536000; includeSubDomains; preload`                  | Downgrade attacks, SSL stripping |
| `Content-Security-Policy`    | Veja abaixo ↓                                                   | XSS, Code Injection, Data Theft  |
| `X-Content-Type-Options`     | `nosniff`                                                       | MIME sniffing attacks            |
| `X-Frame-Options`            | `DENY`                                                          | Clickjacking                     |
| `X-XSS-Protection`          | `1; mode=block`                                                 | Reflected XSS (browsers legados) |
| `Referrer-Policy`           | `strict-origin-when-cross-origin`                               | Information leakage              |
| `Permissions-Policy`         | `camera=(), microphone=(), geolocation=(), payment=(self)`      | Unauthorized API access          |
| `Cross-Origin-Opener-Policy` | `same-origin`                                                   | Spectre / cross-origin attacks   |
| `Cross-Origin-Resource-Policy`| `same-origin`                                                  | Cross-origin data leaks          |

### 3.2 Content-Security-Policy (CSP) — Detalhamento

```
default-src 'self';
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data: https:;
connect-src 'self';
frame-src https://pay.hotmart.com https://pay.kiwify.com.br;
object-src 'none';
base-uri 'self';
form-action 'self' https://pay.hotmart.com https://pay.kiwify.com.br;
frame-ancestors 'none';
upgrade-insecure-requests;
```

**Diretivas críticas:**
- `object-src 'none'` → Bloqueia Flash, Java Applets e outros plugins
- `frame-ancestors 'none'` → Impede embedding em iframes (complementa X-Frame-Options)
- `upgrade-insecure-requests` → Força upgrade automático de HTTP → HTTPS
- `frame-src` → Permite apenas iframes do gateway de pagamento

> 📝 **Ação Necessária:** Substitua `https://pay.hotmart.com` ou `https://pay.kiwify.com.br` pelo domínio real do seu gateway de pagamento.

---

## 4. WAF & Proxy Reversa (Cloudflare)

A configuração completa da Cloudflare está detalhada em:  
📄 **`security/cloudflare-waf-setup.conf`**

### 4.1 Resumo das Camadas de Proteção

| Camada         | Tecnologia         | O que faz                                                    |
|----------------|--------------------|--------------------------------------------------------------|
| L3/L4 (Rede)   | Cloudflare Anycast | Absorve DDoS volumétrico (SYN flood, UDP flood)             |
| L7 (Aplicação) | WAF Managed Rules  | Bloqueia SQLi, XSS, RCE, LFI/RFI baseado em assinaturas    |
| L7 (Custom)    | Custom WAF Rules   | Regras específicas para nosso domínio e rotas de checkout    |
| L7 (Rate)      | Rate Limiting      | Limita requisições por IP (100/min global, 15/min checkout)  |
| L7 (Bots)      | Bot Fight Mode     | Machine learning para detecção de bots automatizados         |

### 4.2 Regras Customizadas Implementadas

1. **GeoBlock — Non-BR Challenge:** Desafia (CAPTCHA) acessos de fora do Brasil
2. **Block Malicious Scanners:** Bloqueia tools como sqlmap, nikto, nmap, masscan
3. **Checkout Threat Score Gate:** CAPTCHA para acessos com threat score > 14 no `/checkout`
4. **Global Rate Limit:** Máx 100 req/min por IP (block por 10 min ao exceder)
5. **Checkout Rate Limit:** Máx 15 req/min por IP no checkout (block por 1 hora)

---

## 5. Deploy por Provedor

### 5.1 Vercel (Recomendado para simplicidade)

```bash
# 1. Build
npm run build

# 2. Deploy
npx vercel --prod

# Headers de segurança já configurados em vercel.json na raiz do projeto
```

O arquivo `vercel.json` injeta automaticamente todos os cabeçalhos de segurança listados na Seção 3.

### 5.2 Cloudflare Pages

```bash
# 1. Build
npm run build

# 2. Deploy via CLI
npx wrangler pages deploy dist

# Headers de segurança controlados pelo arquivo public/_headers
# (copiado para dist/_headers durante o build)
```

### 5.3 VPS com Nginx

```bash
# 1. Build local
npm run build

# 2. Copiar para servidor
scp -r dist/* user@server:/var/www/cyberseg/

# 3. Configurar Nginx
sudo cp security/nginx-security.conf /etc/nginx/conf.d/
sudo nginx -t
sudo systemctl reload nginx
```

Estrutura Nginx mínima no `server{}` block:

```nginx
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name cyberseg.com.br www.cyberseg.com.br;

    ssl_certificate     /etc/letsencrypt/live/cyberseg.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/cyberseg.com.br/privkey.pem;

    root /var/www/cyberseg;
    index index.html;

    # Incluir configuração de segurança
    include /etc/nginx/conf.d/nginx-security.conf;

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Redirect HTTP → HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name cyberseg.com.br www.cyberseg.com.br;
    return 301 https://$host$request_uri;
}
```

---

## 6. Checklist de Validação

Após o deploy, execute estas validações para confirmar que a blindagem está ativa:

### 6.1 Ferramentas Online

| Ferramenta                | URL                                          | O que verifica                |
|---------------------------|----------------------------------------------|-------------------------------|
| SSL Labs                  | https://www.ssllabs.com/ssltest/             | Rating TLS (alvo: A+)        |
| Security Headers          | https://securityheaders.com                  | Headers HTTP (alvo: A+)      |
| Mozilla Observatory       | https://observatory.mozilla.org              | Best practices gerais (A+)   |
| PageSpeed Insights        | https://pagespeed.web.dev                    | Core Web Vitals              |
| HSTS Preload              | https://hstspreload.org                      | Validação HSTS Preload       |

### 6.2 Validação via Terminal

```bash
# Verificar versão TLS e cipher suite negociados
openssl s_client -connect cyberseg.com.br:443 -tls1_3

# Verificar que TLS 1.0 está BLOQUEADO (deve falhar)
openssl s_client -connect cyberseg.com.br:443 -tls1

# Verificar que TLS 1.1 está BLOQUEADO (deve falhar)
openssl s_client -connect cyberseg.com.br:443 -tls1_1

# Verificar headers de segurança
curl -I https://cyberseg.com.br

# Verificar HSTS header
curl -sI https://cyberseg.com.br | grep -i strict

# Verificar CSP header
curl -sI https://cyberseg.com.br | grep -i content-security

# Verificar HTTP/2 suporte
curl -sI --http2 https://cyberseg.com.br | head -1
```

### 6.3 Resultados Esperados

```
┌─────────────────────────────────────────────────┐
│ SSL Labs:              A+                       │
│ Security Headers:      A+                       │
│ Mozilla Observatory:   A+                       │
│ TLS 1.3:               ✅ Ativo                 │
│ TLS 1.2:               ✅ Ativo                 │
│ TLS 1.1:               ❌ Bloqueado             │
│ TLS 1.0:               ❌ Bloqueado             │
│ HSTS:                  ✅ 1 ano + preload       │
│ CSP:                   ✅ Restritivo             │
│ HTTP/2:                ✅ Ativo                  │
│ Cloudflare WAF:        ✅ Managed + Custom       │
│ Rate Limiting:         ✅ Global + Checkout      │
│ Bot Protection:        ✅ Bot Fight Mode         │
└─────────────────────────────────────────────────┘
```

---

## 7. Referências Técnicas

| Recurso                                  | Link                                                              |
|------------------------------------------|-------------------------------------------------------------------|
| RFC 8446 — TLS 1.3                       | https://datatracker.ietf.org/doc/html/rfc8446                    |
| RFC 8996 — Deprecating TLS 1.0/1.1      | https://datatracker.ietf.org/doc/html/rfc8996                    |
| Mozilla TLS Configuration Generator     | https://ssl-config.mozilla.org                                    |
| OWASP Secure Headers Project            | https://owasp.org/www-project-secure-headers/                    |
| Cloudflare WAF Documentation            | https://developers.cloudflare.com/waf/                           |
| Content Security Policy Reference       | https://content-security-policy.com                               |
| HSTS Preload Submission                 | https://hstspreload.org                                           |
| Nginx SSL Hardening Guide               | https://nginx.org/en/docs/http/configuring_https_servers.html    |

---

## Estrutura de Arquivos de Segurança

```
site-cyberseg/
├── security/
│   ├── nginx-security.conf        ← Config Nginx (TLS + Headers + Rate Limit)
│   └── cloudflare-waf-setup.conf  ← Guia Cloudflare WAF passo-a-passo
├── public/
│   └── _headers                   ← Headers para Cloudflare Pages
├── vercel.json                    ← Headers para Vercel
└── SECURITY.md                    ← Este documento
```
