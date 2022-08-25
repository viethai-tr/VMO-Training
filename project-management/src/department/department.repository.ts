import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
    Department,
    DepartmentDocument,
} from 'src/core/schemas/department.schema';
import { Repository } from 'src/core/Repository';

export class DepartmentRepository extends Repository<DepartmentDocument> {
    constructor(
        @InjectModel(Department.name)
        private departmentModel: Model<DepartmentDocument>,
    ) {
        super(departmentModel);
    }

    async getAllDepartments(limit?: number, page?: number) {
        try {
            let listResult;
            page = Math.floor(page);
            const totalDocs = await this.departmentModel.countDocuments();
            const totalPages = Math.ceil(totalDocs / limit);
            if (limit) {
                if (page <= totalPages) {
                    const skip = limit * (page - 1);

                    listResult = await this.departmentModel
                        .find({})
                        .skip(skip)
                        .limit(limit)
                        .populate('manager', 'name')
                        .populate('employees', 'name')
                        .populate('projects', 'name');
                    return {
                        curPage: page,
                        totalPages,
                        listResult,
                    };
                } else if (page > totalPages) {
                    throw new HttpException(
                        `Page ${page} not exist!`,
                        HttpStatus.FORBIDDEN,
                    );
                } else {
                    listResult = await this.departmentModel
                        .find()
                        .limit(limit)
                        .populate('manager', 'name')
                        .populate('employees', 'name')
                        .populate('projects', 'name');
                    return {
                        curPage: page,
                        totalPages,
                        listResult,
                    };
                }
            } else {
                listResult = await this.departmentModel
                    .find()
                    .populate('manager', 'name')
                    .populate('employees', 'name')
                    .populate('projects', 'name');
            }
            return Promise.resolve(listResult);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    async getDepartmentById(id: string): Promise<DepartmentDocument> {
        return await this.departmentModel
            .findOne({ _id: id })
            .populate('manager', 'name')
            .populate('employees', 'name')
            .populate('projects', 'name');
    }

    async getEmployeesDepartment(id: string) {
        return await this.departmentModel
            .findOne({ _id: id }, { employees: 1, manager: 1, name: 1 })
            .populate('manager', 'name')
            .populate('employees', 'name');
    }

    async getProjectsDepartment(id: string) {
        return await this.departmentModel
            .findOne({ _id: id }, { name: 1, projects: 1 })
            .populate('projects', 'name');
    }
}
