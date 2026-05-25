import type { FilterQuery, HydratedDocument, ProjectionType, QueryOptions, UpdateQuery } from "mongoose";

export interface IBaseRepository<T> {
    create(data: Partial<T>): Promise<HydratedDocument<T>>;

    findById(id: string, projection?: ProjectionType<T>): Promise<HydratedDocument<T> | null>;

    findOne(
        filter: FilterQuery<T>,
        projection?: ProjectionType<T>,
        options?: QueryOptions<T>,
    ): Promise<HydratedDocument<T> | null>;

    findMany(
        filter: FilterQuery<T>,
        projection?: ProjectionType<T>,
        options?: QueryOptions<T>,
    ): Promise<HydratedDocument<T>[]>;

    updateById(id: string, update: UpdateQuery<T>, options?: QueryOptions<T>): Promise<HydratedDocument<T> | null>;

    updateOne(
        filter: FilterQuery<T>,
        update: UpdateQuery<T>,
        options?: QueryOptions<T>,
    ): Promise<HydratedDocument<T> | null>;

    deleteById(id: string): Promise<HydratedDocument<T> | null>;

    count(filter: FilterQuery<T>): Promise<number>;

    exists(filter: FilterQuery<T>): Promise<boolean>;
}
