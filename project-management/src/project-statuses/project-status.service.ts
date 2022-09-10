import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { ProjectStatusDto } from '../core/dtos/project-status.dto';
import {
    ProjectStatus,
    ProjectStatusDocument,
} from '../core/schemas/project-status.schema';
import { ProjectService } from '../projects/projects.service';
import {
    RESPOND,
    RESPOND_CREATED,
    RESPOND_DELETED,
    RESPOND_GOT,
    RESPOND_UPDATED,
} from '../shared/const/respond.const';
import { ProjectStatusRepository } from './project-status.repository';

@Injectable()
export class ProjectStatusService {
    constructor(
        private projectStatusRepository: ProjectStatusRepository,
        @InjectModel(ProjectStatus.name)
        private projectStatusModel: SoftDeleteModel<ProjectStatusDocument>,
        private projectService: ProjectService
    ) {}

    async getAllProjectStatuses(
        limit?: string,
        page?: string,
        search?: string,
        sort?: string,
    ) {
        return this.projectStatusRepository.getAll(limit, page, search, sort);
    }

    async getProjectStatusById(id: string) {
        const curProjectStatus = await this.projectStatusRepository.getById(id);

        return RESPOND(RESPOND_GOT, curProjectStatus);
    }

    async createProjectStatus(projectStatusDto: ProjectStatusDto) {
        const newProjectStatus = await this.projectStatusRepository.create(
            <ProjectStatusDocument>projectStatusDto,
        );

        return RESPOND(RESPOND_CREATED, newProjectStatus);
    }

    async updateProjectStatus(id: string, projectStatusDto: ProjectStatusDto) {
        const updatedProjectStatus = await this.projectStatusRepository.update(
            id,
            <ProjectStatusDocument>projectStatusDto,
        );

        return RESPOND(RESPOND_UPDATED, updatedProjectStatus);
    }

    async deleteProjectStatus(id: string) {
        const checkProjectStatus = this.projectStatusRepository.getById(id);
        if (!checkProjectStatus)
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);

        const projects = await this.projectService.findByCondition({statuses: id, isDeleted: false});
        if (!projects || projects.length == 0) {
            return this.projectStatusModel.softDelete({_id: id});
        } else {
            throw new BadRequestException('Cannot delete');
        }
    }

    async restoreProjectStatus(id: string) {
        return this.projectStatusModel.restore({_id: id});
    }
}
