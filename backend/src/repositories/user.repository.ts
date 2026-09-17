import { Role } from "../domain/roles";
import { User } from "../domain/user";
import { UserModel } from "../models/user.model";

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
}

class MongoUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email }).lean();
    if (!doc) {
      return null;
    }

    return {
      id: String(doc._id),
      email: doc.email,
      nombre: doc.nombre,
      role: doc.role as Role,
      passwordHash: doc.passwordHash
    };
  }
}

export const userRepository: UserRepository = new MongoUserRepository();
