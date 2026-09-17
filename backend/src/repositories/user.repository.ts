import { isValidObjectId } from "mongoose";
import { Role } from "../domain/roles";
import { User } from "../domain/user";
import { UserModel } from "../models/user.model";

export interface NewUser {
  email: string;
  nombre: string;
  role: Role;
  passwordHash: string;
}

export interface UserUpdate {
  nombre?: string;
  role?: Role;
  activo?: boolean;
  passwordHash?: string;
}

export interface Page<T> {
  items: T[];
  total: number;
}

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(data: NewUser): Promise<User>;
  list(params: { page: number; limit: number }): Promise<Page<User>>;
  update(id: string, data: UserUpdate): Promise<User | null>;
}

interface UserDocument {
  _id: unknown;
  email: string;
  nombre: string;
  role: string;
  activo: boolean;
  passwordHash: string;
}

function toUser(doc: UserDocument): User {
  return {
    id: String(doc._id),
    email: doc.email,
    nombre: doc.nombre,
    role: doc.role as Role,
    activo: doc.activo ?? true,
    passwordHash: doc.passwordHash
  };
}

class MongoUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email }).lean<UserDocument>();
    return doc ? toUser(doc) : null;
  }

  async findById(id: string): Promise<User | null> {
    if (!isValidObjectId(id)) {
      return null;
    }
    const doc = await UserModel.findById(id).lean<UserDocument>();
    return doc ? toUser(doc) : null;
  }

  async create(data: NewUser): Promise<User> {
    const created = await UserModel.create(data);
    return toUser(created.toObject() as UserDocument);
  }

  async list(params: { page: number; limit: number }): Promise<Page<User>> {
    const skip = (params.page - 1) * params.limit;
    const [docs, total] = await Promise.all([
      UserModel.find().sort({ createdAt: -1 }).skip(skip).limit(params.limit).lean<UserDocument[]>(),
      UserModel.countDocuments()
    ]);
    return { items: docs.map(toUser), total };
  }

  async update(id: string, data: UserUpdate): Promise<User | null> {
    if (!isValidObjectId(id)) {
      return null;
    }
    const doc = await UserModel.findByIdAndUpdate(id, data, { new: true }).lean<UserDocument>();
    return doc ? toUser(doc) : null;
  }
}

export const userRepository: UserRepository = new MongoUserRepository();
