import { HydratedDocument, Model } from "mongoose";
import { BaseRepository } from "./base.repository";
import { UserDocument } from "../../models/user.model";
import { IUserRepository } from "../interfaces/user.repository.interface";

export class UserRepository extends BaseRepository<HydratedDocument<UserDocument>> implements IUserRepository {
    constructor(model: Model<HydratedDocument<UserDocument>>) {
        super(model);
    }
    async findByEmail(email: string, includePassword = false): Promise<HydratedDocument<UserDocument> | null> {
        const query = this.model.findOne({ email });

        if (includePassword) {
            query.select("+password");
        }

        return query.exec();
    }
}
