"use server";

import { prisma } from "@/lib/client";
import { ActionResponse } from "@/types/action-response";
import { updatePasswordConfirmSchema } from "@/validation/schemas";
import { hash } from "bcryptjs";

interface UpdatePasswordProps {
  token: string;
  password: string;
  passwordConfirm: string;
}

export const updatePassword = async ({
  token,
  password,
  passwordConfirm,
}: UpdatePasswordProps): Promise<ActionResponse> => {
  const updatePasswordConfirmSchemaValidation =
    updatePasswordConfirmSchema.safeParse({
      token,
      password,
      passwordConfirm,
    });

  if (!updatePasswordConfirmSchemaValidation.success) {
    return {
      success: false,
      message: "Erro ao tentar atualizar a senha",
      errors: updatePasswordConfirmSchemaValidation.error.issues,
    };
  }

  //TODO: atualizar a senha no banco de dados
  //token de reset de senha
  console.log("#### TOKEN: ", token);

  // revalidação do token de reset de senha
  let tokenIsValid = false;

  if (token) {
    const passwordResetToken = await prisma.passwordResetToken.findFirst({
      where: { token },
    });

    if (
      passwordResetToken &&
      !!passwordResetToken.token &&
      Date.now() < passwordResetToken.tokenExpiry.getTime()
    ) {
      tokenIsValid = true;
    }

    if (!tokenIsValid) {
      return {
        success: false,
        message: "Token inválido ou expirado",
      };
    }

    const hashedPassword = await hash(password, 10);
    const passwordUpdated = await prisma.user.update({
      where: { id: passwordResetToken?.userId },
      data: { password: hashedPassword },
    });

    if (!passwordUpdated) {
      return {
        success: false,
        message: "Erro ao atualizar a senha do usuário",
      };
    }

    await prisma.passwordResetToken.delete({
      where: { id: passwordResetToken?.id },
    });
  }

  return {
    success: true,
    message: "Senha atualizada com sucesso",
  };
};
