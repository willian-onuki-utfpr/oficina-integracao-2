import { api } from "../../../services/api";

export const realizarLogin = async (usu_email: string, usu_senha: string) => {
  const { data } = await api.post<{
    usuario: {
      id: number;
      nome: string;
      email: string;
      tipo: string;
    };
    token;
  }>("/usuario/login", {
    usu_email,
    usu_senha,
  });

  return data;
};
