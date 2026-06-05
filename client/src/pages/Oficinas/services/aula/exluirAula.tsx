import { toast } from "react-toastify";
import { api } from "../../../../services/api";

export const excluirAula = async (a_id: number) => {
  try {
    await api.delete(`/aula/${a_id}`);

    toast.success("Aula excluída com sucesso.");
  } catch (error) {
    toast.error("Ocorreu um erro ao excluir a aula.");
  }
};
