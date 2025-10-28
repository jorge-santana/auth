"use server";

import { userSchema } from "./schemas";
import { PrismaClient } from "../../../generated/prisma/client";
import { hash } from "bcryptjs";

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

  if (!newUserValidation.success) {
    return {
      success: false,
      data: newUserValidation.error?.issues,
    };
  }

  // TODO cadastrar o usuário no banco de dados
  const prismaClient = new PrismaClient();

  const hashedPassword = await hash(password, 10);
  const newUser = await prismaClient.user.create({
    data: { email, password: hashedPassword },
  });

  return {
    success: true,
    data: newUser,
  };
};
