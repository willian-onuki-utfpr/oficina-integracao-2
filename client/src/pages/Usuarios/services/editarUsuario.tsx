import { toast } from "react-toastify";
import { api } from "../../../services/api";
import type { IUsuario } from "../interface";

export const editarUsuario = async (usuario: Partial<IUsuario>) => {
  try {
    await api.put(`/usuario/${usuario.usu_id}`, { usuario });

    toast.success("Usuário atualizado com sucesso.");
  } catch (error) {
    toast.error("Ocorreu um erro ao atualizar o usuário.");
  }
};
