import { Model } from "sequelize";

export interface IMatricula extends Model {
  m_id: number;
  usu_id: number;
  of_id: number;
  m_status: string; // matriculado, aprovado, reprovado, cancelado
}