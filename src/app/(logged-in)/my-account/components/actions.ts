"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/client";
import { ActionResponse } from "@/types/action-response";

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

  //TODO: Gerar e salvar o segredo para 2FA.

  return {
    message: "Chegamos até o método get2faSecret",
    success: true,
  };
};
