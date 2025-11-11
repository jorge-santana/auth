"use server";

import { auth } from "@/auth";
import { ActionResponse } from "@/types/action-response";
import { changePasswordConfirmSchema } from "@/validation/schemas";

interface ChangePasswordProps {
  currentPassword: string;
  password: string;
  passwordConfirm: string;
}

export const changePassword = async ({
  currentPassword,
  password,
  passwordConfirm,
}: ChangePasswordProps): Promise<ActionResponse> => {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "Você precisa estar logado para alterar a senha",
    };
  }

  const changePasswordValidation = changePasswordConfirmSchema.safeParse({
    currentPassword,
    password,
    passwordConfirm,
  });

  if (!changePasswordValidation.success) {
    return {
      success: false,
      message: "Erro na validação dos dados",
      errors: changePasswordValidation.error.issues,
    };
  }

  //TODO: atualizar a senha no BD
  try {
  } catch (e: unknown) {
    console.error(e);

    return {
      success: false,
      message: "Não foi possível alterar a senha",
    };
  }

  return {
    success: true,
    message: "Senha alterada com sucesso",
  };
};
