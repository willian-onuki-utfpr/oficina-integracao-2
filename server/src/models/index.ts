import sequelize from "../config/database";

import { criarModelUsuario } from "./usuario";
import { criarModelMatricula } from "./matricula";
import { criarModelOficinaTutor } from "./oficina_tutor";
import { criarModelPresenca } from "./presenca";
import { criarModelCertificado } from "./certificado";
import { criarModelAula } from "./aula";
import { criarModelOficina } from "./oficina";
import { criarModelTema } from "./tema";
import { criarModelConfiguracaoOficina } from "./ConfiguracaoOficina";

export const Usuario = criarModelUsuario(sequelize);
export const Oficina = criarModelOficina(sequelize);
export const ConfiguracaoOficina = criarModelConfiguracaoOficina(sequelize);
export const Matricula = criarModelMatricula(sequelize);
export const Aula = criarModelAula(sequelize);
export const OficinaTutor = criarModelOficinaTutor(sequelize);
export const Presenca = criarModelPresenca(sequelize);
export const Certificado = criarModelCertificado(sequelize);
export const Tema = criarModelTema(sequelize);

  // Relacionamentos

  // Usuario
  Usuario.hasMany(Matricula, {foreignKey: "usu_id", as: "matriculas"})
  Usuario.hasMany(OficinaTutor, {foreignKey: "usu_id", as: "tutores"})
  Usuario.hasMany(Presenca, {foreignKey: "usu_id", as: "presencas"})

  // Tema
  Tema.hasMany(Oficina, {foreignKey: "t_id", as: "oficinas"})

  // Aula
  Aula.belongsTo(Oficina, { foreignKey: "of_id", as: "oficina" });
  Aula.hasMany(Presenca, {foreignKey: "a_id", as: "presencas"})


  // Certificado
  Certificado.belongsTo(Matricula, { foreignKey: "m_id", as: "matricula" });

  // Matricula
  Matricula.belongsTo(Usuario, { foreignKey: "usu_id", as: "aluno" });
  Matricula.belongsTo(Oficina, { foreignKey: "of_id", as: "oficina" });
  Matricula.hasOne(Certificado, { foreignKey: "m_id", as: "certificado" });

  // Oficina
  Oficina.hasMany(Aula, {foreignKey: "of_id", as: "aulas"})
  Oficina.hasMany(Matricula, {foreignKey: "of_id", as: "matriculas"})
  Oficina.hasMany(OficinaTutor, {foreignKey: "of_id", as: "tutores"})
  Oficina.hasMany(ConfiguracaoOficina, {foreignKey: "of_id", as: "configuracoes"})
  Oficina.belongsTo(Tema, {foreignKey: "t_id", as: "tema"})

  // Oficina tutor
  OficinaTutor.belongsTo(Usuario, { foreignKey: "usu_id", as: "usuario" });
  OficinaTutor.belongsTo(Oficina, { foreignKey: "of_id", as: "oficina" });

  // Configuração oficina
  ConfiguracaoOficina.belongsTo(Oficina, {foreignKey: "of_id", as: "oficina"})

  // Presença
  Presenca.belongsTo(Aula, {foreignKey: "a_id", as: "aula"})
  Presenca.belongsTo(Usuario, {foreignKey: "usu_id", as: "aluno"})