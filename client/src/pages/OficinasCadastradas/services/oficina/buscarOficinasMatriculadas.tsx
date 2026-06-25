import { toast } from "react-toastify";
import { api } from "../../../../services/api";
import type { IOficinaAluno } from "../..";

export const buscarOficinasMatriculadas = async (usu_id: number) => {
  try {
    const {data} = await api.get<Partial<IOficinaAluno>[]>(`/matricula/aluno/${usu_id}`);
    return data;
  } catch (error) {
    toast.error("Ocorreu um erro ao listar as oficinas matriculadas.");
  }
};
