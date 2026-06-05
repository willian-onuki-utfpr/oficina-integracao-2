import { toast } from "react-toastify";
import type { IAula } from "../../interface";
import { api } from "../../../../services/api";

export const buscarAulasOficina = async (of_id: number) => {
  try {
    const { data } = await api.get<Partial<IAula>[]>(`/aula/oficina/${of_id}`);

    return data;
  } catch (error) {
    toast.error("Ocorreu um erro ao buscar as aulas da oficina.");
  }
};
