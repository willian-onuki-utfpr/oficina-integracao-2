import { toast } from "react-toastify";
import { api } from "../../../../services/api";
import type { IOficinaAluno } from "../..";

export const buscarOficinasParaMatricular = async (usu_id: number) => {
  try {
    const {data} = await api.get<Partial<IOficinaAluno>[]>(`/matricula/aluno/${usu_id}/disponiveis`);
    return data;
  } catch (error) {
    toast.error("Ocorreu um erro ao listar as oficinas não matriculadas.");
  }
};
