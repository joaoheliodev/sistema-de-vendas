"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function setupPassword(token: string, password: string) {
  if (!token || !password || password.length < 6) {
    return { error: "Senha inválida ou token ausente." };
  }

  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token }
  });

  if (!verificationToken) {
    return { error: "Token inválido ou não encontrado." };
  }

  if (new Date() > verificationToken.expires) {
    return { error: "Token expirado. Solicite um novo acesso." };
  }

  const user = await prisma.user.findUnique({
    where: { email: verificationToken.email }
  });

  if (!user) {
    return { error: "Usuário não encontrado." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Atualizar senha e deletar o token
  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    }),
    prisma.verificationToken.delete({
      where: { token }
    })
  ]);

  return { success: true };
}
