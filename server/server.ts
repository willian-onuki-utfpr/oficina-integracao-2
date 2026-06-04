import sequelize from "./src/config/database";
import express from "express";
import "./src/models";
import cors from "cors";
import * as routes from "./src/routes";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/usuario", routes.usuarioRouter);
app.use("/tema", routes.temaRouter);

const PORT = process.env.PORT || 3000;

async function server() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    console.log("Banco conectado!");

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error("Erro ao conectar banco:", error);
  }
}

server();
