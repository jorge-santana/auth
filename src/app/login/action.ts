"use server";

import { signIn } from "@/auth";
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

  try {
    await signIn("credentials", { email, password, redirect: false });
  } catch (e: unknown) {
    console.error(e);

    if (e instanceof Error) {
      return {
        success: false,
        message: e.message,
      };
    }

    return {
      success: false,
      message: "Erro de login",
    };
  }

  return {
    success: true,
    message: "Login realizado com sucesso",
  };
};
