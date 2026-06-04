import { toast } from "react-toastify";
import { api } from "../../../services/api";
import type { ITema } from "../inteface";
import type { AxiosError } from "axios";

export const criarTema = async (t_nome: string) => {
  try {
    await api.post<Partial<ITema>>("/tema", {
      t_nome,
    });

    toast.success("Tema cadastrado com sucesso.");
  } catch (error) {
    const status = (error as AxiosError).status;
    if (status === 422) {
      toast.warning("Já existe um tema cadastrado com esse nome.");
      return status;
    } else {
      toast.error("Ocorreu um erro ao cadastrar o tema.");
    }
  }
};
