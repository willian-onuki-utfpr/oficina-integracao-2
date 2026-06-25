import { Model } from "sequelize";
import { IUsuario } from "../usuario/types";
import { ICertificado } from "../certificado/types";

export interface IMatricula extends Model {
  m_id: number;
  usu_id: number;
  of_id: number;
  m_status: string; // matriculado, aprovado, reprovado, cancelado
  aluno?: Partial<IUsuario>;
  certificado?: Partial<ICertificado>;
}