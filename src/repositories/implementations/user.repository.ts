import type { Model } from "mongoose";
import { BaseRepository } from "./base.repository.js";
import type { User, UserDocument } from "../../models/user.model.js";
import type { IUserRepository } from "../interfaces/user.repository.interface.js";

export class UserRepository extends BaseRepository<User> implements IUserRepository {
    constructor(model: Model<User>) {
        super(model);
    }

    async findByEmail(email: string, includePassword = false): Promise<UserDocument | null> {
        const query = this.model.findOne({ email });

        if (includePassword) {
            query.select("+password");
        }

        return query.exec();
    }
}
