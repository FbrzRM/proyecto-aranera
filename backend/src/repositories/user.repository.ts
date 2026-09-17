import bcrypt from "bcryptjs";
import { User } from "../domain/user";

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
}

class InMemoryUserRepository implements UserRepository {
  private readonly users: User[];

  constructor() {
    this.users = [
      {
        id: "1",
        email: "admin@araneda.cl",
        nombre: "Administrador Araneda",
        role: "administrador",
        passwordHash: bcrypt.hashSync("Admin123", 10)
      }
    ];
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) ?? null;
  }
}

export const userRepository: UserRepository = new InMemoryUserRepository();
