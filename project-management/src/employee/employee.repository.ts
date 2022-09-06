import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import {
    Department,
    DepartmentDocument,
} from '../core/schemas/department.schema';
import { Employee, EmployeeDocument } from '../core/schemas/employee.schema';
import { Project, ProjectDocument } from '../core/schemas/project.schema';
import { Repository } from '../core/Repository';
import { checkObjectId } from 'src/shared/utils/checkObjectId';
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

        if (sort != undefined) {
            sort = sort.toLowerCase();
            if (sort == 'desc') sortKind = 'desc';
            else sortKind = 'asc';
        } else sortKind = 'asc';

        EMPLOYEE_PROPERTIES.includes(sortBy.toLowerCase())
            ? (sortBy = sortBy.toLowerCase())
            : (sortBy = 'name');

        checkInteger(limit) ? (limitNum = parseInt(limit)) : (limitNum = 5);

        const totalDocs = await this.employeeModel
            .find({ name: new RegExp('.*' + search + '.*', 'i') })
            .countDocuments();
        let totalPages = Math.ceil(totalDocs / limitNum);

        checkInteger(page) ? (pageNum = parseInt(page)) : (pageNum = 1);
        pageNum <= totalPages ? pageNum : (pageNum = totalPages);

        const listResult = await this.employeeModel
            .find({ name: new RegExp('.*' + search + '.*', 'i') })
            .sort({ [sortBy]: sortKind })
            .limit(limitNum)
            .populate('technologies', 'name')
            .populate('projects', 'name');

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

    async getEmployeeByIdAsync(id: string): Promise<EmployeeDocument> {
        return this.employeeModel
            .findOne({ _id: id })
            .populate('technologies', 'name')
            .populate('projects', 'name');
    }

    async deleteEmployee(id: string) {
        return this.employeeModel.findOneAndDelete({ _id: id });
    }

    async countEmployees(technology?: string, project?: string) {
        let count;
        let listEmployees;

        let oriQuery = { technologies: technology, projects: project };

        const query = Object.fromEntries(
            Object.entries(oriQuery).filter(
                ([_, v]) => (v != null && v != '' && v != undefined),
            ),
        );

        for (let queryProperty in query) {
            if (queryProperty) checkObjectId(query[queryProperty]);
        }

        listEmployees = await this.employeeModel
            .find(query)
            .populate('technologies', 'name')
            .populate('projects', 'name');
        count = listEmployees.length;

        return {
            numEmployees: count,
            listEmployees,
        };
    }
}
