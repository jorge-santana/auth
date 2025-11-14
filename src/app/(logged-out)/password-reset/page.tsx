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
import Link from "next/link";

export default function Page() {
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const handleSubmit = async (data: LoginSchema) => {
    console.log(data);
    // const response = await loginWithCredentials(data);

    // console.log(response);
    // if (!response.success) {
    //   if (Array.isArray(response.errors)) {
    //     response.errors.forEach((issue) => {
    //       issue.path.forEach((path) => {
    //         form.setError(path as keyof LoginSchema, {
    //           message: issue.message,
    //         });
    //       });
    //     });
    //   }
    // }

    // if (response.success) {
    //   router.push("/my-account");
    // }
  };
  return (
    <div className="flex justify-center items-center min-h-screen">
      {" "}
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Recuperação de senha</CardTitle>
          <CardDescription>
            Esqueceu sua senha? Sem problemas, informe o seu e-mail para
            recuperá-la.
          </CardDescription>
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

                <Button type="submit">Alterar senha</Button>
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
            Já tem uma conta?{" "}
            <Link href="/login" className="underline">
              Entarr
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
