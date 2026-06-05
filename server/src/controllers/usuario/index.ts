import { Request, Response } from "express";
import { IUsuario } from "../../models/usuario/types";
import { InferAttributes } from "sequelize";
import sequelize from "../../config/database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authConfig from "../../config/auth";
import { Usuario } from "../../models";

const create = async (
  req: Request<{}, {}, { usuario: Partial<InferAttributes<IUsuario>> }>,
  res: Response,
) => {
  const { usuario } = req.body;
  const transaction = await sequelize.transaction();

  try {
    const usuarioExistente = await Usuario.findOne({
      where: {
        usu_email: usuario.usu_email,
      },
      transaction,
    });

    if (!!usuarioExistente) return res.status(422).send();

    const senha = await bcrypt.hash(usuario.usu_senha as string, 10);

    const novoUsuario = await Usuario.create(
      {
        ...usuario,
        usu_senha: senha,
      },
      { transaction },
    );

    await transaction.commit();
    res.status(200).json(novoUsuario);
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    res.status(500).json({ message: "Ocorreu um erro ao criar o usuário" });
  }
};

const update = async (
  req: Request<
    { usu_id: string },
    {},
    { usuario: Partial<InferAttributes<IUsuario>> }
  >,
  res: Response,
) => {
  const usu_id = Number(req.params.usu_id);
  const { usuario } = req.body;

  const transaction = await sequelize.transaction();

  try {
    const usuarioExistente = await Usuario.findOne({
      where: {
        usu_id,
      },
      transaction,
    });

    if (!usuarioExistente)
      return res.status(404).send("Usuário não encontrado");

    await Usuario.update(
      {
        ...usuario,
      },
      {
        where: {
          usu_id,
        },
        transaction,
      },
    );

    await transaction.commit();
    res.status(200).send();
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    res.status(500).json({ message: "Ocorreu um erro ao editar o usuário" });
  }
};

const findAll = async (req: Request, res: Response) => {

  try {
    const usuarios = await Usuario.findAll({
      attributes: ["usu_id", "usu_nome", "usu_email", "usu_tipo"],
    });

    res.status(200).json(usuarios);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Ocorreu um erro ao listar os usuários" });
  }
};

const destroy = async (
  req: Request<{ usu_id: string }, {}, {}>,
  res: Response,
) => {
  const usu_id = Number(req.params.usu_id);

  try {
    await Usuario.destroy({
      where: { usu_id },
    });

    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Ocorreu um erro ao excluir o usuário." });
  }
};

const login = async (
  req: Request<
    {},
    {},
    {
      usu_email: string;
      usu_senha: string;
    }
  >,
  res: Response,
) => {
  const { usu_email, usu_senha } = req.body;
  const transaction = await sequelize.transaction();

  try {
    const usuario = await Usuario.findOne({
      where: {
        usu_email,
      },
      transaction,
    });

    if (!usuario) throw Error;

    const senhaCorreta = await bcrypt.compare(usu_senha, usuario.usu_senha);

    if (!senhaCorreta) throw Error;

    const sessao = crypto.randomUUID();

    await Usuario.update(
      {
        usu_sessao: sessao,
      },
      {
        where: {
          usu_id: usuario.usu_id,
        },
        transaction,
      },
    );

    const token = jwt.sign(
      {
        id: usuario.usu_id,
        tipo: usuario.usu_tipo,
        usu_sessao: sessao,
      },
      authConfig.secret as string,
      {
        expiresIn: "1d",
      },
    );

    await transaction.commit();
    res.status(200).json({
      usuario: {
        id: usuario.usu_id,
        nome: usuario.usu_nome,
        email: usuario.usu_email,
        tipo: usuario.usu_tipo,
      },
      token,
    });
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    res.status(500).json({ message: "Ocorreu um erro ao realizar o login." });
  }
};

const findAllProfessores = async (req: Request, res: Response) => {

  try {
    const professores = await Usuario.findAll({
      where: {
        usu_tipo: "professor",
      },
      attributes: ["usu_id", "usu_nome", "usu_email", "usu_tipo"],
    });

    res.status(200).json(professores);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Ocorreu um erro ao listar os professores" });
  }
};

export default {
  create,
  update,
  findAll,
  destroy,
  login,
  findAllProfessores
};
