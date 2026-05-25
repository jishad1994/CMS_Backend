import type { User, UserDocument } from "../../models/user.model.js";
import type { IBaseRepository } from "./base.repository.interface.js";

export interface IUserRepository extends IBaseRepository<User> {
    findByEmail(email: string, includePassword?: boolean): Promise<UserDocument | null>;
}
