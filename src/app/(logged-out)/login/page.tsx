"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginSchema, LoginSchema } from "@/validation/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginWithCredentials, preLoginCheck } from "./action";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";

export default function Page() {
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");

  const router = useRouter();
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const handleSubmit = async (data: LoginSchema) => {
    // TODO: verificar se o usuário possui o 2FA true
    const preLoginCheckResponse = await preLoginCheck(data);

    if (!preLoginCheckResponse.success) {
      form.setError("root" as keyof LoginSchema, {
        message: preLoginCheckResponse.message,
      });
    }

    const twoFactorActivated = (
      preLoginCheckResponse?.data as { twoFactorActivated?: boolean }
    )?.twoFactorActivated;

    if (twoFactorActivated) {
      // TODO: exibir o formulário para inserir o OTP
      console.log("exibir o formulário para inserir o OTP");
      setStep(2);
    } else {
      const response = await loginWithCredentials(data);
      if (!response.success) {
        if (Array.isArray(response.errors)) {
          response.errors.forEach((issue) => {
            issue.path.forEach((path) => {
              form.setError(path as keyof LoginSchema, {
                message: issue.message,
              });
            });
          });
        }
      }

      if (response.success) {
        router.push("/my-account");
      }
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(
      "Acionar a server action para validar o OTP e seguir ou não com o fluxo de login",
    );
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      {step === 1 && (
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Acesse sua conta.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <fieldset
                  className="flex flex-col gap-4"
                  disabled={form.formState.isSubmitting}
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit">Entrar</Button>
                  {!!form.formState.errors.root?.message && (
                    <FormMessage>
                      {form.formState.errors.root?.message}
                    </FormMessage>
                  )}
                </fieldset>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex-col">
            <div className="text-muted-foreground text-sm">
              Ainda não tem conta?{" "}
              <Link href="/register" className="underline">
                Registre-se
              </Link>
            </div>

            <div className="text-muted-foreground text-sm">
              Esqueceu sua senha?{" "}
              <Link href="/password-reset" className="underline">
                Alterar senha
              </Link>
            </div>
          </CardFooter>
        </Card>
      )}

      {step === 2 && (
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>OTP (one-time password)</CardTitle>
            <CardDescription>
              Entre com o OTP exibido no seu App de Autenticação.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleOTPSubmit} className="flex flex-col gap-2">
              <InputOTP
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS}
                value={otp}
                onChange={setOtp}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <Button disabled={otp.length !== 6}>Verificar</Button>
              <Button
                variant={"outline"}
                onClick={() => {
                  form.setValue("password", "");
                  setStep(1);
                }}
              >
                Cancelar
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
