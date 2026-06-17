import { Request, Response } from "express";
import { InferAttributes, Op } from "sequelize";
import { IPresenca } from "../../models/presenca/types";
import { Aula, Presenca, Usuario } from "../../models";
import sequelize from "../../config/database";

const create = async (
  req: Request<{}, {}, { presencas: Partial<InferAttributes<IPresenca>>[] }>,
  res: Response,
) => {
  const { presencas } = req.body;
  try {
    await Presenca.bulkCreate(presencas);

    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      errorMessage: "Não foi possível criar as presenças da aula.",
    });
  }
};

const update = async (
  req: Request<{}, {}, { presencas: Partial<InferAttributes<IPresenca>>[] }>,
  res: Response,
) => {
  const { presencas } = req.body;
  const transaction = await sequelize.transaction();
  try {
    for (const p of presencas) {
      await Presenca.update(
        { p_presenca: p.p_presenca },
        {
          where: {
            p_id: p.p_id,
          },
          transaction,
        },
      );
    }

    await transaction.commit();
    res.status(200).send();
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    res.status(500).json({
      errorMessage: "Não foi possível editar as presenças da aula.",
    });
  }
};

const findByAula = async (req: Request<{ a_id: string }>, res: Response) => {
  const a_id = Number(req.params.a_id);
  try {
    const presencas = await Presenca.findAll({
      where: {
        a_id,
      },
      include: [
        {
          model: Usuario,
          as: "aluno",
        },
      ],
    });

    res.status(200).json(presencas);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      errorMessage: "Não foi buscar as presenças da aula.",
    });
  }
};

const findByAluno = async (
  req: Request<{ of_id: string; usu_id: string }>,
  res: Response,
) => {
  const of_id = Number(req.params.of_id);
  const usu_id = Number(req.params.usu_id);

  const transaction = await sequelize.transaction();
  try {
    const aulas = await Aula.findAll({
      where: {
        of_id,
      },
      transaction,
    });

    const presencas = await Presenca.findAll({
      where: {
        a_id: aulas.map((a) => a.a_id),
        usu_id,
        p_presenca: {
          [Op.not]: null,
        },
      },
      transaction,
    });

    await transaction.commit();
    res.status(200).json(presencas);
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    res.status(500).json({
      errorMessage: "Não foi buscar as presenças do aluno.",
    });
  }
};

export default {
  create,
  update,
  findByAula,
  findByAluno
};
