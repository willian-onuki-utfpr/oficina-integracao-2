import { Model } from "sequelize";

export interface IOficina extends Model {
  of_id: number;
  of_nome: number;
  of_descricao: number;
  of_data_inicio: Date;
  of_data_fim: Date;
  of_carga_horaria: number;
  of_percentual_minimo_presenca: number;
  of_professor_responsavel: number;
}