import { FilterQuery, Model, ProjectionType, QueryOptions, UpdateQuery, Document } from "mongoose";
import { IBaseRepository } from "../interfaces/base.repository.interface";

export class BaseRepository<T extends Document> implements IBaseRepository<T> {
    constructor(protected readonly model: Model<T>) {}

    async create(data: Partial<T>): Promise<T> {
        return this.model.create(data);
    }

    async findById(id: string, projection?: ProjectionType<T>): Promise<T | null> {
        return this.model.findById(id, projection).exec();
    }

    async findOne(filter: FilterQuery<T>, projection?: ProjectionType<T>, options?: QueryOptions<T>): Promise<T | null> {
        return this.model.findOne(filter, projection, options).exec();
    }

    async findMany(filter: FilterQuery<T>, projection?: ProjectionType<T>, options?: QueryOptions<T>): Promise<T[]> {
        return this.model.find(filter, projection, options).exec();
    }

    async updateById(id: string, update: UpdateQuery<T>, options: QueryOptions<T> = { new: true }): Promise<T | null> {
        return this.model.findByIdAndUpdate(id, update, options).exec();
    }

    async updateOne(
        filter: FilterQuery<T>,
        update: UpdateQuery<T>,
        options: QueryOptions<T> = { new: true },
    ): Promise<T | null> {
        return this.model.findOneAndUpdate(filter, update, options).exec();
    }

    async deleteById(id: string): Promise<T | null> {
        return this.model.findByIdAndDelete(id).exec();
    }

    async count(filter: FilterQuery<T>): Promise<number> {
        return this.model.countDocuments(filter).exec();
    }

    async exists(filter: FilterQuery<T>): Promise<boolean> {
        const result = await this.model.exists(filter);
        return result !== null;
    }
}
