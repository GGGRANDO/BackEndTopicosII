import "reflect-metadata";
import { AppDataSource } from "../config/datasource";
import { User } from "../entities/User";
import bcrypt from "bcryptjs";

async function seed() {
  try {
    await AppDataSource.initialize();
    const repo = AppDataSource.getRepository(User);

    const login = process.env.SEED_USER_LOGIN || "admin";
    const password = process.env.SEED_USER_PASSWORD || "admin123";
    const name = process.env.SEED_USER_NAME || "Admin";
    const email = process.env.SEED_USER_EMAIL || "admin@example.com";

    const existing = await repo.findOneBy({ login });
    if (existing) {
      console.log(`User ${login} already exists`);
      process.exit(0);
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = repo.create({ login, password: hashed, name, email });
    await repo.save(user);

    console.log(`Created user '${login}' with password '${password}'`);
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();
