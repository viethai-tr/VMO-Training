import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { ProjectTypeDto } from '../core/dtos';
import {
    ProjectType,
    ProjectTypeDocument,
} from '../core/schemas/project-type.schema';
import { ProjectService } from '../projects/project.service';
import {
    RESPOND,
    RESPOND_CREATED,
    RESPOND_DELETED,
    RESPOND_GOT,
    RESPOND_UPDATED,
} from '../shared/const/respond.const';
import { UpdateProjectTypeDto } from './dtos/update.project-type.dto';
import { ProjectTypeRepository } from './project-types.repository';

@Injectable()
export class ProjectTypeService {
    constructor(
        private projectTypeRepository: ProjectTypeRepository,
        @InjectModel(ProjectType.name)
        private projectTypeModel: SoftDeleteModel<ProjectTypeDocument>,
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

    async getProjectTypeById(id: string) {
        return this.projectTypeRepository.getById(id);
    }

    async updateProjectType(id: string, updateProjectTypeDto: UpdateProjectTypeDto) {
        return this.projectTypeRepository.update(
            id, updateProjectTypeDto,
        );
    }

    async createProjectType(projectTypeDto: ProjectTypeDto) {
        return this.projectTypeRepository.create(
            <ProjectTypeDocument>projectTypeDto,
        );
    }

    async deleteProjectType(id: string) {
        const checkProjectType = this.projectTypeRepository.getById(id);
        if (!checkProjectType)
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);

        const projects = await this.projectService.findByCondition({type: id, isDeleted: false});
        if (!projects || projects.length == 0) {
            return this.projectTypeModel.softDelete({ _id: id});
        } else {
            throw new BadRequestException('Cannot delete');
        }
    }

    async restoreProjectType(id: string) {
        return this.projectTypeModel.restore({ _id: id });
    }
}
