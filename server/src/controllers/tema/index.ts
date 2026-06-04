import { Request, Response } from "express";
import { InferAttributes } from "sequelize";
import { ITema } from "../../models/tema/types";
import { Tema } from "../../models";
import sequelize from "../../config/database";

const create = async (
  req: Request<{}, {}, { t_nome: string }>,
  res: Response,
) => {
  const { t_nome } = req.body;
  const transaction = await sequelize.transaction();
  try {
    const temaExistente = await Tema.findOne({
      where: {
        t_nome,
      },
      transaction,
    });

    if (!!temaExistente) return res.status(422).send();

    const temaCriado = await Tema.create({ t_nome }, { transaction });

    await transaction.commit();
    res.status(200).json(temaCriado);
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    res.status(500).json({
      message: "Ocorreu um erro ao criar o tema.",
    });
  }
};

const update = async (
  req: Request<{ t_id: string }, {}, { t_nome: string }>,
  res: Response,
) => {
  const t_id = Number(req.params.t_id);
  const { t_nome } = req.body;
  const transaction = await sequelize.transaction();
  try {
    const temaExistente = await Tema.findOne({
      where: {
        t_id,
      },
      transaction,
    });

    if (!temaExistente) return res.status(404).send("Tema não encontrado");


    const temaComNomeIgual = await Tema.findOne({
      where: {
        t_nome,
      },
      transaction,
    });

    if (!!temaComNomeIgual) return res.status(422).send();

    await Tema.update({ t_nome }, { where: { t_id }, transaction });

    await transaction.commit();
    res.status(200).send();
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    res.status(500).json({
      message: "Ocorreu um erro ao atualizar o tema.",
    });
  }
};

const findAll = async (req: Request, res: Response) => {
  try {
    const temas = await Tema.findAll();

    res.status(200).json(temas);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Ocorreu um erro ao buscar os temas.",
    });
  }
};

const destroy = async (
  req: Request<{ t_id: string }, {}, {}>,
  res: Response,
) => {
  const t_id = Number(req.params.t_id);
  const transaction = await sequelize.transaction();
  try {
    const temaExistente = await Tema.findOne({
      where: {
        t_id,
      },
      transaction,
    });

    if (!temaExistente) return res.status(404).send("Tema não encontrado");

    await Tema.destroy({ where: { t_id }, transaction });

    await transaction.commit();
    res.status(200).send();
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    res.status(500).json({
      message: "Ocorreu um erro ao excluir o tema.",
    });
  }
};
export default {
  create,
  update,
  findAll,
  destroy
};
