import { Sequelize, DataTypes, ModelStatic } from "sequelize";
import { IConfiguracaoOficina } from "./types";

export function criarModelConfiguracaoOficina(
  DB: Sequelize,
): ModelStatic<IConfiguracaoOficina> {
  const configuracaoOficina = DB.define<IConfiguracaoOficina>(
    "configuracao_oficina",
    {
      co_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      of_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      co_dia_semana: {
        type: DataTypes.STRING,
      },
      co_horario_inicio: {
        type: DataTypes.TIME,
      },
      co_horario_fim: {
        type: DataTypes.TIME,
      },
    },
    {
      tableName: "configuracao_oficina",
      timestamps: false,
    },
  );

  return configuracaoOficina;
}
