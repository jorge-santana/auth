import z from "zod/v4";

const emailSchema = z.email("E-mail inválido");
const passwordSchema = z
  .string()
  .min(4, "A senha deve ter no mínimo 6 caracteres");

export const userSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    passwordConfirm: z.string(),
  })
  .superRefine((data, context) => {
    if (data.password !== data.passwordConfirm) {
      context.addIssue({
        code: "custom",
        path: ["passwordConfirm"],
        message: "A senha não confere",
      });
    }
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type UserSchema = z.infer<typeof userSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
