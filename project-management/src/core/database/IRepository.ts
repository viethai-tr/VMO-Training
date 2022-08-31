import mongoose from "mongoose";

export interface IRepository<T extends Document> {
    create(item: T): Promise<T>;

    update(id: string, item: T): Promise<T>;

    delete(id: string): Promise<T>;

    getAll();

    getById(id: string): Promise<T>;

}