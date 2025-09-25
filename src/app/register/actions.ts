"use server";

import z from "zod/v4";
import { userSchema } from "./schemas";

interface RegisterUserProps {
  email: string;
  password: string;
  passwordConfirm: string;
}

export const registerUser = async ({
  email,
  password,
  passwordConfirm,
}: RegisterUserProps) => {
  const newUserValidation = userSchema.safeParse({
    email,
    password,
    passwordConfirm,
  });

  // TODO cadastrar o usuário no banco de dados

  if (!newUserValidation.success) {
    return {
      success: false,
      mensagem: "Erro na validação dos dados do usuário",
    };
  }

  return {
    success: true,
    mensagem: "Usuário cadastro com sucesso",
  };
};
