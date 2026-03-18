import { EmailLinkResetPasswordTemplate } from "@/app/(logged-out)/password-reset/components/email-link-reset-password";
import { Resend } from "resend";
import { render } from "@react-email/render";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmailLinkResetPassword({
  to,
  linkResetPassword,
}: {
  to: string;
  linkResetPassword: string;
}) {
  const html = await render(
    EmailLinkResetPasswordTemplate({ linkResetPassword }),
  );

  await resend.emails.send({
    from: "Não responda <nao.responda@resend.dev>",
    to,
    subject: "Recuperação de senha",
    html,
  });
}
