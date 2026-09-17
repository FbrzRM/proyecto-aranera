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

    const options = { expiresIn: env.jwtExpiresIn } as jwt.SignOptions;
    const token = jwt.sign({ sub: user.id, email: user.email, role: user.role }, env.jwtSecret, options);

    return {
      token,
      user: { id: user.id, email: user.email, nombre: user.nombre, role: user.role }
    };
  }
}

export const authService = new AuthService(userRepository);
