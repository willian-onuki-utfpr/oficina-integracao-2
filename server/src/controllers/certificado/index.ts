import { Request, Response } from "express";
import { Aula, Certificado, Matricula, Oficina, Presenca, Usuario } from "../../models";
import sequelize from "../../config/database";
import { Transaction } from "sequelize";

export const validarOficinaFinalizada = async (
  of_id: number,
  transaction: Transaction,
) => {
  const oficina = await Oficina.findByPk(of_id, { transaction });

  if (!oficina) {
    throw new Error("Oficina não encontrada.");
  }

  const aulas = await Aula.findAll({
    where: { of_id },
    transaction,
  });

  if (aulas.length === 0) {
    throw new Error("A oficina não possui aulas cadastradas.");
  }

  const possuiAulasPendentes = aulas.some((aula) => !aula.a_realizada);

  if (possuiAulasPendentes) {
    throw new Error("Ainda existem aulas pendentes de conclusão.");
  }

  return {
    oficina,
    aulas,
  };
};

export const alunoAprovado = async (
  usu_id: number,
  of_id: number,
  // transaction: Transaction,
) => {
  const oficina = await Oficina.findByPk(
    of_id,
    // , {transaction}
  );

  const aulas = await Aula.findAll({
    where: { of_id },
    attributes: ["a_id"],
    // transaction
  });

  const aulasIds = aulas.map((aula) => aula.a_id);

  const faltas = await Presenca.count({
    where: {
      usu_id,
      a_id: aulasIds,
      p_presenca: false,
    },
    // transaction
  });

  return {
    aprovado: faltas <= oficina!.of_limite_faltas,

    faltas,
  };
};

const gerarCertificadoPorAluno = async (
  req: Request<
    {},
    {},
    {
      of_id: number;
      usu_id: number;
    }
  >,
  res: Response,
) => {
  const { of_id, usu_id } = req.body;

  const transaction = await sequelize.transaction();

  try {
    const { oficina } = await validarOficinaFinalizada(of_id, transaction);

    const matricula = await Matricula.findOne({
      where: {
        of_id,
        usu_id,
      },
      transaction,
    });

    if (!matricula) {
      await transaction.rollback();

      return res.status(404).json({
        message: "Aluno não matriculado nesta oficina.",
      });
    }

    const certificadoExistente = await Certificado.findOne({
      where: {
        m_id: matricula.m_id,
      },
      transaction,
    });

    if (certificadoExistente) {
      await transaction.rollback();

      return res.status(200).json({
        message: "Certificado já foi gerado.",
        certificado: certificadoExistente,
      });
    }

    const { aprovado, faltas } = await alunoAprovado(
      usu_id,
      of_id,
      // , transaction
    );

    if (!aprovado) {
      await transaction.rollback();

      return res.status(400).json({
        message: "Aluno reprovado por frequência.",
        faltas,
      });
    }

    const certificado = await Certificado.create(
      {
        m_id: matricula.m_id,
        c_data_emissao: new Date(),
        c_carga_horaria: oficina.of_carga_horaria,
      },
      {
        transaction,
      },
    );

    await transaction.commit();

    return res.status(201).json({
      message: "Certificado gerado com sucesso.",
      certificado,
    });
  } catch (error: any) {
    await transaction.rollback();

    console.log(error);

    return res.status(500).json({
      message: error.message || "Erro ao gerar certificado.",
    });
  }
};

const gerarCertificadoAlunosAprovados = async (
  req: Request<
    {},
    {},
    {
      of_id: number;
    }
  >,
  res: Response,
) => {
  const { of_id } = req.body;

  const transaction = await sequelize.transaction();

  try {
    const { oficina } = await validarOficinaFinalizada(of_id, transaction);

    const matriculas = await Matricula.findAll({
      where: {
        of_id,
      },
      transaction,
    });

    let certificadosGerados = 0;
    let certificadosExistentes = 0;
    let alunosReprovados = 0;

    for (const matricula of matriculas) {
      const certificadoExistente = await Certificado.findOne({
        where: {
          m_id: matricula.m_id,
        },
        transaction,
      });

      if (certificadoExistente) {
        certificadosExistentes++;
        continue;
      }

      const { aprovado } = await alunoAprovado(
        matricula.usu_id,
        of_id,
        // , transaction
      );

      if (!aprovado) {
        alunosReprovados++;
        continue;
      }

      await Certificado.create(
        {
          m_id: matricula.m_id,
          c_data_emissao: new Date(),
          c_carga_horaria: oficina.of_carga_horaria,
        },
        {
          transaction,
        },
      );

      certificadosGerados++;
    }

    await transaction.commit();

    return res.status(201).json({
      message: "Processamento concluído.",

      resumo: {
        certificadosGerados,
        certificadosExistentes,
        alunosReprovados,
      },
    });
  } catch (error: any) {
    await transaction.rollback();

    console.log(error);

    return res.status(500).json({
      message: error.message || "Erro ao gerar certificados.",
    });
  }
};

const find = async (
  req: Request<{ of_id: string; usu_id: string }>,
  res: Response,
) => {
  const of_id = Number(req.params.of_id);
  const usu_id = Number(req.params.usu_id);
  try {
    const matricula = await Matricula.findOne({
      where: {
        of_id,
        usu_id,
      },
      include: [{
        model: Usuario,
        as: "aluno"
      }]
    });

    if (!matricula) {
      return res.status(404).json({
        message: "Aluno não matriculado nesta oficina.",
      });
    }

    const certificado = await Certificado.findOne({
      where: {
        m_id: matricula.m_id
      },
    })

    return res.status(200).json({
      certificado,
      aluno: matricula.aluno
    })
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao detalhar o certificado.",
    });
  }
};

export default {
  gerarCertificadoPorAluno,
  gerarCertificadoAlunosAprovados,
  find
};
