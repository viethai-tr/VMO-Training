import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Project, ProjectDocument } from '../core/schemas/project.schema';
import { Repository } from '../core/Repository';
import { checkInteger } from 'src/shared/utils/checkInteger';
import { PROJECT_PROPERTIES } from './project.const';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class ProjectRepository extends Repository<ProjectDocument> {
    constructor(
        @InjectModel(Project.name) private projectModel: SoftDeleteModel<ProjectDocument>,
    ) {
        super(projectModel);
    }

    async getAllProjects(
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

        checkInteger(limit) ? (limitNum = parseInt(limit)) : (limitNum = 5);
        checkInteger(page) ? (pageNum = parseInt(page)) : (pageNum = 1);

        PROJECT_PROPERTIES.includes(sortBy.toLowerCase())
            ? (sortBy = sortBy.toLowerCase())
            : (sortBy = 'name');

        const totalDocs = await this.projectModel
            .find({ name: new RegExp('.*' + search + '.*', 'i'), isDeleted: false})
            .countDocuments();

        let totalPages = Math.ceil(totalDocs / limitNum);

        checkInteger(page) ? (pageNum = parseInt(page)) : (pageNum = 1);
        pageNum <= totalPages ? pageNum : (pageNum = totalPages);
        pageNum <= 0 ? pageNum = 1 : pageNum;

        skip = limitNum * (pageNum - 1);

        const listResult = await this.projectModel
            .find({ name: new RegExp('.*' + search + '.*', 'i'), isDeleted: false})
            .sort({ [sortBy]: sortKind })
            .skip(skip)
            .limit(limitNum)
            .populate('type', 'name')
            .populate('status', 'name')
            .populate('technologies', 'name')
            .populate('employees', 'name')
            .populate('customer', 'name');

        return {
            curPage: pageNum,
            totalPages,
            search,
            sortBy,
            sort,
            listResult,
        };
    }

    async getProjectById(id: string) {
        return this.projectModel
            .findOne({ _id: id, isDeleted: false})
            .populate('type', 'name')
            .populate('status', 'name')
            .populate('technologies', 'name')
            .populate('employees', 'name')
            .populate('customer', 'name');
    }

    async getDeletedProject(id: string) {
        return this.projectModel
            .findOne({ _id: id, isDeleted: true})
            .populate('type', 'name')
            .populate('status', 'name')
            .populate('technologies', 'name')
            .populate('employees', 'name')
            .populate('customer', 'name');
    }

    async getEmployeesProject(id: string) {
        return this.projectModel
            .findOne({ _id: id, isDeleted: false}, { projects: 1, name: 1 })
            .populate('employees', 'name');
    }

    async countProjects(query) {
        const listProjects = await this.projectModel
            .find(query)
            .populate('type', 'name')
            .populate('status', 'name')
            .populate('technologies', 'name')
            .populate('employees', 'name')
            .populate('customer', 'name');
            
        const count = listProjects.length;

        return {
            query,
            quantity: count,
            listProjects,
        };
    }

    async deleteProject(id: string) {
        return this.projectModel.softDelete({_id: id});
    }

    async findByCondition(query) {
        return this.projectModel.find(query);
    }
}
