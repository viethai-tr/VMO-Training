import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
    Department,
    DepartmentDocument,
} from '../core/schemas/department.schema';
import { Employee, EmployeeDocument } from '../core/schemas/employee.schema';
import { Project, ProjectDocument } from '../core/schemas/project.schema';
import { Repository } from '../core/Repository';
import { checkInteger } from 'src/shared/utils/checkInteger';
import { EMPLOYEE_PROPERTIES } from './employee.const';

@Injectable()
export class EmployeeRepository extends Repository<EmployeeDocument> {
    constructor(
        @InjectModel(Employee.name)
        private employeeModel: Model<EmployeeDocument>,
        @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
        @InjectModel(Department.name)
        private departmentModel: Model<DepartmentDocument>,
    ) {
        super(employeeModel);
    }

    async getAllEmployeesAsync(
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
        sort == 'desc' ? sortKind = 'desc' : sortKind = 'asc';

        EMPLOYEE_PROPERTIES.includes(sortBy.toLowerCase())
            ? (sortBy = sortBy.toLowerCase())
            : (sortBy = 'name');

        checkInteger(limit) ? (limitNum = parseInt(limit)) : (limitNum = 5);

        const totalDocs = await this.employeeModel
            .find({ name: new RegExp('.*' + search + '.*', 'i'), isDeleted: false})
            .countDocuments();
        let totalPages = Math.ceil(totalDocs / limitNum);

        checkInteger(page) ? (pageNum = parseInt(page)) : (pageNum = 1);
        pageNum <= totalPages ? pageNum : (pageNum = totalPages);
        pageNum <= 0 ? pageNum = 1 : pageNum;

        skip = limitNum * (pageNum - 1);

        const listResult = await this.employeeModel
            .find({ name: new RegExp('.*' + search + '.*', 'i'), isDeleted: false})
            .sort({ [sortBy]: sortKind })
            .skip(skip)
            .limit(limitNum)
            .populate('technologies', 'name')
            .populate('projects', 'name');

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

    async getEmployeeByIdAsync(id: Types.ObjectId): Promise<EmployeeDocument> {
        return this.employeeModel
            .findOne({ _id: id, isDeleted: false})
            .populate('technologies', 'name')
            .populate('projects', 'name');
    }

    async deleteEmployee(id: Types.ObjectId) {
        return this.employeeModel.findOneAndDelete({ _id: id, isDeleted: false});
    }

    async countEmployees(technology?: Types.ObjectId, project?: Types.ObjectId) {
        let count;
        let listEmployees;

        let query = { technologies: technology, projects: project, isDeleted: false };

        Object.keys(query).forEach(key => query[key] === undefined ? delete query[key] : {});

        listEmployees = await this.employeeModel
            .find(query)
            .populate('technologies', 'name')
            .populate('projects', 'name');
        count = listEmployees.length;

        return {
            numEmployees: count
        };
    }
}
