"use server";

interface RegisterUserProps {
  email: string;
  password: string;
  passwordConfirm: string;
}

export const registerUser = async ({
  email,
  password,
  passwordConfirm,
}: RegisterUserProps) => {
  console.log("Chegamos no back-end");
  console.log(">>>>>>>> ", email, password, passwordConfirm);
  // TODO validar os parâmetros recebidos na requisição

  // TODO cadastrar o usuário no banco de dados

  return {
    success: true,
    mensagem: "Usuário cadastro com sucesso",
  };
};
