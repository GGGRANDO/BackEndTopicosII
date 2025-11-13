import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload;
}

class Authentication {
  hasAuthentication(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({
          auth: false,
          message: "Token não fornecido.",
        });
      }

      const [scheme, token] = authHeader.split(" ");

      if (scheme !== "Bearer" || !token) {
        return res.status(401).json({
          auth: false,
          message: "Formato de token inválido. Use: Bearer <token>",
        });
      }

      if (!process.env.TOKEN_KEY) {
        console.error("❌ TOKEN_KEY não definida no .env");
        return res.status(500).json({
          auth: false,
          message: "Erro interno de configuração do servidor.",
        });
      }

      const decoded = jwt.verify(token, process.env.TOKEN_KEY);

      req.user = decoded;

      return next();
    } catch (error: any) {
      return res.status(401).json({
        auth: false,
        message: "Token inválido ou expirado.",
        error: error.message,
      });
    }
  }
}

export default new Authentication();
