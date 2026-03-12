"use server";

import { ActionResponse } from "@/types/action-response";
import { passwordConfirmSchema } from "@/validation/schemas";

interface UpdatePasswordProps {
  password: string;
  passwordConfirm: string;
}

export const updatePassword = async ({
  password,
  passwordConfirm,
}: UpdatePasswordProps): Promise<ActionResponse> => {
  console.log("Server action: ", password, passwordConfirm);

  const passwordConfirmSchemaValidation = passwordConfirmSchema.safeParse({
    password,
    passwordConfirm,
  });

  if (!passwordConfirmSchemaValidation.success) {
    return {
      success: false,
      message: "Erro ao tentar atualizar a senha",
      errors: passwordConfirmSchemaValidation.error.issues,
    };
  }

  //TODO: atualizar a senha no banco de dados

  return {
    success: true,
    message: "Senha atualizada com sucesso",
  };
};
