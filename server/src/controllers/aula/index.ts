import { Request, Response } from "express";
import { IAula } from "../../models/aula/types";
import { Aula } from "../../models";

const create = async (
  req: Request<{}, {}, { aula: Partial<IAula> }>,
  res: Response,
) => {
  const { aula } = req.body;
  try {
    const aulaCriada = await Aula.create(aula);

    res.status(200).json(aulaCriada);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Não foi possível criar a aula.",
    });
  }
};


const findByOficina = async (
  req: Request<{of_id: string}, {}, {}>,
  res: Response,
) => {
  const of_id = Number(req.params.of_id);
  try {
    const aulas = await Aula.findAll({
      where: {
        of_id
      }
    });

    res.status(200).json(aulas);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Não foi possível listar as aulas da oficina.",
    });
  }
};

const update = async (
  req: Request<{a_id: string}, {}, { aula: Partial<IAula> }>,
  res: Response,
) => {
  const a_id = Number(req.params.a_id)
  const { aula } = req.body;
  try {
    await Aula.update({...aula}, {
      where: {
        a_id
      }
    })

    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Não foi possível criar a aula.",
    });
  }
};

const destroy = async (
  req: Request<{a_id: string}, {}, {}>,
  res: Response,
) => {
  const a_id = Number(req.params.a_id)
  try {
    await Aula.destroy({ where: { a_id } });

    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Não foi possível excluir a aula.",
    });
  }
};

export default {
  create,
  findByOficina,
  update,
  destroy
}