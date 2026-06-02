import sequelize from "./src/config/database";
import express from "express";
import "./src/models";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

const router = express.Router();
router.get("/", (req, res) => {
  return res.status(200).json( "Hello world!")
})

app.use(router);

const PORT = process.env.PORT || 3000;

async function server() {
  try {
    await sequelize.authenticate();
    console.log(Object.keys(sequelize.models));
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
