import { HydratedDocument } from "mongoose";
import { UserDocument } from "../../models/user.model.js";
import { IBaseRepository } from "../interfaces/base.repository.interface.js";

export interface IUserRepository extends IBaseRepository<HydratedDocument<UserDocument>>  {
    findByEmail(email: string, includePassword?: boolean): Promise<HydratedDocument<UserDocument> | null>;
}
