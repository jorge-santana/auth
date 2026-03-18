import * as React from "react";

interface EmailLinkResetPasswordTemplateProps {
  linkResetPassword: string;
}

export function EmailLinkResetPasswordTemplate({
  linkResetPassword,
}: EmailLinkResetPasswordTemplateProps) {
  return (
    <div>
      <h1>Recuperação de senha</h1>
      <p>Use o link a seguir para recuperar o acesso a sua conta.</p>
      <p>
        <a href={linkResetPassword}>{linkResetPassword}</a>
      </p>
      <p>Não compartilhe este link com ninguém!</p>
      <p>O link tem validade de 1 hora.</p>
      <p>
        Se você não reconhece essa solicitação, por favor, ignore este email.
      </p>
    </div>
  );
}
