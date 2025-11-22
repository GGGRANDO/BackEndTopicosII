import express from "express";
import routes from "./routes/index";
import cors from "cors";
import dotenv from "dotenv";
import { LoginController } from "./controllers/LoginController";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const loginController = new LoginController();

app.post("/api/login", (req, res) => loginController.doLogin(req, res));

app.get("/healthcheck", (req, res) => res.status(200).send("API funcionando"));

app.use("/api/", routes);

export default app;
