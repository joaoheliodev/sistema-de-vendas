import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendFirstAccessEmail(email: string, token: string) {
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/setup-password?token=${token}`;

  await resend.emails.send({
    from: 'Suporte CyberSeg <suporte@cyberseg.com>', // Trocar pelo domínio configurado no Resend
    to: email,
    subject: 'Acesso Liberado - Portal CyberSeg',
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #0A0A0A; color: #FFFFFF; padding: 40px; border: 1px solid #CCFF00;">
        <h1 style="color: #CCFF00; text-transform: uppercase;">Acesso Garantido, Hacker.</h1>
        <p>Seu pagamento foi confirmado. O Guia Completo de Cibersegurança está liberado na sua conta.</p>
        <p>Para o seu primeiro acesso, é necessário configurar uma senha segura.</p>
        <a href="${resetLink}" style="display: inline-block; background-color: #CCFF00; color: #0A0A0A; padding: 15px 25px; text-decoration: none; font-weight: bold; text-transform: uppercase; margin-top: 20px;">
          Configurar Senha de Acesso
        </a>
        <p style="margin-top: 30px; font-size: 12px; color: #9CA3AF;">Se o botão não funcionar, copie e cole este link no navegador: <br/>${resetLink}</p>
      </div>
    `
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

  await resend.emails.send({
    from: 'Suporte CyberSeg <suporte@cyberseg.com>',
    to: email,
    subject: 'Redefinição de Senha - Portal CyberSeg',
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #0A0A0A; color: #FFFFFF; padding: 40px; border: 1px solid #1F2937;">
        <h1 style="color: #FFFFFF;">Solicitação de Redefinição de Senha</h1>
        <p>Recebemos um pedido para alterar a senha da sua conta.</p>
        <a href="${resetLink}" style="display: inline-block; background-color: #FFFFFF; color: #0A0A0A; padding: 10px 20px; text-decoration: none; font-weight: bold; margin-top: 20px;">
          Redefinir Senha
        </a>
      </div>
    `
  });
}
