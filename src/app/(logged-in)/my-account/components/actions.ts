"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/client";
import { ActionResponse } from "@/types/action-response";
import { generateSecret, generateURI } from "otplib";

export const get2faSecret = async (): Promise<ActionResponse> => {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      message: "Não autorizado",
      success: false,
    };
  }

  const user = await prisma.user.findFirst({ where: { id: session.user.id } });

  if (!user) {
    return {
      message: "Usuário não encontrado",
      success: false,
    };
  }

  let twoFactorSecret = user.twoFactorSecret;

  if (!twoFactorSecret) {
    twoFactorSecret = generateSecret();
    await prisma.user.update({
      where: { id: user.id },
      data: { twoFactorSecret },
    });
  }

  const uri = generateURI({
    issuer: process.env.APP_NAME || "",
    label: user.email,
    secret: twoFactorSecret,
  });

  return {
    message: "Chegamos até o método get2faSecret",
    success: true,
    data: uri,
  };
};
