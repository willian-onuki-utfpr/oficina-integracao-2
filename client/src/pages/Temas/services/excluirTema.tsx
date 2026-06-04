import { toast } from "react-toastify";
import { api } from "../../../services/api";

export const excluirTemas = async (t_id: number) => {
  try {
    await api.delete(`/tema/${t_id}`);
    toast.success("Tema excluído com sucesso.");
  } catch (error) {
    toast.error("Ocorreu um erro ao excluir o tema.");
  }
};
