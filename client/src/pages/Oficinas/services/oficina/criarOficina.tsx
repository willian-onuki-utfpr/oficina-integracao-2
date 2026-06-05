import { toast } from "react-toastify"
import type { IOficina } from "../../interface";
import { api } from "../../../../services/api";

export const criarOficina = async (oficina: Partial<IOficina>) => {
  try {
   await api.post("/oficina", { oficina }); 

   toast.success("Oficina criada com sucesso.") 
  } catch (error) {
   toast.error("Ocorreu um erro ao criar a oficina.") 
  }
}