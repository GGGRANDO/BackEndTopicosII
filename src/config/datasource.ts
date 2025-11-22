import { DataSource } from "typeorm"
import dotenv from "dotenv"
import { User } from "../entities/User";
import { Product } from "../entities/Product";
import { Order } from "../entities/Order";

dotenv.config()

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [User, Product,Order],
  migrations: ['src/migrations/*.ts'],
});