import { Request, Response } from "express";
import { InferAttributes } from "sequelize";
import { IOficina } from "../../models/oficina/types";
import {
  Aula,
  ConfiguracaoOficina,
  Matricula,
  Oficina,
  OficinaTutor,
  Tema,
  Usuario,
} from "../../models";
import { IOficinaTutor } from "../../models/oficina_tutor/types";
import sequelize from "../../config/database";

const create = async (
  req: Request<{}, {}, { oficina: Partial<InferAttributes<IOficina>> }>,
  res: Response,
) => {
  const { oficina } = req.body;
  try {
    await Oficina.create(oficina, {
      include: [
        {
          model: Aula,
          as: "aulas",
        },
        {
          model: OficinaTutor,
          as: "tutores",
        },
        {
          model: ConfiguracaoOficina,
          as: "configuracoes",
        },
      ],
    });

    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Não foi possível criar a oficina.",
    });
  }
};

const findAll = async (req: Request, res: Response) => {
  try {
    const oficinas = await Oficina.findAll({
      include: [
        {
          model: Aula,
          as: "aulas",
        },
        {
          model: OficinaTutor,
          as: "tutores",
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
      message: "Não foi possível buscar as oficinas.",
    });
  }
};

const update = async (
  req: Request<
    { of_id: string },
    {},
    {
      oficina: Partial<InferAttributes<IOficina>>;
      tutoresParaAdicionar: Partial<InferAttributes<IOficinaTutor>>[];
      tutoresParaExcluir: Partial<InferAttributes<IOficinaTutor>>[];
    }
  >,
  res: Response,
) => {
  const of_id = Number(req.params.of_id);
  const { oficina, tutoresParaAdicionar, tutoresParaExcluir } = req.body;
  const transaction = await sequelize.transaction();
  try {
    await Oficina.update(
      { ...oficina },
      {
        where: {
          of_id,
        },
        transaction,
      },
    );

    if (!!tutoresParaAdicionar.length)
      await OficinaTutor.bulkCreate(tutoresParaAdicionar, { transaction });

    if (!!tutoresParaExcluir.length)
      await OficinaTutor.destroy({
        where: { usu_id: tutoresParaExcluir.map((ot) => ot.usu_id) },
        transaction,
      });

    await transaction.commit();
    res.status(200).send();
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    res.status(500).json({
      message: "Não foi possível editar a oficina.",
    });
  }
};

const destroy = async (
  req: Request<{ of_id: string }, {}, {}>,
  res: Response,
) => {
  const of_id = Number(req.params.of_id);
  const transaction = await sequelize.transaction();
  try {
    await Aula.destroy({
      where: {
        of_id,
      },
      transaction,
    });

    await Matricula.destroy({
      where: {
        of_id,
      },
      transaction,
    });

    await Oficina.destroy({
      where: {
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
      message: "Não foi possível excluir a oficina.",
    });
  }
};

const findByProfessorCriador = async (
  req: Request<{ of_professor_responsavel: string }>,
  res: Response,
) => {
  const of_professor_responsavel = Number(req.params.of_professor_responsavel);
  const transaction = await sequelize.transaction();

  try {
    const usuario = await Usuario.findByPk(of_professor_responsavel, {
      transaction,
    });

    if (usuario?.usu_tipo !== "professor")
      throw Error("Usuário não permitido.");

    const oficinas = await Oficina.findAll({
      where: {
        of_professor_responsavel,
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
        {
          model: Matricula,
          as: "matriculas",
          include: [
            {
              model: Usuario,
              as: "aluno",
            },
          ],
        },
      ],
      transaction,
    });

    await transaction.commit();
    res.status(200).json(oficinas);
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    res.status(500).json({
      message:
        "Não foi possível buscar as oficinas criadas pelo professor responsável.",
    });
  }
};

export default {
  create,
  findAll,
  update,
  destroy,
  findByProfessorCriador,
};
