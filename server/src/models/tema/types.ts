import { Model } from "sequelize";

export interface ITema extends Model {
  t_id: number;
  t_nome: string;
}