import { toast } from "react-toastify";
import { api } from "../../../../services/api";
import type { IMatricula } from "../../interface";
import type { AxiosError } from "axios";

export const criarMatricula = async (matricula: Partial<IMatricula>) => {
  try {
    await api.post("/matricula", { matricula });
    toast.success("Inscrição realizada com sucesso.");
  } catch (error) {
    const status = (error as AxiosError).status;
    if (status === 422) {
      toast.warning("Já está inscrito nesta oficina.");
      return status;
    } else {
      toast.error("Ocorreu um erro ao realizar a inscrição.");
    }
  }
};
