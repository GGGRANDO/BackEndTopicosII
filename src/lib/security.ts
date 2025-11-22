import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const ROUNDS = 12;
export const hashPassword = (p: string) => bcrypt.hash(p, ROUNDS);
export const comparePassword = (p: string, h: string) => bcrypt.compare(p, h);

const ACCESS_SECRET = process.env.JWT_SECRET || process.env.TOKEN_KEY;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || process.env.TOKEN_REFRESH_KEY || process.env.TOKEN_KEY;

export const signAccess = (payload: object) =>
  jwt.sign(payload, ACCESS_SECRET as string, { expiresIn: "15m" });

export const signRefresh = (payload: object) =>
  jwt.sign(payload, REFRESH_SECRET as string, { expiresIn: "7d" });
