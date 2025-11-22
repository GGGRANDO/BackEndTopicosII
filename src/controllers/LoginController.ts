import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { AppDataSource } from "../config/datasource";
import { User } from "../entities/User";
import bcrypt from "bcryptjs";

dotenv.config();

export class LoginController {
  doLogin = async (req: Request, res: Response) => {
    try {
      const { login, password } = req.body;

      if (!login || !password) {
        return res.status(400).json({ message: "Login e password são obrigatórios" });
      }

      const repo = AppDataSource.getRepository(User);
      const foundUser = await repo.findOneBy({ login });

      if (!foundUser) {
        return res.status(401).json({ message: "Usuário não encontrado" });
      }

      const storedPassword = foundUser.password;
      const isValidPassword = storedPassword.startsWith("$2b$")
        ? await bcrypt.compare(password, storedPassword)
        : password === storedPassword;

      if (!isValidPassword) {
        return res.status(401).json({ message: "Senha inválida" });
      }

      const token = jwt.sign(
        { id: foundUser.id, login: foundUser.login },
        process.env.TOKEN_KEY as string,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        auth: true,
        token,
        type: "Bearer",
        message: "Logou com sucesso"
      });

    } catch (error) {
      console.error("Erro no login:", error);
      return res.status(500).json({ message: "Erro interno no servidor" });
    }
  };
}
