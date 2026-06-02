import { Model } from "sequelize";

export interface ICertificado extends Model {
  c_id: number;
  m_id: number;
  c_data_emissao: Date;
  c_carga_horaria: number;
}