import { HttpException, HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';
import { IRepository } from '../shared/database/IRepository';

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

    async getAll(limit?: number, page?: number) {
        try {
            let listResult;
            page = Math.floor(page);
            const totalDocs = await this._model.countDocuments();
            const totalPages = Math.ceil(totalDocs / limit);
            if (limit) {
                if (page <= totalPages) {
                    const skip = limit * (page - 1);

                    listResult = await this._model
                        .find()
                        .skip(skip)
                        .limit(limit);

                    return {
                        page: page + ' / ' + totalPages,
                        listResult,
                    };
                } else if (page > totalPages) {
                    throw new HttpException(
                        `Page ${page} not exist!`,
                        HttpStatus.FORBIDDEN
                    );
                } else {
                    listResult = await this._model.find().limit(limit);
                    return {
                        limit: limit,
                        listResult,
                    };
                }
            } else {
                listResult = await this._model.find();
            }
            return Promise.resolve(listResult);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    async getById(id: string): Promise<T> {
        try {
            return this._model.findOne({ _id: id });
        } catch (err) {
            return Promise.reject(err);
        }
    }
}
