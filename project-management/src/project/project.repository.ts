import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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

    async getAllProjects(
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

        const projectProperties = ['name', 'starting_date'];
        sortBy = sortBy.toLowerCase();
        if (!projectProperties.includes(sortBy)) sortBy = 'name';

        let listResult = await this.projectModel
            .find({ name: new RegExp('.*' + search + '.*', 'i') })
            .sort({ [sortBy]: sortKind })
            .limit(limit)
            .populate('type', 'name')
            .populate('status', 'name')
            .populate('technologies', 'name')
            .populate('employees', 'name')
            .populate('customer', 'name');

        let totalPages;
        if (limit == 0) totalPages = 1;
        else totalPages = Math.ceil(listResult.length / limit);
        if (page > totalPages || page < 0) page = 1;
        else page = Math.floor(page);

        return {
            curPage: page,
            totalPages,
            search,
            sortBy,
            sort,
            listResult,
        };
    }

    async getProjectById(id: string) {
            return await this.projectModel
                .findOne({ _id: id })
                .populate('type', 'name')
                .populate('status', 'name')
                .populate('technologies', 'name')
                .populate('employees', 'name')
                .populate('customer', 'name');
    }

    async getEmployeesProject(id: string) {
        return await this.projectModel
            .findOne({ _id: id }, { projects: 1, name: 1 })
            .populate('employees', 'name');
    }

    async countProjects(
        query
    ) {
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
                    error: 'Invalid ID',
                },
                HttpStatus.NOT_ACCEPTABLE,
            );
        }
    }

    async deleteProject(id: string) {
       return await this.projectModel.findOneAndDelete({_id: id});
    }
}
