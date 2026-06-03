import express from "express";
import controller from "../../controllers/usuario";

const usuarioRouter = express.Router();

usuarioRouter.post("/", controller.create);
usuarioRouter.get("/", controller.findAll);
usuarioRouter.put("/:usu_id", controller.update);
usuarioRouter.delete("/:usu_id", controller.update);

export { usuarioRouter };