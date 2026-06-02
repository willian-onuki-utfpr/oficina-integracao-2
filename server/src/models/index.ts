import sequelize from "../config/database";

import { criarModelUsuario } from "./usuario";
import { criarModelMatricula } from "./matricula";
import { criarModelOficinaTutor } from "./oficina_tutor";
import { criarModelPresenca } from "./presenca";
import { criarModelCertificado } from "./certificado";
import { criarModelAula } from "./aula";
import { criarModelOficina } from "./oficina";

export const Usuario = criarModelUsuario(sequelize);
export const Oficina = criarModelOficina(sequelize);
export const Matricula = criarModelMatricula(sequelize);
export const Aula = criarModelAula(sequelize);
export const OficinaTutor = criarModelOficinaTutor(sequelize);
export const Presenca = criarModelPresenca(sequelize);
export const Certificado = criarModelCertificado(sequelize);

  // Relacionamentos

  // Usuario
  Usuario.hasMany(Matricula, {foreignKey: "usu_id", as: "matriculas"})
  Usuario.hasMany(OficinaTutor, {foreignKey: "usu_id", as: "tutores"})
  Usuario.hasMany(Presenca, {foreignKey: "usu_id", as: "presencas"})

  // Aula
  Aula.belongsTo(Oficina, { foreignKey: "of_id", as: "oficina" });

  // Certificado
  Certificado.belongsTo(Matricula, { foreignKey: "m_id", as: "matricula" });

  // Matricula
  Matricula.belongsTo(Usuario, { foreignKey: "usu_id", as: "usuario" });
  Matricula.belongsTo(Oficina, { foreignKey: "of_id", as: "oficina" });
  Matricula.hasOne(Certificado, { foreignKey: "m_id", as: "certificado" });

  // Oficina
  Oficina.hasMany(Aula, {foreignKey: "of_id", as: "aulas"})
  Oficina.hasMany(Matricula, {foreignKey: "of_id", as: "matriculas"})
  Oficina.hasMany(OficinaTutor, {foreignKey: "of_id", as: "tutores"})

  // Oficina tutor
  OficinaTutor.belongsTo(Usuario, { foreignKey: "usu_id", as: "usuario" });
  OficinaTutor.belongsTo(Oficina, { foreignKey: "of_id", as: "oficina" });

  // Presença
  Presenca.belongsTo(Aula, {foreignKey: "a_id", as: "aula"})