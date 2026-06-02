import { Model } from "sequelize";

export interface IUsuario extends Model {
  usu_id: number;
  usu_nome: number;
  usu_email: number;
  usu_senha: string;
  usu_tipo: string;
}