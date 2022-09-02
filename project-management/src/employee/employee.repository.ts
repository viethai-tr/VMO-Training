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
        const totalDocs = await this.employeeModel.countDocuments();

        if (limit < 0) limit = 0;

        let totalPages;
        if (limit == 0) totalPages = 1;
        else totalPages = Math.ceil(totalDocs / limit);
        if (page > totalPages || page < 0) page = 1;
        else page = Math.floor(page);

        let sortKind;
        if (sort != undefined) {
            sort = sort.toLowerCase();
            if (sort == 'desc') sortKind = 'desc';
            else sortKind = 'asc';
        } else sortKind = 'asc';

        const employeeProperties = ['name', 'dob', 'experience'];
        sortBy = sortBy.toLowerCase();
        if (!employeeProperties.includes(sortBy)) sortBy = 'name';

        let listResult = await this.employeeModel
            .find({ name: new RegExp('.*' + search + '.*', 'i') })
            .sort({ [sortBy]: sortKind })
            .limit(limit)
            .populate('technologies', 'name');

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
        let checkEmployee;
        try {
            checkEmployee = await this.employeeModel.findOne({ _id: id });
        } catch (err) {
            throw new HttpException('Not a valid ID', HttpStatus.BAD_REQUEST);
        }

        if (checkEmployee) {
            const projects = this.projectModel.find({ employees: id });
            const departments = this.departmentModel.find({ employees: id });
            const manager = this.departmentModel.find({ manager: id });

            if (
                (!projects || (await projects).length == 0) &&
                (!departments || (await departments).length == 0) &&
                (!manager || (await manager).length == 0)
            ) {
                await this.employeeModel.findOneAndDelete({ _id: id });
                return {
                    HttpStatus: HttpStatus.OK,
                    msg: 'Delete successfully!',
                };
            } else {
                throw new HttpException(
                    'Cannot be deleted',
                    HttpStatus.FORBIDDEN,
                );
            }
        } else {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
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
            listEmployeesProject = await (
                await this.projectModel.findOne(
                    { _id: project },
                    { employees: true },
                )
            ).employees;
        }

        if (technology) {
            listEmployeesTechnology = await (
                await this.employeeModel.find({ technologies: technology })
            ).map((item) => item._id);
        }

        if (project && technology) {
            count = (
                await listEmployeesTechnology.filter((value) =>
                    listEmployeesProject.includes(value),
                )
            ).length;
        } else if (technology) {
            count = listEmployeesTechnology.length;
        } else {
            count = listEmployeesProject.length;
        }

        return {
            num_of_employees: count,
        };
    }
}
