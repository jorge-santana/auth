"use server";

import { ActionResponse } from "@/types/action-response";
import { updatePasswordConfirmSchema } from "@/validation/schemas";

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

  //de validação do token

  return {
    success: true,
    message: "Senha atualizada com sucesso",
  };
};
