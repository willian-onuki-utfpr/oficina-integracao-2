import { Router } from "express";
import controller from "../../controllers/matricula";
import { authMiddleware } from "../../middlewares/auth";

const matriculaRouter = Router();

matriculaRouter.post("/", authMiddleware, controller.create);

matriculaRouter.put("/:usu_id/:of_id/cancelar", authMiddleware, controller.cancel);

matriculaRouter.get("/aluno/:usu_id", authMiddleware, controller.findByAluno);

matriculaRouter.get(
  "/aluno/:usu_id/disponiveis",
  authMiddleware,
  controller.findOficinasDisponiveis,
);

export { matriculaRouter };
