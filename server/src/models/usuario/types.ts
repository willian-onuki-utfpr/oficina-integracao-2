import { Model } from "sequelize";

export interface IUsuario extends Model {
  usu_id: number;
  usu_nome: string;
  usu_email: string;
  usu_senha: string;
  usu_tipo: string;
  usu_sessao: string;
}