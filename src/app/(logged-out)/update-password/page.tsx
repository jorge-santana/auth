import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/client";
import Link from "next/link";
import UpdatePasswordForm from "./components/update-password-form";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const searchParamsValues = await searchParams;
  const { token } = searchParamsValues;

  let tokenIsValid = false;

  if (token) {
    const passwordResetToken = await prisma.passwordResetToken.findFirst({
      where: { token },
    });

    if (
      passwordResetToken &&
      !!passwordResetToken.token &&
      Date.now() < passwordResetToken.tokenExpiry.getTime()
    ) {
      tokenIsValid = true;
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      {tokenIsValid ? (
        <Card>
          <CardHeader>
            <CardTitle>Atualização de senha</CardTitle>
          </CardHeader>
          <CardContent>
            {token && <UpdatePasswordForm token={token} />}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Link de atualização de senha expirado :S</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/password-reset" className="underline">
              Solicite um novo link de recuperação de senha
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
