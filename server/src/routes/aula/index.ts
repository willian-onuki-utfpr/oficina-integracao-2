import express from "express";
import { authMiddleware } from "../../middlewares/auth";
import controller from "../../controllers/aula";

const aulaRouter = express.Router();

aulaRouter.post("/", authMiddleware, controller.create);
aulaRouter.get("/oficina/:of_id", authMiddleware, controller.findByOficina);
aulaRouter.put("/:a_id", authMiddleware, controller.update);
aulaRouter.delete("/:a_id", authMiddleware, controller.destroy);

export { aulaRouter };