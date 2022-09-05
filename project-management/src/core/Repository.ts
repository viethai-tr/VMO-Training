import { HttpException, HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';
import { IRepository } from './database/IRepository';

export class Repository<T extends Document> implements IRepository<T> {
    constructor(private _model: Model<T>) {}

    async create(item: T) {
        return this._model.create(item);
    }

    async update(id: string, item: T): Promise<T> {
        return this._model.findOneAndUpdate({ _id: id }, item);
    }

    async delete(id: string): Promise<T> {
        return this._model.findOneAndDelete({ _id: id });
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

        const listResult = await this._model
            .find({ name: new RegExp('.*' + search + '.*', 'i') })
            .sort({ [sortBy]: sortKind })
            .limit(limit);

        const totalDocs = await this._model
        .find({ name: new RegExp('.*' + search + '.*', 'i') }).countDocuments();

        let totalPages;
        if (limit == 0) totalPages = 1;
        else totalPages = Math.ceil(totalDocs / limit);

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
        return this._model.findOne({ _id: id });
    }
}
