import bcrypt from "bcryptjs";
import { Role } from "../domain/roles";
import { User } from "../domain/user";
import { UserRepository, UserUpdate, userRepository } from "../repositories/user.repository";
import { CreateUserInput, UpdateUserInput } from "../schemas/user.schema";

export class EmailEnUsoError extends Error {
  constructor() {
    super("El email ya esta en uso");
    this.name = "EmailEnUsoError";
  }
}

export class UsuarioNoEncontradoError extends Error {
  constructor() {
    super("Usuario no encontrado");
    this.name = "UsuarioNoEncontradoError";
  }
}

function toPublic(user: User) {
  return { id: user.id, email: user.email, nombre: user.nombre, role: user.role, activo: user.activo };
}

export class UserService {
  constructor(private readonly users: UserRepository) {}

  async create(input: CreateUserInput) {
    const existing = await this.users.findByEmail(input.email);
    if (existing) {
      throw new EmailEnUsoError();
    }

    const created = await this.users.create({
      email: input.email,
      nombre: input.nombre,
      role: input.role as Role,
      passwordHash: bcrypt.hashSync(input.password, 10)
    });

    return toPublic(created);
  }

  async list(params: { page: number; limit: number }) {
    const { items, total } = await this.users.list(params);
    return { items: items.map(toPublic), total, page: params.page, limit: params.limit };
  }

  async getById(id: string) {
    const user = await this.users.findById(id);
    if (!user) {
      throw new UsuarioNoEncontradoError();
    }
    return toPublic(user);
  }

  async update(id: string, input: UpdateUserInput) {
    const data: UserUpdate = {};
    if (input.nombre !== undefined) {
      data.nombre = input.nombre;
    }
    if (input.role !== undefined) {
      data.role = input.role as Role;
    }
    if (input.activo !== undefined) {
      data.activo = input.activo;
    }
    if (input.password !== undefined) {
      data.passwordHash = bcrypt.hashSync(input.password, 10);
    }

    const updated = await this.users.update(id, data);
    if (!updated) {
      throw new UsuarioNoEncontradoError();
    }
    return toPublic(updated);
  }
}

export const userService = new UserService(userRepository);
