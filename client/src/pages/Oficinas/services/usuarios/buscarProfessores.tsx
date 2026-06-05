import { toast } from "react-toastify";
import { api } from "../../../../services/api";
import type { IUsuario } from "../../../Usuarios/interface";

export const buscarProfessores = async () => {
  try {
    const { data } = await api.get<Partial<IUsuario>[]>("/usuario/professor");

    return data;
  } catch (error) {
    toast.error("Ocorreu um erro ao buscar os professores");
  }
};
