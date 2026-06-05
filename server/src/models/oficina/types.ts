import { Model } from "sequelize";

export interface IOficina extends Model {
  of_id: number;
  t_id: number;
  of_descricao: string;
  of_data_inicio: Date;
  of_data_fim: Date;
  of_carga_horaria: number;
  of_limite_faltas: number;
  of_professor_responsave: number;
}