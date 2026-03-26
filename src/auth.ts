import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./lib/client";
import { compare } from "bcryptjs";
import { verify } from "otplib";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
        token: {},
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("E-mail e senha são obrigatórios");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) {
          throw new Error("Usuário não encontrado");
        }

        const isPasswordValid = await compare(
          credentials.password as string,
          user.password,
        );

        if (!isPasswordValid) {
          throw new Error("Senha incorreta");
        }

        // validar o otp se 2fa for true

        const twoFactorActivated = user.twoFactorActivated;

        if (twoFactorActivated) {
          const twoFactorSecret = user.twoFactorSecret;
          const tokenValid = await verify({
            secret: twoFactorSecret as string,
            token: credentials.token as string,
          });

          if (!tokenValid.valid) {
            throw new Error("OTP inválido");
          }
        }

        return {
          id: user.id,
          email: user.email,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }

      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.email = token.email as string;

      return session;
    },
  },
});
