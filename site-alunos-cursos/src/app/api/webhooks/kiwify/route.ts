import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import { sendFirstAccessEmail } from '@/lib/mail';
import crypto from 'crypto';

// The default course ID for this specific SaaS (Guia Completo de Cibersegurança)
// Em produção, isso viria mapeado do product_id da Kiwify para o courseId do BD
const DEFAULT_COURSE_TITLE = "Guia Completo de Cibersegurança";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-kiwify-signature');
    const KIWIFY_WEBHOOK_SECRET = process.env.KIWIFY_WEBHOOK_SECRET || '';

    // Validação de assinatura (HMAC SHA1)
    if (KIWIFY_WEBHOOK_SECRET) {
      const expectedSignature = crypto
        .createHmac('sha1', KIWIFY_WEBHOOK_SECRET)
        .update(rawBody)
        .digest('hex');

      if (signature !== expectedSignature) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);
    const event = payload.order_status; // ex: paid, refunded, chargeback
    const customer = payload.Customer;

    if (!customer || !customer.email) {
      return NextResponse.json({ error: 'No customer data' }, { status: 400 });
    }

    // Achar o curso principal no banco
    const course = await prisma.course.findFirst({
      where: { title: DEFAULT_COURSE_TITLE }
    });

    if (!course) {
      return NextResponse.json({ error: 'Default course not found in DB' }, { status: 500 });
    }

    // Registrar o Log
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
        where: { email: customer.email }
      });

      let isFirstAccess = false;

      // Se não existe, cria usuário
      if (!user) {
        user = await prisma.user.create({
          data: {
            email: customer.email,
            name: customer.full_name,
            role: 'STUDENT',
          }
        });
        isFirstAccess = true;
      }

      // Conceder acesso ao curso
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

      // Lógica de primeiro acesso (Gerar senha temporária e enviar e-mail)
      if (isFirstAccess || !user.password) {
        const tempPassword = crypto.randomBytes(4).toString('hex'); // 8 char random password
        const bcrypt = require('bcrypt');
        const hashedPassword = await bcrypt.hash(tempPassword, 10);
        
        await prisma.user.update({
          where: { id: user.id },
          data: { 
            password: hashedPassword,
            mustChangePassword: true
          }
        });

        await sendFirstAccessEmail(user.email, tempPassword);
      }

      return NextResponse.json({ message: 'Access granted' }, { status: 200 });
    }

    // Tratar eventos de revogação
    if (event === 'refunded' || event === 'chargeback') {
      const user = await prisma.user.findUnique({
        where: { email: customer.email }
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
