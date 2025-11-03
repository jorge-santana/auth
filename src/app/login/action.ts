"use server";

import { loginSchema } from "@/validation/schemas";
import { $ZodIssue } from "zod/v4/core";

interface ActionResponse {
  success: boolean;
  message: string;
  data?: unknown;
  errors?: $ZodIssue[];
}

interface LoginWithCredentialsProps {
  email: string;
  password: string;
}

export const loginWithCredentials = async ({
  email,
  password,
}: LoginWithCredentialsProps): Promise<ActionResponse> => {
  const loginValidation = loginSchema.safeParse({
    email,
    password,
  });

  if (!loginValidation.success) {
    return {
      success: false,
      message: "Erro na validação dos dados",
      errors: loginValidation.error?.issues,
    };
  }

  // TODO: Validação com NextAuth
  console.log("Chegamos até aqui: ", email, password);

  return {
    success: true,
    message: "Login realizado com sucesso",
  };
};
