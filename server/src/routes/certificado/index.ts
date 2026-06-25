import express from "express";
import { authMiddleware } from "../../middlewares/auth";
import controller from "../../controllers/certificado";

const certificadoRouter = express.Router();

certificadoRouter.post("/aluno", authMiddleware, controller.gerarCertificadoPorAluno);
certificadoRouter.post("/alunos-aprovados", authMiddleware, controller.gerarCertificadoAlunosAprovados);
certificadoRouter.get("/detalhes/:of_id/:usu_id", authMiddleware, controller.find);

export { certificadoRouter };