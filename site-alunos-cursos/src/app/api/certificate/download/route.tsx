import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import React from 'react';
import { renderToStream } from '@react-pdf/renderer';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const stylesDark = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#050505',
    padding: 60,
    color: '#FFFFFF',
    border: '15px solid #CCFF00',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  watermark: {
    position: 'absolute',
    top: '30%',
    left: '25%',
    opacity: 0.03,
    fontSize: 150,
    fontWeight: 'extrabold',
    color: '#CCFF00',
    transform: 'rotate(-15deg)'
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#CCFF00',
    textTransform: 'uppercase',
    letterSpacing: 8
  },
  title: {
    fontSize: 48,
    fontWeight: 'extrabold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#FFFFFF',
    letterSpacing: 2
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 40,
    textAlign: 'center',
    color: '#A0A0A0',
    lineHeight: 1.5,
    paddingHorizontal: 80
  },
  nameBox: {
    backgroundColor: '#111111',
    border: '2px solid #2A2A2A',
    padding: 20,
    width: '80%',
    marginBottom: 30,
    alignItems: 'center'
  },
  name: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#CCFF00',
    textTransform: 'uppercase',
    letterSpacing: 4
  },
  score: {
    fontSize: 16,
    color: '#FFFFFF',
    backgroundColor: '#2A2A2A',
    padding: '8 16',
    borderRadius: 4
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    left: 60,
    right: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 10,
    color: '#666666',
    borderTop: '1px solid #2A2A2A',
    paddingTop: 10
  }
});

const LandoTemplate = ({ name, score, code, date }: any) => (
  <Document>
    <Page size="A4" orientation="landscape" style={stylesDark.page}>
      <Text style={stylesDark.watermark}>CYBERSEG</Text>
      
      <Text style={stylesDark.header}>CERTIFICADO DE CONCLUSÃO</Text>
      <Text style={stylesDark.title}>GUIA COMPLETO DE CIBERSEGURANÇA</Text>
      
      <Text style={stylesDark.subtitle}>
        Atestamos e certificamos formalmente que o aluno abaixo cumpriu todos os requisitos, {'\n'}
        assistiu a 100% da carga horária e foi aprovado no CyberSeg Final Assessment com excelência.
      </Text>
      
      <View style={stylesDark.nameBox}>
        <Text style={stylesDark.name}>{name}</Text>
      </View>
      
      <Text style={stylesDark.score}>Rendimento Final: {score}%</Text>
      
      <View style={stylesDark.footer}>
        <Text>Emitido em: {date}</Text>
        <Text>Validação Autêntica: {code}</Text>
      </View>
    </Page>
  </Document>
);

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      examAttempts: {
        where: { approved: true },
        orderBy: { score: 'desc' },
        take: 1
      },
      courseAccess: {
        where: { status: 'ACTIVE' },
        include: { course: true }
      }
    }
  });

  if (!user || user.examAttempts.length === 0 || user.courseAccess.length === 0) {
    return new NextResponse('Certificate not unlocked yet.', { status: 403 });
  }

  const course = user.courseAccess[0].course;
  const bestAttempt = user.examAttempts[0];

  // Get the exam with questions to calculate the real percentage
  const examWithQuestions = await prisma.finalExam.findUnique({
    where: { id: bestAttempt.examId },
    include: { questions: true }
  });
  const totalQuestions = examWithQuestions?.questions?.length || 0;
  const percentage = examWithQuestions && totalQuestions > 0
    ? Math.round((Number(bestAttempt.score) / totalQuestions) * 100)
    : Number(bestAttempt.score) || 0;

  // Find or Create Certificate record
  let cert = await prisma.certificate.findUnique({
    where: {
      userId_courseId: { userId: user.id, courseId: course.id }
    }
  });

  if (!cert) {
    const count = await prisma.certificate.count();
    const certNumber = `CYB-2026-${String(count + 1).padStart(6, '0')}`;
    
    cert = await prisma.certificate.create({
      data: {
        userId: user.id,
        courseId: course.id,
        certificateNumber: certNumber
      }
    });
  }

  try {
    const stream = await renderToStream(
      <LandoTemplate 
        name={user.name || 'Aluno CyberSeg'}
        score={percentage}
        code={cert.certificateNumber}
        date={cert.issuedAt.toLocaleDateString('pt-BR')}
      />
    );

    return new NextResponse(stream as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Certificado_${cert.certificateNumber}.pdf"`
      }
    });
  } catch (err) {
    console.error(err);
    return new NextResponse('Error generating PDF', { status: 500 });
  }
}
