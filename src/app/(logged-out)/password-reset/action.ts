"use server";

import { prisma } from "@/lib/client";
import { sendEmailLinkResetPassword } from "@/lib/email";
import { ActionResponse } from "@/types/action-response";
import { resetPasswordSchema } from "@/validation/schemas";
import { randomBytes } from "node:crypto";

interface PasswordResetProps {
  email: string;
}

export const passwordReset = async ({
  email,
}: PasswordResetProps): Promise<ActionResponse> => {
  const resetPasswordValidation = resetPasswordSchema.safeParse({ email });

  if (!resetPasswordValidation.success) {
    return {
      success: false,
      message: "Erro na validação dos dados",
      errors: resetPasswordValidation.error.issues,
    };
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return {
      success: false,
      message: "Usuário não encontrado",
      errors: [
        {
          path: ["email"],
          message: "Usuário não encontrado",
          code: "custom",
        },
      ],
    };
  }

  // token de autorização para reset de senha
  const passwordResetToken = randomBytes(32).toString("hex");

  // salvar o token
  const tokenExpiry = new Date(Date.now() + 3600000); // 60 minutos
  const newPasswordResetToken = await prisma.passwordResetToken.upsert({
    where: { userId: user.id },
    create: { token: passwordResetToken, userId: user.id, tokenExpiry },
    update: { token: passwordResetToken, tokenExpiry },
  });

  //Enviar o e-mail com o token de reset de senha para o usuário
  const linkResetPassword = `http://localhost:3000/update-password?token=${passwordResetToken}`;
  await sendEmailLinkResetPassword({ to: email, linkResetPassword });

  return {
    success: true,
    message: "Solicitação de alteração de senha iniciada com sucesso",
    data: newPasswordResetToken,
  };
};
