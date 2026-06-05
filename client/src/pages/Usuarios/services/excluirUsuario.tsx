import { toast } from "react-toastify";
import { api } from "../../../services/api";

export const excluirUsuario = async (usu_id: number) => {
  try {
    await api.delete(`/usuario/${usu_id}`);
    toast.success("Usuário excluído com sucesso.");
  } catch (error) {
    toast.error("Ocorreu um erro ao excluir o usuário.");
  }
};
