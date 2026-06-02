import { Model } from "sequelize";

export interface IAula extends Model {
  a_id: number;
  of_id: number;
  a_titulo: string;
  a_conteudo: string;
  a_data: Date;
  a_hora_inicio: Date;
  a_hora_fim: Date;
}