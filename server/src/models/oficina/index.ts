import { Sequelize, DataTypes, ModelStatic } from "sequelize";
import { IOficina } from "./types";
// import { criarModelAula } from "../aula";
// import { criarModelMatricula } from "../matricula";
// import { criarModelOficinaTutor } from "../oficina_tutor";

export function criarModelOficina(DB: Sequelize): ModelStatic<IOficina> {
  const oficina = DB.define<IOficina>(
    "oficina",
    {
      of_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      of_nome: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      of_descricao: {
        type: DataTypes.STRING,
      },
      of_data_inicio: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      of_data_fim: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      of_carga_horaria: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      of_percentual_minimo_presenca: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      of_professor_responsavel: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "oficina",
    },
  );

  // const Aula = criarModelAula(DB);
  // const Matricula = criarModelMatricula(DB);
  // const OficinaTutor = criarModelOficinaTutor(DB);

  // oficina.hasMany(Aula, {foreignKey: "of_id", as: "aulas"})
  // oficina.hasMany(Matricula, {foreignKey: "of_id", as: "matriculas"})
  // oficina.hasMany(OficinaTutor, {foreignKey: "of_id", as: "tutores"})

  return oficina;
}
