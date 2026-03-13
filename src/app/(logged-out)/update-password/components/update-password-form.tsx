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
  updatePasswordConfirmSchema,
  UpdatePasswordConfirmSchema,
} from "@/validation/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updatePassword } from "./action";
import { toast } from "sonner";

export default function UpdatePasswordForm({ token }: { token: string }) {
  const form = useForm<UpdatePasswordConfirmSchema>({
    resolver: zodResolver(updatePasswordConfirmSchema),
    defaultValues: {
      token,
      password: "",
      passwordConfirm: "",
    },
  });
  const handleSubmit = async (data: UpdatePasswordConfirmSchema) => {
    const response = await updatePassword(data);

    console.log(response);
    if (!response.success) {
      if (Array.isArray(response.errors)) {
        response.errors.forEach((issue) => {
          issue.path.forEach((path) => {
            form.setError(path as keyof UpdatePasswordConfirmSchema, {
              message: issue.message,
            });
          });
        });
      } else {
        window.location.reload();
      }
    }

    if (response.success) {
      form.reset();
      toast.success(response.message, {
        style: { background: "green", color: "#fff" },
      });
    }
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
