import express from "express";
import { authMiddleware } from "../../middlewares/auth";
import controller from "../../controllers/oficina";

const oficinaRouter = express.Router();

oficinaRouter.post("/", authMiddleware, controller.create);
oficinaRouter.get("/", authMiddleware, controller.findAll);
oficinaRouter.get("/relatorio", authMiddleware, controller.findAllRelatorio);
oficinaRouter.get("/professor/:of_professor_responsavel", authMiddleware, controller.findByProfessorCriador);
oficinaRouter.put("/:of_id", authMiddleware, controller.update);
oficinaRouter.delete("/:of_id", authMiddleware, controller.destroy);

export { oficinaRouter };
