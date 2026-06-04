import { toast } from "react-toastify";
import { api } from "../../../services/api";
import type { ITema } from "../inteface";
import type { AxiosError } from "axios";

export const editarTema = async (tema: Partial<ITema>) => {
  try {
    await api.put(`/tema/${tema.t_id}`, {
      t_nome: tema.t_nome,
    });

    toast.success("Tema atualizado com sucesso.");
  } catch (error) {
    const status = (error as AxiosError).status;
    if (status === 422) {
      toast.warning("Já existe um tema cadastrado com esse nome.");
      return status;
    } else {
      toast.error("Ocorreu um erro ao atualizar o tema.");
    }
  }
};
