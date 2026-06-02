import { Sequelize, DataTypes, ModelStatic } from "sequelize";
import { IPresenca } from "./types";
// import { criarModelAula } from "../aula";

export function criarModelPresenca(DB: Sequelize): ModelStatic<IPresenca> {
  const presenca = DB.define<IPresenca>(
    "presenca",
    {
      p_id: {
        type: DataTypes.INTEGER,
      },
      a_id: {
        type: DataTypes.INTEGER,
      },
      usu_id: {
        type: DataTypes.INTEGER,
      },
      p_presenca: {
        type: DataTypes.BOOLEAN,
      },
      p_data_registro: {
        type: DataTypes.DATEONLY,
      },
    },
    {
      tableName: "presenca",
      timestamps: false
    },
  );

  // const Aula = criarModelAula(DB);

  // presenca.belongsTo(Aula, {foreignKey: "a_id", as: "aula"})

  return presenca;
}
