import { toast } from "react-toastify";
import { api } from "../../../../services/api";

export const cancelarMatricula = async (usu_id: number, of_id:number) => {
  try {
    await api.put(`/matricula/${usu_id}/${of_id}/cancelar/`);

    toast.success("Inscrição cancelada com sucesso.");
  } catch (error) {
    toast.error("Ocorreu um erro ao cancelar a inscrição da oficina.");
  }
};
