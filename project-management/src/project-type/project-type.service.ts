import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProjectTypeDto } from 'src/core/dtos';
import {
    ProjectType,
    ProjectTypeDocument,
} from 'src/core/schemas/project-type.schema';
import {
    RESPOND,
    RESPOND_CREATED,
    RESPOND_DELETED,
    RESPOND_GOT,
    RESPOND_UPDATED,
} from 'src/shared/const/respond.const';
import { Project, ProjectDocument } from '../core/schemas/project.schema';
import { checkObjectId } from '../shared/utils/checkObjectId';
import { ProjectTypeRepository } from './project-type.repository';

@Injectable()
export class ProjectTypeService {
    constructor(
        private projectTypeRepository: ProjectTypeRepository,
        @InjectModel(ProjectType.name)
        private projectTypeModel: Model<ProjectTypeDocument>,
        @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    ) {}

    async getAllProjectTypes(
        limit?: string,
        page?: string,
        search?: string,
        sort?: string,
    ) {
        return this.projectTypeRepository.getAll(limit, page, search, sort);
    }

    async getProjectTypeById(id: string) {
        checkObjectId(id);
        const curProjectType = await this.projectTypeRepository.getById(id);

        return RESPOND(RESPOND_GOT, curProjectType);
    }

    async updateProjectType(id: string, projectTypeDto: ProjectTypeDto) {
        checkObjectId(id);
        const updatedProjectType = await this.projectTypeRepository.update(
            id,
            <ProjectTypeDocument>projectTypeDto,
        );

        return RESPOND(RESPOND_UPDATED, updatedProjectType);
    }

    async createProjectType(projectTypeDto: ProjectTypeDto) {
        const newProjectType = await this.projectTypeRepository.create(
            <ProjectTypeDocument>projectTypeDto,
        );

        return RESPOND(RESPOND_CREATED, newProjectType);
    }

    async deleteProjectType(id: string) {
        checkObjectId(id);
        const checkProjectType = this.projectTypeModel.find({ _id: id });
        if (!checkProjectType)
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);

        const projects = await this.projectModel.find({ type: id });
        if (!projects || projects.length == 0) {
            await this.projectTypeRepository.delete(id);
            return RESPOND(RESPOND_DELETED, {
                id: id,
            });
        } else {
            throw new HttpException('Cannot be deleted', HttpStatus.FORBIDDEN);
        }
    }
}
