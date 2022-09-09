import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { ProjectTypeDto } from '../core/dtos';
import {
    ProjectTypeDocument,
} from '../core/schemas/project-type.schema';
import { ProjectService } from '../projects/projects.service';
import {
    RESPOND,
    RESPOND_CREATED,
    RESPOND_DELETED,
    RESPOND_GOT,
    RESPOND_UPDATED,
} from '../shared/const/respond.const';
import { ProjectTypeRepository } from './project-types.repository';

@Injectable()
export class ProjectTypeService {
    constructor(
        private projectTypeRepository: ProjectTypeRepository,
        private projectService: ProjectService
    ) {}

    async getAllProjectTypes(
        limit?: string,
        page?: string,
        search?: string,
        sort?: string,
    ) {
        return this.projectTypeRepository.getAll(limit, page, search, sort);
    }

    async getProjectTypeById(id: Types.ObjectId) {
        const curProjectType = await this.projectTypeRepository.getById(id);

        return RESPOND(RESPOND_GOT, curProjectType);
    }

    async updateProjectType(id: Types.ObjectId, projectTypeDto: ProjectTypeDto) {
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

    async deleteProjectType(id: Types.ObjectId) {
        const checkProjectType = this.projectTypeRepository.getById(id);
        if (!checkProjectType)
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);

        const projects = await this.projectService.findByCondition({type: id});
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
