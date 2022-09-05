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
import { checkObjectId } from 'src/shared/checkObjectId';

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

        const listResult = await this.employeeModel
            .find({ name: new RegExp('.*' + search + '.*', 'i') })
            .sort({ [sortBy]: sortKind })
            .limit(limit)
            .populate('technologies', 'name');

        const totalDocs = await this.employeeModel
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

    async getEmployeeByIdAsync(id: string): Promise<EmployeeDocument> {
        return await this.employeeModel
            .findOne({ _id: id })
            .populate('technologies', 'name');
    }

    async deleteEmployee(id: string) {
        return await this.employeeModel.findOneAndDelete({ _id: id });
    }

    async countEmployees(technology?: string, project?: string) {
        let count;

        if (!technology && !project) {
            count = await this.employeeModel.countDocuments();
            return {
                num_of_employees: count,
            };
        }

        let listEmployeesTechnology;
        let listEmployeesProject;

        if (project) {
            if (checkObjectId(project)) {
                listEmployeesProject = await (
                    await this.projectModel.findOne(
                        { _id: project },
                        { employees: true },
                    )
                ).employees;
                count = listEmployeesProject.length;
            }
        }

        if (technology) {
            if (checkObjectId(technology)) {
                listEmployeesTechnology = await (
                    await this.employeeModel.find({ technologies: technology })
                ).map((item) => item._id);
                count = listEmployeesTechnology.length;
            }
        }

        if (project && technology) {
            if (checkObjectId(project) && checkObjectId(technology))
                count = (
                    await listEmployeesTechnology.filter((value) =>
                        listEmployeesProject.includes(value),
                    )
                ).length;
        }

        return {
            num_of_employees: count,
        };
    }
}
