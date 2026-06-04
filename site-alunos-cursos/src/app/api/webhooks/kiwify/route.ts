import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { sendSetupPasswordEmail } from '@/lib/mail';

const DEFAULT_COURSE_TITLE = "Guia Completo de Cibersegurança";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-kiwify-signature');
    const KIWIFY_WEBHOOK_SECRET = process.env.KIWIFY_WEBHOOK_SECRET || '';

    // 1. VALIDAÇÃO DO WEBHOOK (HMAC-SHA256)
    if (KIWIFY_WEBHOOK_SECRET) {
      const expectedSignature = crypto
        .createHmac('sha256', KIWIFY_WEBHOOK_SECRET)
        .update(rawBody)
        .digest('hex');

      if (signature !== expectedSignature) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);
    const event = payload.order_status;
    const customer = payload.customer || payload.Customer;

    if (!customer || !customer.email) {
      return NextResponse.json({ error: 'No customer data' }, { status: 400 });
    }

    const email = customer.email;
    const name = customer.name || customer.full_name || 'Aluno';

    // 2. CONTROLE DE ACESSO BD LOCAL (PRISMA)
    const course = await prisma.course.findFirst({
      where: { title: DEFAULT_COURSE_TITLE }
    });

    if (!course) {
      return NextResponse.json({ error: 'Default course not found in DB' }, { status: 500 });
    }

    // Registrar o log do Webhook no Prisma
    await prisma.webhookLog.create({
      data: {
        event: event || 'unknown',
        payload: payload,
        status: 'RECEIVED'
      }
    });

    // Tratar eventos de sucesso (Pagamento Aprovado)
    if (event === 'paid' || event === 'approved') {
      let user = await prisma.user.findUnique({
        where: { email }
      });

      // Se não existe no banco Prisma, cria o usuário
      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            name,
            role: 'STUDENT',
          }
        });
      }

      // Concede/Atualiza acesso ao curso no Prisma
      await prisma.courseAccess.upsert({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: course.id
          }
        },
        update: {
          status: 'ACTIVE',
          kiwifyOrderId: payload.order_id
        },
        create: {
          userId: user.id,
          courseId: course.id,
          status: 'ACTIVE',
          kiwifyOrderId: payload.order_id
        }
      });

      // 2.5. CRIAR TOKEN DE DEFINIÇÃO DE SENHA NO PRISMA
      const token = crypto.randomBytes(32).toString('hex');
      await prisma.verificationToken.create({
        data: {
          email,
          token,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas
        }
      });

      // ENVIAR E-MAIL DE DEFINIÇÃO DE SENHA VIA RESEND
      try {
        await sendSetupPasswordEmail(email, token);
      } catch (err) {
        console.error('Failed to send Resend setup password email:', err);
      }

      // 3. DISPARO DO CONVITE (SUPABASE AUTH ADMIN)
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (!supabaseUrl) {
        return NextResponse.json({ error: 'Supabase URL missing' }, { status: 500 });
      }

      let inviteResult;
      
      // Bypass em desenvolvimento caso a service role key não esteja disponível localmente
      if (!supabaseServiceKey || supabaseServiceKey.trim() === '') {
        console.warn("Supabase Service Role Key missing locally. Simulating successful invitation flow.");
        inviteResult = { data: { user: { email } }, error: null };
      } else {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        inviteResult = await supabase.auth.admin.inviteUserByEmail(email, {
          redirectTo: 'https://site-alunos-cursos.vercel.app/login',
          data: { full_name: name }
        });
      }

      const { data, error } = inviteResult;

      if (error) {
        if (error.message.includes('already registered') || error.message.includes('already exists')) {
          return NextResponse.json({ message: 'Access granted (User already registered)' }, { status: 200 });
        }
        console.error('Supabase Invite Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      // Retorna 200 OK caso o convite seja processado/aceito com sucesso
      return NextResponse.json({
        message: 'Access granted',
        invited: true,
        email: email,
        setupLink: `https://site-alunos-cursos.vercel.app/setup-password?token=${token}`
      }, { status: 200 });
    }

    // Tratar eventos de revogação de acesso
    if (event === 'refunded' || event === 'chargeback') {
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (user) {
        await prisma.courseAccess.updateMany({
          where: {
            userId: user.id,
            courseId: course.id
          },
          data: {
            status: 'BLOCKED'
          }
        });
      }

      return NextResponse.json({ message: 'Access revoked' }, { status: 200 });
    }

    return NextResponse.json({ message: 'Event ignored' }, { status: 200 });

  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
