import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
    Department,
    DepartmentDocument,
} from '../core/schemas/department.schema';
import { Repository } from '../core/Repository';

export class DepartmentRepository extends Repository<DepartmentDocument> {
    constructor(
        @InjectModel(Department.name)
        private departmentModel: Model<DepartmentDocument>,
    ) {
        super(departmentModel);
    }

    async getAllDepartments(
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
        
        const departmentProperties = ['name', 'founding_date'];
        sortBy = sortBy.toLowerCase();
        if (!departmentProperties.includes(sortBy)) sortBy = 'name';

        let listResult = await this.departmentModel
            .find({ name: new RegExp('.*' + search + '.*', 'i') })
            .sort({ [sortBy]: sortKind })
            .limit(limit)
            .populate('manager', 'name')
            .populate('employees', 'name')
            .populate('projects', 'name');

        const totalDocs = await this.departmentModel
            .find({ name: new RegExp('.*' + search + '.*', 'i') })
            .countDocuments();

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
