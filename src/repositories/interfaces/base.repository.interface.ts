import { Document, FilterQuery, ProjectionType, QueryOptions, UpdateQuery } from "mongoose";

export interface IBaseRepository<T extends Document> {
    create(data: Partial<T>): Promise<T>;

    findById(id: string, projection?: ProjectionType<T>): Promise<T | null>;

    findOne(filter: FilterQuery<T>, projection?: ProjectionType<T>, options?: QueryOptions<T>): Promise<T | null>;

    findMany(filter: FilterQuery<T>, projection?: ProjectionType<T>, options?: QueryOptions<T>): Promise<T[]>;

    updateById(id: string, update: UpdateQuery<T>, options?: QueryOptions<T>): Promise<T | null>;

    updateOne(filter: FilterQuery<T>, update: UpdateQuery<T>, options?: QueryOptions<T>): Promise<T | null>;

    deleteById(id: string): Promise<T | null>;

    count(filter: FilterQuery<T>): Promise<number>;

    exists(filter: FilterQuery<T>): Promise<boolean>;
}
