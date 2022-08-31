import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmployeeDocument } from 'src/core/schemas/employee.schema';
import {
    Department,
    DepartmentDocument,
} from '../core/schemas/department.schema';
import { Project, ProjectDocument } from '../core/schemas/project.schema';
import { Repository } from '../core/Repository';

@Injectable()
export class ProjectRepository extends Repository<ProjectDocument> {
    constructor(
        @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
        @InjectModel(Department.name)
        private departmentModel: Model<DepartmentDocument>,
    ) {
        super(projectModel);
    }

    async getAllProjects(limit?: number, page?: number, sort?: string, sortBy?: string) {
        try {
            let listResult;
            page = Math.floor(page);
            const totalDocs = await this.projectModel.countDocuments();
            const totalPages = Math.ceil(totalDocs / limit);

            let sortKind;
            if (sort != undefined) {
                sort = sort.toLowerCase();
                if (sort == 'desc') sortKind = 'desc';
                else sortKind = 'asc';
            } else sortKind = 'asc';

            const projectProperties = ['name', 'starting_date'];
            if (sortBy != undefined) {
                sortBy = sortBy.toLowerCase();
                if (!projectProperties.includes(sortBy))
                    sortBy = 'name';
            } else sortBy = 'name';

            if (limit) {
                if (page <= totalPages) {
                    const skip = limit * (page - 1);

                    listResult = await this.projectModel
                        .find({})
                        .sort({[sortBy]: sortKind})
                        .skip(skip)
                        .limit(limit)
                        .populate('type', 'name')
                        .populate('status', 'name')
                        .populate('technologies', 'name')
                        .populate('employees', 'name')
                        .populate('customer', 'name');
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
                    listResult = await this.projectModel
                        .find()
                        .sort({[sortBy]: sortKind})
                        .limit(limit)
                        .populate('type', 'name')
                        .populate('status', 'name')
                        .populate('technologies', 'name')
                        .populate('employees', 'name')
                        .populate('customer', 'name');
                    return {
                        page: page + ' / ' + totalPages,
                        listResult,
                    };
                }
            } else {
                listResult = await this.projectModel
                    .find()
                    .sort({[sortBy]: sortKind})
                    .populate('type', 'name')
                    .populate('status', 'name')
                    .populate('technologies', 'name')
                    .populate('employees', 'name')
                    .populate('customer', 'name');
            }
            return Promise.resolve(listResult);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    async getProjectById(id: string) {
        try {
            return await this.projectModel
                .findOne({ _id: id })
                .populate('type', 'name')
                .populate('status', 'name')
                .populate('technologies', 'name')
                .populate('employees', 'name')
                .populate('customer', 'name');
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

    async getEmployeesProject(id: string) {
        return await this.projectModel
            .findOne({ _id: id }, { employees: 1, name: 1 })
            .populate('employees', 'name');
    }

    async countProjects(
        type?: string,
        status?: string,
        customer?: string,
        technology?: string,
        startingDate?: string,
    ) {
        let oriQuery = {
            type: type,
            status: status,
            customer: customer,
            technologies: technology,
            starting_date: startingDate,
        };

        const query = Object.fromEntries(
            Object.entries(oriQuery).filter(([_, v]) => v != null),
        );

        console.log(query);

        try {
            const count = await this.projectModel.countDocuments(query);

            return {
                query,
                quantity: count,
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

    async deleteProject(id: string) {
        let checkProject;

        try {
            checkProject = await this.projectModel.findOne({ _id: id });
        } catch (err) {
            throw new HttpException(
                {
                    status: HttpStatus.NOT_ACCEPTABLE,
                    error: 'Not a valid ID',
                },
                HttpStatus.NOT_ACCEPTABLE,
            );
        }

        if (checkProject) {
            const checkDepartment = this.departmentModel.find({ projects: id });
            if (!checkDepartment || (await checkDepartment).length == 0) {
                await this.projectModel.findOneAndDelete({ _id: id });
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
}
