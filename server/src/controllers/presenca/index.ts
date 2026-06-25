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
    await Aula.update(
      { a_realizada: true },
      {
        where: {
          a_id: presencas[0].a_id,
        },
      },
    );
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

const alterarQuantidadeFaltas = async (
  req: Request<
    {},
    {},
    {
      of_id: number;
      usu_id: number;
      quantidade: number;
    }
  >,
  res: Response,
) => {
  const { of_id, usu_id, quantidade } = req.body;

  const transaction = await sequelize.transaction();

  try {
    if (quantidade < 0) {
      await transaction.rollback();

      return res.status(400).json({
        errorMessage:
          "A quantidade de faltas deve ser maior ou igual a zero.",
      });
    }

    const aulas = await Aula.findAll({
      where: {
        of_id,
      },
      attributes: ["a_id"],
      transaction,
    });

    if (!aulas.length) {
      await transaction.rollback();

      return res.status(404).json({
        errorMessage:
          "Nenhuma aula encontrada para esta oficina.",
      });
    }

    const aulasIds = aulas.map((aula) => aula.a_id);

    if (quantidade > aulasIds.length) {
      await transaction.rollback();

      return res.status(400).json({
        errorMessage:
          "A quantidade de faltas não pode ser maior que a quantidade de aulas da oficina.",
      });
    }

    const faltasAtuais = await Presenca.count({
      where: {
        usu_id,
        a_id: {
          [Op.in]: aulasIds,
        },
        p_presenca: false,
      },
      transaction,
    });

    if (quantidade === faltasAtuais) {
      await transaction.commit();

      return res.status(200).json({
        message:
          "A quantidade de faltas já está atualizada.",
      });
    }

    const diferenca = quantidade - faltasAtuais;

    /**
     * Remover faltas
     *
     * Ex:
     * Atual = 5
     * Desejado = 3
     * Diferença = -2
     */
    if (diferenca < 0) {
      const faltasRemover = Math.abs(diferenca);

      const faltas = await Presenca.findAll({
        where: {
          usu_id,
          a_id: {
            [Op.in]: aulasIds,
          },
          p_presenca: false,
        },
        order: [["p_data_registro", "DESC"]],
        limit: faltasRemover,
        transaction,
      });

      await Presenca.update(
        {
          p_presenca: true,
        },
        {
          where: {
            p_id: {
              [Op.in]: faltas.map(
                (falta) => falta.p_id,
              ),
            },
          },
          transaction,
        },
      );
    }

    /**
     * Adicionar faltas
     *
     * Ex:
     * Atual = 5
     * Desejado = 8
     * Diferença = 3
     */
    if (diferenca > 0) {
      const presencas = await Presenca.findAll({
        where: {
          usu_id,
          a_id: {
            [Op.in]: aulasIds,
          },
          p_presenca: true,
        },
        order: [["p_data_registro", "DESC"]],
        limit: diferenca,
        transaction,
      });

      if (presencas.length < diferenca) {
        await transaction.rollback();

        return res.status(400).json({
          errorMessage:
            "Não existem presenças suficientes para atingir a quantidade de faltas informada.",
        });
      }

      await Presenca.update(
        {
          p_presenca: false,
        },
        {
          where: {
            p_id: {
              [Op.in]: presencas.map(
                (presenca) => presenca.p_id,
              ),
            },
          },
          transaction,
        },
      );
    }

    const faltasAtualizadas = await Presenca.count({
      where: {
        usu_id,
        a_id: {
          [Op.in]: aulasIds,
        },
        p_presenca: false,
      },
      transaction,
    });

    await transaction.commit();

    return res.status(200).json({
      message:
        "Quantidade de faltas atualizada com sucesso.",
      faltasAntes: faltasAtuais,
      faltasDepois: faltasAtualizadas,
    });
  } catch (error) {
    await transaction.rollback();

    console.log(error);

    return res.status(500).json({
      errorMessage:
        "Não foi possível atualizar a quantidade de faltas.",
    });
  }
};

const faltasAluno = async (req: Request<{ usu_id: string; of_id: string }>, res: Response) => {
  const usu_id = Number(req.params.usu_id);
  const of_id = Number(req.params.of_id);
  try {

    const aulas = await Aula.findAll({
      where: { of_id },
      attributes: ["a_id"],
    });

    const aulasIds = aulas.map((aula) => aula.a_id);

    const faltas = await Presenca.count({
      where: {
          usu_id,
          a_id: aulasIds,
          p_presenca: false,
      },
    });

    res.status(200).json(faltas);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      errorMessage: "Não foi buscar as faltas do aluno.",
    });
  }
};

export default {
  create,
  update,
  findByAula,
  findByAluno,
  faltasAluno,
  alterarQuantidadeFaltas
};
