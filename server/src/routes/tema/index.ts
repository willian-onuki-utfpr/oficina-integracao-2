import express from "express";
import { authMiddleware } from "../../middlewares/auth";
import controller from "../../controllers/tema";

const temaRouter = express.Router();

temaRouter.post("/", authMiddleware, controller.create);
temaRouter.put("/:t_id", authMiddleware, controller.update);
temaRouter.get("/", authMiddleware, controller.findAll);
temaRouter.delete("/:t_id", authMiddleware, controller.destroy);

export { temaRouter };
