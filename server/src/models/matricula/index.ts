import { Sequelize, DataTypes, ModelStatic } from "sequelize";
import { IMatricula } from "./types";
// import { criarModelUsuario } from "../usuario";
// import { criarModelOficina } from "../oficina";
// import { criarModelCertificado } from "../certificado";

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
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "matricula",
      timestamps: false,
    },
  );

  // const Usuario = criarModelUsuario(DB);
  // const Oficina = criarModelOficina(DB);
  // const Certificado = criarModelCertificado(DB);

  // matricula.belongsTo(Usuario, { foreignKey: "usu_id", as: "usuario" });
  // matricula.belongsTo(Oficina, { foreignKey: "of_id", as: "oficina" });
  // matricula.hasOne(Certificado, { foreignKey: "m_id", as: "certificado" });

  return matricula;
}
