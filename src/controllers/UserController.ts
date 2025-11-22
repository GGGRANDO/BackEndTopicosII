import { Request, Response } from "express";
import { AppDataSource } from "../config/datasource";
import { User } from "../entities/User";
import bcrypt from "bcryptjs";

const repo = () => AppDataSource.getRepository(User);

export class UserController {
  static async getAll(req: Request, res: Response) {
    try {
      const users = await repo().find({ order: { login: "ASC" }});
      const sanitized = users.map(u => ({ id: u.id, login: u.login, name: u.name ?? null, email: u.email ?? null }));
      res.status(200).json(sanitized);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao listar usuários" });
    }
  }

  static async create(req: Request, res: Response) {
    const { login, password, name, email } = req.body;

    if (!login || !password) {
      return res.status(400).json({ message: "Login e password são obrigatórios" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const createdUser = repo().create({ login, password: hashedPassword, name: name ?? null, email: email ?? null });
      await repo().save(createdUser);
      res.status(201).json({ id: createdUser.id, login: createdUser.login, name: createdUser.name ?? null, email: createdUser.email ?? null, message: "Usuário criado com sucesso" });
    } catch (error: any) {
      console.error(error);
      const msg = error?.code === '23505' ? 'Login ou email já existe' : 'Erro ao criar usuário';
      res.status(500).json({ message: msg });
    }
  }

  static async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { login, password, name, email } = req.body;

    try {
      const user = await repo().findOneBy({ id });
      if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

      if (login) user.login = login;
      if (password) user.password = await bcrypt.hash(password, 10);
      if (name !== undefined) user.name = name;
      if (email !== undefined) user.email = email;

      await repo().save(user);
      res.status(200).json({ id: user.id, login: user.login, name: user.name ?? null, email: user.email ?? null, message: "Usuário atualizado com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao atualizar usuário" });
    }
  }

  static async delete(req: Request, res: Response) {
    const id = Number(req.params.id);

    try {
      const user = await repo().findOneBy({ id });
      if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

      await repo().delete(id);
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao deletar usuário" });
    }
  }

  static async getById(req: Request, res: Response) {
    const id = Number(req.params.id);

    try {
      const user = await repo().findOneBy({ id });
      if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

      res.status(200).json({ id: user.id, login: user.login, name: user.name ?? null, email: user.email ?? null });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao buscar usuário" });
    }
  }
}
