require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const crypto = require('crypto');
const actualFetch = typeof fetch !== 'undefined' ? fetch : require('node-fetch');

async function runTest() {
  console.log("🚀 Iniciando Simulação do Webhook Kiwify...\n");

  const payload = {
    order_id: `test_${Date.now()}`,
    order_status: "approved",
    Customer: {
      full_name: "João Hélio",
      email: "joaohelio3966@gmail.com"
    }
  };

  const bodyString = JSON.stringify(payload);
  const headers = {
    'Content-Type': 'application/json'
  };

  const secret = process.env.KIWIFY_WEBHOOK_SECRET || '';
  if (secret) {
    console.log("🔒 Assinatura HMAC ativada (KIWIFY_WEBHOOK_SECRET detectado).");
    const signature = crypto
      .createHmac('sha1', secret)
      .update(bodyString)
      .digest('hex');
    headers['x-kiwify-signature'] = signature;
  } else {
    console.log("⚠️ Sem assinatura (KIWIFY_WEBHOOK_SECRET não está definido).");
  }

  try {
    const response = await actualFetch('https://site-alunos-cursos.vercel.app/api/webhooks/kiwify', {
      method: 'POST',
      headers,
      body: bodyString
    });

    const data = await response.json();
    
    console.log(`Status HTTP: ${response.status}`);
    console.log("Resposta do Servidor:", data);

    if (response.status === 200) {
      console.log("\n✅ Webhook executado com sucesso!");
    } else {
      console.log("\n❌ Erro na simulação.");
    }
  } catch (err) {
    console.error("Falha ao contatar o servidor. O Next.js está rodando (npm run dev)?", err);
  }
}

runTest();
