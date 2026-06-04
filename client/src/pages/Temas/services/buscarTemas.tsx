import { toast } from "react-toastify";
import { api } from "../../../services/api";
import type { ITema } from "../inteface";

export const buscarTemas = async () => {
  try {
    const { data } = await api.get<Partial<ITema>[]>(`/tema`);
    return data;
  } catch (error) {
    toast.error("Ocorreu um erro ao atualizar o tema.");
  }
};
