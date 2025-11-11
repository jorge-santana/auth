"use server";

import { signIn } from "@/auth";
import { ActionResponse } from "@/types/action-response";
import { loginSchema } from "@/validation/schemas";
import { AuthError } from "next-auth";

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
    await signIn("credentials", { email, password, redirect: false }); // NEXT_REDIRECT
  } catch (e: unknown) {
    console.error(e);

    if (e instanceof AuthError) {
      return {
        success: false,
        message: "Erro ao realizar o login",
        errors: [
          {
            path: ["root"],
            message: e.cause?.err?.message ?? "Erro ao realizar o login",
            //message: "Erro ao realizar o login. Tente novamente mais tarde!",
            code: "custom",
          },
        ],
      };
    }

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
