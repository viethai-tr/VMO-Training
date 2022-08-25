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

    async getAllEmployeesAsync(limit?: number, page?: number, sort?: string) {
        try {
            let listResult;
            page = Math.floor(page);
            const totalDocs = await this.employeeModel.countDocuments();
            const totalPages = Math.ceil(totalDocs / limit);

            let sortType;
            sort = sort.toLowerCase();
            if (sort == 'desc') sortType = 'desc';
            else sortType = 'asc';

            if (limit) {
                if (page <= totalPages) {
                    const skip = limit * (page - 1);

                    listResult = await this.employeeModel
                        .find({})
                        .sort({name: sortType})
                        .skip(skip)
                        .limit(limit)
                        .populate('technologies', 'name');
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
                    listResult = await this.employeeModel
                        .find()
                        .sort({name: sortType})
                        .limit(limit)
                        .populate('technologies', 'name');
                    return {
                        limit,
                        listResult,
                    };
                }
            } else {
                listResult = await this.employeeModel
                    .find()
                    .sort({name: sortType})
                    .populate('technologies', 'name');
            }
            return Promise.resolve(listResult);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    async getEmployeeByIdAsync(id: string): Promise<EmployeeDocument> {
        try {
            let employeeResult = await this.employeeModel
                .findOne({ _id: id })
                .populate('technologies', 'name');

            return Promise.resolve(employeeResult);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    async deleteEmployee(id: string) {
        let checkEmployee;
        try {
            checkEmployee = await this.employeeModel.findOne({ _id: id });
        } catch (err) {
            throw new HttpException(
                {
                    status: HttpStatus.NOT_ACCEPTABLE,
                    error: 'Not a valid ID',
                },
                HttpStatus.NOT_ACCEPTABLE,
            );
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
        try {
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
        } catch (err) {
            throw new HttpException(
                {
                    status: HttpStatus.NOT_ACCEPTABLE,
                    error: 'Not a valid ID',
                },
                HttpStatus.NOT_ACCEPTABLE,
            );
        }
    }
}
