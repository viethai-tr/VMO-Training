import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
    Department,
    DepartmentDocument,
} from '../core/schemas/department.schema';
import { Repository } from '../core/Repository';
import { checkInteger } from 'src/shared/utils/checkInteger';
import { DEPARTMENT_PROPERTIES_CONST } from './department.const';

export class DepartmentRepository extends Repository<DepartmentDocument> {
    constructor(
        @InjectModel(Department.name)
        private departmentModel: Model<DepartmentDocument>,
    ) {
        super(departmentModel);
    }

    async getAllDepartments(
        limit: string = '5',
        page: string = '1',
        search: string = '',
        sort: string = 'asc',
        sortBy: string = 'name',
    ) {

        let sortKind;
        let limitNum: number;
        let pageNum: number;

        if (sort != undefined) {
            sort = sort.toLowerCase();
            if (sort == 'desc') sortKind = 'desc';
            else sortKind = 'asc';
        } else sortKind = 'asc';
        
        DEPARTMENT_PROPERTIES_CONST.includes(sortBy.toLowerCase()) ? sortBy = sortBy.toLowerCase() : sortBy = 'name';

        checkInteger(limit) ? (limitNum = parseInt(limit)) : (limitNum = 5);

        const totalDocs = await this.departmentModel
            .find({ name: new RegExp('.*' + search + '.*', 'i') })
            .countDocuments();

        let totalPages = Math.ceil(totalDocs / limitNum);

        checkInteger(page) ? (pageNum = parseInt(page)) : (pageNum = 1);
        pageNum <= totalPages ? pageNum : pageNum = totalPages;

        let listResult = await this.departmentModel
            .find({ name: new RegExp('.*' + search + '.*', 'i') })
            .sort({ [sortBy]: sortKind })
            .limit(limitNum)
            .populate('manager', 'name')
            .populate('employees', 'name')
            .populate('projects', 'name');

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
        return this.departmentModel
            .findOne({ _id: id })
            .populate('manager', 'name')
            .populate('employees', 'name')
            .populate('projects', 'name');
    }

    async getEmployeesDepartment(id: string) {
        return this.departmentModel
            .findOne({ _id: id }, { employees: 1, manager: 1, name: 1 })
            .populate('manager', 'name')
            .populate('employees', 'name');
    }

    async getProjectsDepartment(id: string) {
        return this.departmentModel
            .findOne({ _id: id }, { name: 1, projects: 1 })
            .populate('projects', 'name');
    }
}
