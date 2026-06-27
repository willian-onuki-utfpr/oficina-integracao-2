import { api } from "../../../services/api";
import type { IOficinaRelatorio } from "../interfaces";

class RelatorioOficinaService {
  buscarRelatorio = async () => {
    const { data } = await api.get<IOficinaRelatorio[]>("/oficina/relatorio");
    return data;
  };
}

export const serviceRelatorioOficina = new RelatorioOficinaService();
