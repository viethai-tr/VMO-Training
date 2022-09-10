import { Types, Document } from "mongoose";

export interface IRepository<T extends Document> {
    create(item: T): Promise<T>;

    update(id: Types.ObjectId, item: T): Promise<T>;

    // delete(id: Types.ObjectId): Promise<T>;

    getAll(limit: string, page: string, search: string, sort: string, sortBy?: string);

    getById(id: Types.ObjectId): Promise<T>;

}