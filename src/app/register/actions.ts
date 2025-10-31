"use server";

import { userSchema } from "../../validation/schemas";
import { Prisma, User } from "../../../generated/prisma/client";
import { hash } from "bcryptjs";
import { $ZodIssue } from "zod/v4/core";
import { prisma } from "@/lib/client";

interface ActionResponse {
  success: boolean;
  message: string;
  data?: User;
  errors?: $ZodIssue[];
}

interface RegisterUserProps {
  email: string;
  password: string;
  passwordConfirm: string;
}

export const registerUser = async ({
  email,
  password,
  passwordConfirm,
}: RegisterUserProps): Promise<ActionResponse> => {
  try {
    const newUserValidation = userSchema.safeParse({
      email,
      password,
      passwordConfirm,
    });

    if (!newUserValidation.success) {
      return {
        success: false,
        message: "Erro na validação dos dados",
        errors: newUserValidation.error?.issues,
      };
    }

    const hashedPassword = await hash(password, 10);
    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword },
    });

    return {
      success: true,
      message: "Conta criada com sucesso",
      data: newUser,
    };
  } catch (e: unknown) {
    console.log("########## erro capturado no catch ########");
    console.log(e);
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      switch (e.code) {
        case "P2002":
          return {
            success: false,
            message: "E-mail já está em uso",
            errors: [
              {
                path: ["email"],
                message: "O e-mail informado já está em uso",
                code: "custom",
              },
            ],
          };
      }
    }

    return {
      success: false,
      message: "Erro ao criar a conta",
    };
  }
};
