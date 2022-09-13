import { Types, Document } from "mongoose";

export interface IRepository<T extends Document> {
    create(item: T): Promise<T>;

    update(id: string, item: T);

    // delete(id: string): Promise<T>;

    getAll(limit: string, page: string, search: string, sort: string, sortBy?: string);

    getById(id: string): Promise<T>;

}