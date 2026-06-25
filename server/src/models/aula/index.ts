import { Sequelize, DataTypes, ModelStatic } from "sequelize";
import { IAula } from "./types";
// import { criarModelOficina } from "../oficina";

export function criarModelAula(DB: Sequelize): ModelStatic<IAula> {
  const aula = DB.define<IAula>(
    "aula",
    {
      a_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      of_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      a_titulo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      a_conteudo: {
        type: DataTypes.TEXT,
      },
      a_data: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      a_hora_inicio: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      a_hora_fim: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      a_realizada: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {
      tableName: "aula",
      timestamps: false,
    },
  );

  // const Oficina = criarModelOficina(DB);

  // aula.belongsTo(Oficina, { foreignKey: "of_id", as: "oficina" });

  return aula;
}
