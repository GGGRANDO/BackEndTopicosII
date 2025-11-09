import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const ROUNDS = 12;
export const hashPassword = (p: string) => bcrypt.hash(p, ROUNDS);
export const comparePassword = (p: string, h: string) => bcrypt.compare(p, h);

export const signAccess = (payload: object) =>
  jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "15m" });

export const signRefresh = (payload: object) =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });
