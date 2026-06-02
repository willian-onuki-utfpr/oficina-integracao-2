import { Model } from "sequelize";

export interface IPresenca extends Model {
  p_id: number;
  a_id: number;
  usu_id: number;
  p_presenca: boolean;
  p_data_registro: Date;
}