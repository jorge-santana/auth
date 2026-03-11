import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const searchParamsValues = await searchParams;
  const { token } = searchParamsValues;

  let tokenIsValid = false;

  if (token) {
    //TODO: validar se o token existe no banco de dados e se está válido (não expirado)
    tokenIsValid = true;
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      {tokenIsValid ? (
        <Card>
          <CardHeader>
            <CardTitle>Atualização de senha</CardTitle>
          </CardHeader>
          <CardContent>TODO: Formulário de atualização de senha</CardContent>
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
