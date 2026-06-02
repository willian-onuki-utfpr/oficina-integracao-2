import { Sequelize, DataTypes, ModelStatic } from "sequelize";
import { IUsuario } from "./types";
// import { criarModelMatricula } from "../matricula";
// import { criarModelOficinaTutor } from "../oficina_tutor";
// import { criarModelPresenca } from "../presenca";

export function criarModelUsuario(DB: Sequelize): ModelStatic<IUsuario> {
  const usuario = DB.define<IUsuario>(
    "usuario",
    {
      usu_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      usu_nome: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      usu_email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      usu_senha: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      usu_tipo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "usuario",
      timestamps: false
    },
  );

  // const Matricula = criarModelMatricula(DB);
  // const OficinaTutor = criarModelOficinaTutor(DB);
  // const Presenca = criarModelPresenca(DB);

  // usuario.hasMany(Matricula, {foreignKey: "usu_id", as: "matriculas"})
  // usuario.hasMany(OficinaTutor, {foreignKey: "usu_id", as: "tutores"})
  // usuario.hasMany(Presenca, {foreignKey: "usu_id", as: "presencas"})

  return usuario;
}
