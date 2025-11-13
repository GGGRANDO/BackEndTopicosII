import express from "express";
import routes from "./routes/index";
import cors from "cors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

import { AppDataSource } from "./config/datasource";
import { User } from "./entities/User";
import bcrypt from "bcryptjs";

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  const userRepository = AppDataSource.getRepository(User);

  const user = await userRepository.findOneBy({ email });

  if (!user) {
    return res.status(401).json({ auth: false, message: "Usuário não encontrado" });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(401).json({ auth: false, message: "Senha incorreta" });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.TOKEN_KEY as string,
    { expiresIn: "1h" }
  );

  return res.json({ auth: true, token });
});

app.get("/healthcheck", (req, res) => res.status(200).send("API funcionando"));

app.use("/api/v1", routes);

export default app;
