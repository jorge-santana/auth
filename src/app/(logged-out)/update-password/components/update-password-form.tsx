"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  passwordConfirmSchema,
  PasswordConfirmSchema,
} from "@/validation/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
//import { changePassword } from "./action";
//import { toast } from "sonner";

export default function UpdatePasswordForm() {
  const form = useForm<PasswordConfirmSchema>({
    resolver: zodResolver(passwordConfirmSchema),
    defaultValues: {
      password: "",
      passwordConfirm: "",
    },
  });
  const handleSubmit = async (data: PasswordConfirmSchema) => {
    console.log("Data: ", data);
    /*
    const response = await changePassword(data);

    console.log(response);
    if (!response.success) {
      if (Array.isArray(response.errors)) {
        response.errors.forEach((issue) => {
          issue.path.forEach((path) => {
            form.setError(path as keyof ChangePasswordConfirmSchema, {
              message: issue.message,
            });
          });
        });
      }
    }

    if (response.success) {
      form.reset();
      toast.success(response.message);
    }*/
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <fieldset
          className="flex flex-col gap-4"
          disabled={form.formState.isSubmitting}
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nova senha</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="passwordConfirm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmação da nova senha</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Alterar senha</Button>
          {!!form.formState.errors.root?.message && (
            <FormMessage>{form.formState.errors.root?.message}</FormMessage>
          )}
        </fieldset>
      </form>
    </Form>
  );
}
