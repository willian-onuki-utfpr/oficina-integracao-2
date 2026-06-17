import express from "express";
import { authMiddleware } from "../../middlewares/auth";
import controller from "../../controllers/presenca";

const presencaRouter = express.Router();

presencaRouter.post("/", authMiddleware, controller.create);
presencaRouter.put("/", authMiddleware, controller.update);
presencaRouter.get("/aula/:a_id", authMiddleware, controller.findByAula);
presencaRouter.get("/aluno/:of_id/:usu_id", authMiddleware, controller.findByAluno);

export { presencaRouter };
