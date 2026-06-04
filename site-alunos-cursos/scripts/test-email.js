require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const { sendFirstAccessEmail } = require('../src/lib/mail');

const TEST_EMAIL = 'joaohelio396@gmail.com';
const TEST_TOKEN = 'token-teste-validacao-123';

console.log(`Enviando e-mail de teste para: ${TEST_EMAIL}...`);

sendFirstAccessEmail(TEST_EMAIL, TEST_TOKEN)
  .then(() => console.log('✅ E-mail enviado com sucesso via Resend! Verifique sua caixa de entrada.'))
  .catch((err) => {
    console.error('❌ Erro ao enviar e-mail:', err);
  });
