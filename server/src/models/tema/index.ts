import { Sequelize, DataTypes, ModelStatic } from "sequelize";
import { ITema } from "./types";

export function criarModelTema(DB: Sequelize): ModelStatic<ITema> {
  const tema = DB.define<ITema>(
    "tema",
    {
      t_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      t_nome: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
    },
    {
      tableName: "tema",
      timestamps: false,
    },
  );

  return tema;
}
