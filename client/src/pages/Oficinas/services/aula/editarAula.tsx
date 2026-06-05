import { toast } from "react-toastify";
import { api } from "../../../../services/api";
import type { IAula } from "../../interface";

export const editarAula = async (aula: Partial<IAula>) => {
  const { a_id, ...rest } = aula;
  try {
    await api.put(`/aula/${a_id}`, { aula: rest });

    toast.success("Aula editada com sucesso.");
  } catch (error) {
    toast.error("Ocorreu um erro ao editar a aula.");
  }
};
