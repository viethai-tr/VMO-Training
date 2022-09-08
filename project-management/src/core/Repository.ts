import { Model } from 'mongoose';
import { checkInteger } from '../shared/utils/checkInteger';
import { IRepository } from './database/IRepository';

export class Repository<T extends Document> implements IRepository<T> {
    constructor(private _model: Model<T>) {}

    async create(item: T) {
        return this._model.create(item);
    }

    async update(id: string, item: T): Promise<T> {
        this._model.findOneAndUpdate({ _id: id }, item);
        return item;
    }

    async delete(id: string): Promise<T> {
        return this._model.findOneAndDelete({ _id: id });
    }

    async getAll(
        limit: string = '5',
        page: string = '1',
        search: string = '',
        sort: string = 'asc',
        sortBy: string = 'name',
    ) {
        let sortKind;
        let limitNum;
        let pageNum;

        if (sort != undefined) {
            sort = sort.toLowerCase();
            if (sort == 'desc') sortKind = 'desc';
            else sortKind = 'asc';
        } else sortKind = 'asc';

        checkInteger(limit) ? (limitNum = parseInt(limit)) : (limitNum = 5);

        const totalDocs = await this._model
        .find({ name: new RegExp('.*' + search + '.*', 'i') }).countDocuments();

        let totalPages = Math.ceil(totalDocs / limitNum);

        checkInteger(page) ? (pageNum = parseInt(page)) : (pageNum = 1);
        pageNum <= totalPages ? pageNum : pageNum = totalPages;

        const listResult = await this._model
            .find({ name: new RegExp('.*' + search + '.*', 'i') })
            .sort({ [sortBy]: sortKind })
            .limit(limitNum);

        return {
            totalDocs,
            curPage: pageNum,
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
