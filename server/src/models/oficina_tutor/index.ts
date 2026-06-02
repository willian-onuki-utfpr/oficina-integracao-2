import { Sequelize, DataTypes, ModelStatic } from "sequelize";
import { IOficinaTutor } from "./types";
// import { criarModelUsuario } from "../usuario";
// import { criarModelOficina } from "../oficina";

export function criarModelOficinaTutor(
  DB: Sequelize,
): ModelStatic<IOficinaTutor> {
  const oficinaTutor = DB.define<IOficinaTutor>(
    "oficina_tutor",
    {
      of_id: {
        type: DataTypes.INTEGER,
      },
      usu_id: {
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: "oficina_tutor",
      timestamps: false
    },
  );


  // const Usuario = criarModelUsuario(DB);
  // const Oficina = criarModelOficina(DB);

  // oficinaTutor.belongsTo(Usuario, { foreignKey: "usu_id", as: "usuario" });
  // oficinaTutor.belongsTo(Oficina, { foreignKey: "of_id", as: "oficina" });

  return oficinaTutor;
}
