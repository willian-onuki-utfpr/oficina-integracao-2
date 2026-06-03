import { toast } from "react-toastify";
import { api } from "../../../services/api";
import type { IUsuario } from "../interface";

export const buscarUsuarios = async () => {
  try {
    const { data } = await api.get<Partial<IUsuario>[]>("/usuario");

    return data;
  } catch (error) {
    toast.error("Ocorreu um erro ao buscar os usuários.");
  }
};
