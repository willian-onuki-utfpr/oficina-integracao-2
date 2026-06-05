import { Model } from "sequelize";

export interface IConfiguracaoOficina extends Model {
  co_id: number;
  of_id: number;
  co_dia_semana: string;
  co_horario_inicio: string;
  co_horario_fim: string;
}
