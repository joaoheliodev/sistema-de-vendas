import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendFirstAccessEmail(email: string, tempPassword: string) {
  const loginLink = `${process.env.NEXT_PUBLIC_APP_URL}/login`;

  await resend.emails.send({
    from: 'Equipe CyberSeg <suporte@cyberseg.com>', // Trocar pelo domínio configurado no Resend
    to: email,
    subject: 'Boas-vindas ao CyberSeg! 🚀 Seu acesso está liberado',
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; background-color: #050505; color: #FFFFFF; padding: 40px; border: 2px solid #1A1A1A; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #CCFF00; text-transform: uppercase; font-size: 28px; font-weight: 800; letter-spacing: 2px;">BEM-VINDO AO CYBERSEG</h1>
        
        <p style="font-size: 16px; line-height: 1.6; color: #E5E7EB; margin-bottom: 24px;">
          Olá, futuro(a) especialista!<br/><br/>
          Muito obrigado por confiar no nosso método. O seu pagamento foi aprovado com sucesso e temos a honra de dar as boas-vindas ao <strong>Guia Completo de Cibersegurança</strong>!
        </p>

        <div style="background-color: #0A0A0A; border-left: 4px solid #CCFF00; padding: 20px; margin-bottom: 24px;">
          <h2 style="color: #FFFFFF; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-top: 0; margin-bottom: 12px;">Suas Credenciais de Acesso:</h2>
          <p style="margin: 4px 0; color: #9CA3AF;"><strong>E-mail:</strong> <span style="color: #FFFFFF;">${email}</span></p>
          <p style="margin: 4px 0; color: #9CA3AF;"><strong>Senha Temporária:</strong> <span style="color: #FFFFFF; font-family: monospace; font-size: 16px;">${tempPassword}</span></p>
        </div>

        <p style="font-size: 14px; color: #F87171; background-color: rgba(248, 113, 113, 0.1); padding: 12px; border: 1px solid rgba(248, 113, 113, 0.2); border-radius: 4px; margin-bottom: 24px;">
          ⚠️ <strong>ATENÇÃO:</strong> Esta senha é temporária e serve apenas para o seu primeiro acesso. Por questões de segurança, o sistema exigirá que você cadastre uma nova senha definitiva logo após o login.
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${loginLink}" style="display: inline-block; background-color: #CCFF00; color: #000000; padding: 16px 32px; text-decoration: none; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; border-radius: 2px;">
            Acessar Plataforma Agora
          </a>
        </div>

        <p style="margin-top: 40px; font-size: 12px; color: #6B7280; text-align: center; border-top: 1px solid #1A1A1A; padding-top: 20px;">
          Se o botão não funcionar, copie e cole o link abaixo no seu navegador:<br/>
          <a href="${loginLink}" style="color: #CCFF00; text-decoration: underline;">${loginLink}</a><br/><br/>
          Em caso de dúvidas, responda a este e-mail.
        </p>
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
