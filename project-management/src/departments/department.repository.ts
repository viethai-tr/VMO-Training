import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import {
    Department,
    DepartmentDocument,
} from '../core/schemas/department.schema';
import { Repository } from '../core/Repository';
import { checkInteger } from '../shared/utils/checkInteger';
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
        let skip: number;

        if (sort != undefined) {
            sort = sort.toLowerCase();
            if (sort == 'desc') sortKind = 'desc';
            else sortKind = 'asc';
        } else sortKind = 'asc';

        DEPARTMENT_PROPERTIES_CONST.includes(sortBy.toLowerCase())
            ? (sortBy = sortBy.toLowerCase())
            : (sortBy = 'name');

        checkInteger(limit) ? (limitNum = parseInt(limit)) : (limitNum = 5);

        const totalDocs = await this.departmentModel
            .find({
                name: new RegExp('.*' + search + '.*', 'i'), isDeleted: false
            })
            .countDocuments();

        let totalPages = Math.ceil(totalDocs / limitNum);

        checkInteger(page) ? (pageNum = parseInt(page)) : (pageNum = 1);
        pageNum <= totalPages ? pageNum = pageNum : (pageNum = totalPages);
        pageNum <= 0 ? pageNum = 1 : pageNum;

        skip = limitNum * (pageNum - 1);

        let listResult = await this.departmentModel
            .find({
                name: new RegExp('.*' + search + '.*', 'i'),
                isDeleted: false,
            })
            .sort({ [sortBy]: sortKind })
            .skip(skip)
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

    async getDepartmentById(id: Types.ObjectId): Promise<DepartmentDocument> {
        return this.departmentModel
            .findOne({ _id: id, isDeleted: false})
            .populate('manager', 'name')
            .populate('employees', 'name')
            .populate('projects', 'name');
    }

    async getEmployeesDepartment(id: Types.ObjectId) {
        return this.departmentModel
            .findOne(
                { _id: id, isDeleted: false},
                { employees: 1, manager: 1, name: 1 },
            )
            .populate('manager', 'name')
            .populate('employees', 'name');
    }

    async getProjectsDepartment(id: Types.ObjectId) {
        return this.departmentModel
            .findOne({ _id: id, isDeleted: false}, { name: 1, projects: 1 })
            .populate('projects', 'name');
    }

    async findByCondition(query) {
        return this.departmentModel.find(query);
    }
}
