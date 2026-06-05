import express from "express";
import controller from "../../controllers/usuario";
import { authMiddleware } from "../../middlewares/auth";

const usuarioRouter = express.Router();

usuarioRouter.post("/", authMiddleware, controller.create);
usuarioRouter.get("/professor", authMiddleware, controller.findAllProfessores);
usuarioRouter.get("/", authMiddleware, controller.findAll);
usuarioRouter.put("/:usu_id", authMiddleware, controller.update);
usuarioRouter.delete("/:usu_id", authMiddleware, controller.destroy);

usuarioRouter.post("/login", controller.login);

export { usuarioRouter };
