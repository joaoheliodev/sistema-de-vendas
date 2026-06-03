const fetch = require('node-fetch'); // Em Node 18+ o fetch é nativo, mas usamos isso por compatibilidade no script isolado.

async function runTest() {
  console.log("🚀 Iniciando Simulação do Webhook Kiwify...\n");

  const payload = {
    order_id: `test_${Date.now()}`,
    order_status: "approved",
    Customer: {
      full_name: "João Teste",
      email: "joao@teste.com"
    }
  };

  try {
    const response = await fetch('http://localhost:3000/api/webhooks/kiwify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Sem a signature aqui pois nosso código ignora validação se KIWIFY_WEBHOOK_SECRET estiver vazio no .env
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    
    console.log(`Status HTTP: ${response.status}`);
    console.log("Resposta do Servidor:", data);

    if (response.status === 200) {
      console.log("\n✅ Webhook executado com sucesso!");
      console.log("👉 Acesse http://localhost:3000/admin/debug para verificar se o Usuário, o Token e o CourseAccess foram criados no banco.");
    } else {
      console.log("\n❌ Erro na simulação.");
    }
  } catch (err) {
    console.error("Falha ao contatar o servidor. O Next.js está rodando (npm run dev)?", err);
  }
}

runTest();
