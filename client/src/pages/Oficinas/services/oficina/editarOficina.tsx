import { toast } from "react-toastify";
import type { IOficina, IOficinaTutor } from "../../interface";
import { api } from "../../../../services/api";

export const editarOficina = async (
  oficina: Partial<IOficina>,
  tutoresParaAdicionar: Partial<IOficinaTutor>[],
  tutoresParaExcluir: Partial<IOficinaTutor>[],
) => {
  try {
    const { of_id, ...rest } = oficina;
    await api.put(`/oficina/${of_id}`, { oficina: rest, tutoresParaAdicionar, tutoresParaExcluir });

    toast.success("Oficina editada com sucesso.");
  } catch (error) {
    toast.error("Ocorreu um erro ao editar a oficina.");
  }
};
