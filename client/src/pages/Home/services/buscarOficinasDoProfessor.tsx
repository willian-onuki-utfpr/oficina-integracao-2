import { api } from "../../../services/api";
import type { IOficinaProfessor } from "../interfaces";

class OficinaProfessor {
  buscarOficinasDoProfessor = async (usu_id: number) => {
    const { data } = await api.get<Partial<IOficinaProfessor>[]>(
      `/oficina/professor/${usu_id}`,
    );
    return data;
  };
}

export const serviceOficinaProfessor = new OficinaProfessor();
