import { toast } from "react-toastify";
import type { IOficina } from "../../interface";
import { api } from "../../../../services/api";

export const buscarOficinas = async () => {
  try {
    const { data } = await api.get<Partial<IOficina>[]>("/oficina");

    return data;
  } catch (error) {
    toast.error("Ocorreu um erro ao buscar as oficinas.");
  }
};
