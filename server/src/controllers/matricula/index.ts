import { Request, Response } from "express";
import sequelize from "../../config/database";
import {
  Aula,
  ConfiguracaoOficina,
  Matricula,
  Oficina,
  OficinaTutor,
  Tema,
  Usuario,
} from "../../models";
// import { StatusMatricula } from "../../models/matricula/status";
import { InferAttributes, Op } from "sequelize";
import { IMatricula } from "../../models/matricula/types";

const create = async (
  req: Request<
    {},
    {},
    {
      matricula: Partial<InferAttributes<IMatricula>>;
    }
  >,
  res: Response,
) => {
  const { matricula } = req.body;
  const { usu_id, of_id } = matricula;

  const transaction = await sequelize.transaction();

  try {
    const usuario = await Usuario.findByPk(usu_id, {
      transaction,
    });

    if (!usuario) return res.status(404).send("Usuário não encontrado");

    const oficina = await Oficina.findByPk(of_id, {
      transaction,
    });

    if (!oficina) return res.status(404).send("Oficina não encontrada");

    const matriculaExistente = await Matricula.findOne({
      where: {
        usu_id,
        of_id,
      },
      transaction,
    });

    if (matriculaExistente) return res.status(422).send("Aluno já matriculado");

    const matricula = await Matricula.create(
      {
        usu_id,
        of_id,
        m_status: "matriculado",
      },
      {
        transaction,
      },
    );

    await transaction.commit();

    res.status(201).json(matricula);
  } catch (error) {
    await transaction.rollback();

    console.log(error);

    res.status(500).json({
      message: "Erro ao realizar matrícula.",
    });
  }
};

const cancel = async (
  req: Request<{ of_id: string; usu_id: string }>,
  res: Response,
) => {
  const usu_id = Number(req.params.usu_id);
  const of_id = Number(req.params.of_id);

  const transaction = await sequelize.transaction();

  try {
    const matricula = await Matricula.findOne({
      where: {
        usu_id,
        of_id,
      },
      transaction,
    });

    if (!matricula) return res.status(404).send("Matrícula não encontrada");

    await Matricula.destroy({
      where: {
        usu_id,
        of_id,
      },
      transaction,
    });

    await transaction.commit();

    res.status(200).send();
  } catch (error) {
    await transaction.rollback();

    console.log(error);

    res.status(500).json({
      message: "Erro ao cancelar matrícula.",
    });
  }
};

const findByAluno = async (req: Request<{ usu_id: string }>, res: Response) => {
  const usu_id = Number(req.params.usu_id);

  try {
    const matriculas = await Matricula.findAll({
      where: {
        usu_id,
        m_status: "matriculado",
      },
    });

    const oficinas = await Oficina.findAll({
      where: {
        of_id: {
          [Op.in]: matriculas.map((m) => m.of_id),
        },
      },
      include: [
        {
          model: Aula,
          as: "aulas",
        },
        {
          model: OficinaTutor,
          as: "tutores",
          include: [
            {
              model: Usuario,
              as: "usuario",
            },
          ],
        },
        {
          model: ConfiguracaoOficina,
          as: "configuracoes",
        },
        {
          model: Tema,
          as: "tema",
        },
      ],
    });

    res.status(200).json(oficinas);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Erro ao buscar matrículas.",
    });
  }
};
const findOficinasDisponiveis = async (
  req: Request<{ usu_id: string }>,
  res: Response,
) => {
  const usu_id = Number(req.params.usu_id);

  try {
    const matriculas = await Matricula.findAll({
      where: {
        usu_id,
        m_status: "matriculado",
      },
      attributes: ["of_id"],
    });

    const oficinasIds = matriculas.map((matricula) => matricula.of_id);

    const oficinas = await Oficina.findAll({
      where: {
        of_id: {
          [Op.notIn]: oficinasIds.length ? oficinasIds : [0],
        },
      },
      include: [
        {
          model: Aula,
          as: "aulas",
        },
        {
          model: OficinaTutor,
          as: "tutores",
          include: [
            {
              model: Usuario,
              as: "usuario",
            },
          ],
        },
        {
          model: ConfiguracaoOficina,
          as: "configuracoes",
        },
        {
          model: Tema,
          as: "tema",
        },
      ],
    });

    res.status(200).json(oficinas);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Erro ao buscar oficinas disponíveis.",
    });
  }
};

export default {
  create,
  cancel,
  findByAluno,
  findOficinasDisponiveis,
};
