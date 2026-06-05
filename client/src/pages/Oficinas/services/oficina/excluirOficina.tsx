import { toast } from "react-toastify";
import { api } from "../../../../services/api";

export const excluirOficina = async (of_id: number) => {
  try {
    await api.delete(`/oficina/${of_id}`);

    toast.success("Oficina excluída com sucesso.");
  } catch (error) {
    toast.error("Ocorreu um erro ao excluir a oficina.");
  }
};
