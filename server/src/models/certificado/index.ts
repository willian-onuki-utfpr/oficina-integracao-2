import { Sequelize, DataTypes, ModelStatic } from "sequelize";
import { ICertificado } from "./types";
// import { criarModelMatricula } from "../matricula";

export function criarModelCertificado(
  DB: Sequelize,
): ModelStatic<ICertificado> {
  const certificado = DB.define<ICertificado>(
    "certificado",
    {
      c_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      m_id: {
        type: DataTypes.INTEGER,
      },
      c_data_emissao: {
        type: DataTypes.DATEONLY,
      },
      c_carga_horaria: {
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: "certificado",
      timestamps: false,
    },
  );

  // const Matricula = criarModelMatricula(DB);

  // certificado.belongsTo(Matricula, { foreignKey: "m_id", as: "matricula" });

  return certificado;
}
