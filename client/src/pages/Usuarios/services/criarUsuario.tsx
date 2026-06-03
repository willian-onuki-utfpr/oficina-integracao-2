import { toast } from "react-toastify";
import { api } from "../../../services/api";
import type { IUsuario } from "../interface";
import type { AxiosError } from "axios";

export const criarUsuario = async (usuario: Partial<IUsuario>) => {
  try {
    await api.post(`/usuario`, { usuario });
    
    toast.success("Usuário cadastrado com sucesso.");
  } catch (error) {
    const status = (error as AxiosError).status
    if (status === 422) {
      toast.warning("Já existe um usuário cadastrado com esse email.");
      return status;
    } else {
      toast.error("Ocorreu um erro ao cadastrar o usuário.");
    }
  }
};
