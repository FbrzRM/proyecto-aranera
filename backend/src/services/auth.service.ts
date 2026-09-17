import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { UserRepository, userRepository } from "../repositories/user.repository";
import { LoginInput } from "../schemas/auth.schema";

export class InvalidCredentialsError extends Error {
  constructor() {
    super("Credenciales inválidas");
    this.name = "InvalidCredentialsError";
  }
}

export class AuthService {
  constructor(private readonly users: UserRepository) {}

  async login(input: LoginInput) {
    const user = await this.users.findByEmail(input.email);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);
    if (!passwordMatches) {
      throw new InvalidCredentialsError();
    }

    return this.issueToken(user.id, user.email, user.nombre, user.role);
  }

  async refresh(userId: string) {
    const user = await this.users.findById(userId);
    if (!user) {
      throw new InvalidCredentialsError();
    }
    return this.issueToken(user.id, user.email, user.nombre, user.role);
  }

  private issueToken(id: string, email: string, nombre: string, role: string) {
    const options = { expiresIn: env.jwtExpiresIn } as jwt.SignOptions;
    const token = jwt.sign({ sub: id, email, role }, env.jwtSecret, options);

    return {
      token,
      user: { id, email, nombre, role }
    };
  }
}

export const authService = new AuthService(userRepository);
