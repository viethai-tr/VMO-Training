import { Model, Document } from 'mongoose';
import { checkInteger } from '../shared/utils/checkInteger';
import { IRepository } from './database/IRepository';

export class Repository<T extends Document> implements IRepository<T> {
    constructor(private _model: Model<T>) {}

    async create(item: T) {
        return this._model.create(item);
    }

    async update(id: string, item: any) {
        await this._model.updateOne(
            { _id: id, isDeleted: false },
            { $set: item },
        );
        return item;
    }

    async getAll(
        limit: string = '5',
        page: string = '1',
        search: string = '',
        sort: string = 'asc',
        sortBy: string = 'name',
    ) {
        let sortKind;
        let limitNum: number;
        let pageNum: number;
        let skip: number;

        sort = sort.trim().toLowerCase();
        sort == 'desc' ? (sortKind = 'desc') : (sortKind = 'asc');

        checkInteger(limit) ? (limitNum = parseInt(limit)) : (limitNum = 5);

        const totalDocs = await this._model
            .find({
                name: new RegExp('.*' + search + '.*', 'i'),
                isDeleted: false,
            })
            .countDocuments();

        let totalPages = Math.ceil(totalDocs / limitNum);

        checkInteger(page) ? (pageNum = parseInt(page)) : (pageNum = 1);
        pageNum <= totalPages ? pageNum : (pageNum = totalPages);
        pageNum <= 0 ? (pageNum = 1) : pageNum;

        skip = limitNum * (pageNum - 1);

        const listResult = await this._model
            .find({
                name: new RegExp('.*' + search + '.*', 'i'),
                isDeleted: false,
            })
            .sort({ [sortBy]: sortKind })
            .skip(skip)
            .limit(limitNum);

        return {
            totalDocs,
            curPage: pageNum,
            totalPages,
            search,
            sortBy,
            sort: sortKind,
            listResult,
        };
    }

    async getById(id: string): Promise<T> {
        return this._model.findOne({ _id: id, isDeleted: false });
    }
}
