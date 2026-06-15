import { toast } from "react-toastify";
import { api } from "../../../../services/api";
import type { IOficina } from "../../../Oficinas/interface";

export const buscarOficinasParaMatricular = async (usu_id: number) => {
  try {
    const {data} = await api.get<Partial<IOficina>[]>(`/matricula/aluno/${usu_id}/disponiveis`);
    return data;
  } catch (error) {
    toast.error("Ocorreu um erro ao listar as oficinas não matriculadas.");
  }
};
