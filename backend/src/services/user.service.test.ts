import { describe, expect, it, vi } from "vitest";
import { UserRepository } from "../repositories/user.repository";
import { EmailEnUsoError, UserService, UsuarioNoEncontradoError } from "./user.service";

function repoMock(overrides: Partial<UserRepository> = {}): UserRepository {
  return {
    findByEmail: vi.fn().mockResolvedValue(null),
    findById: vi.fn().mockResolvedValue(null),
    create: vi.fn(),
    list: vi.fn(),
    update: vi.fn().mockResolvedValue(null),
    ...overrides
  } as UserRepository;
}

describe("UserService.create", () => {
  it("rechaza un email ya registrado sin crear el usuario", async () => {
    const repo = repoMock({ findByEmail: vi.fn().mockResolvedValue({ id: "1", email: "a@araneda.cl" }) });
    const service = new UserService(repo);

    await expect(
      service.create({ email: "a@araneda.cl", nombre: "Ada", password: "clave123", role: "cliente" })
    ).rejects.toBeInstanceOf(EmailEnUsoError);
    expect(repo.create).not.toHaveBeenCalled();
  });
});

describe("UserService.update", () => {
  it("lanza UsuarioNoEncontradoError cuando el id no existe", async () => {
    const service = new UserService(repoMock());
    await expect(service.update("inexistente", { nombre: "Nuevo" })).rejects.toBeInstanceOf(UsuarioNoEncontradoError);
  });
});
