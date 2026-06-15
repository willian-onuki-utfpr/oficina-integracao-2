import { Sequelize, DataTypes, ModelStatic } from "sequelize";
import { IMatricula } from "./types";

export function criarModelMatricula(DB: Sequelize): ModelStatic<IMatricula> {
  const matricula = DB.define<IMatricula>(
    "matricula",
    {
      m_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      usu_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      of_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      m_status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "matricula",
      timestamps: false,
    },
  );

  return matricula;
}
