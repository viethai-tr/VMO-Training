import { HttpException, HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';
import { IRepository } from './database/IRepository';

export class Repository<T extends Document> implements IRepository<T> {
    constructor(private _model: Model<T>) {}

    async create(item: T): Promise<T> {
        try {
            await this._model.create(item);
            return Promise.resolve(item);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    async update(id: string, item: T): Promise<T> {
        try {
            await this._model.findOneAndUpdate({ _id: id }, item);
            return Promise.resolve(item);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    async delete(id: string): Promise<T> {
        try {
            await this._model.findOneAndDelete({ _id: id });
        } catch (err) {
            return Promise.reject(err);
        }
    }

    async getAll(
        limit: number = 5,
        page: number = 1,
        search: string = '',
        sort: string = 'asc',
        sortBy: string = 'name',
    ) {
        let sortKind;
        if (sort != undefined) {
            sort = sort.toLowerCase();
            if (sort == 'desc') sortKind = 'desc';
            else sortKind = 'asc';
        } else sortKind = 'asc';

        if (limit < 0) limit = 0;

        let listResult = await this._model
            .find({ name: new RegExp('.*' + search + '.*', 'i') })
            .sort({ [sortBy]: sortKind })
            .limit(limit);

        let totalPages;
        if (limit == 0) totalPages = 1;
        else totalPages = Math.ceil(listResult.length / limit);

        if (page > totalPages || page < 0) page = 1;

        return {
            curPage: page,
            totalPages,
            search,
            sortBy,
            sort,
            listResult,
        };
    }

    async getById(id: string): Promise<T> {
        try {
            return this._model.findOne({ _id: id });
        } catch (err) {
            return Promise.reject(err);
        }
    }
}
