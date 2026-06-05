import { toast } from "react-toastify";
import { api } from "../../../../services/api";
import type { IAula } from "../../interface";

export const criarAula = async (aula: Partial<IAula>) => {
  try {
    await api.post(`/aula`, { aula});

    toast.success("Aula criada com sucesso.");
  } catch (error) {
    toast.error("Ocorreu um erro ao criar a aula.");
  }
};
