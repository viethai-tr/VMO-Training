import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProjectStatusDto } from '../core/dtos/project-status.dto';
import {
    ProjectStatusDocument,
} from '../core/schemas/project-status.schema';
import { ProjectService } from '../project/project.service';
import {
    RESPOND,
    RESPOND_CREATED,
    RESPOND_DELETED,
    RESPOND_GOT,
    RESPOND_UPDATED,
} from '../shared/const/respond.const';
import { checkObjectId } from '../shared/utils/checkObjectId';
import { ProjectStatusRepository } from './project-status.repository';

@Injectable()
export class ProjectStatusService {
    constructor(
        private projectStatusRepository: ProjectStatusRepository,
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
        checkObjectId(id);
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
        checkObjectId(id);
        const updatedProjectStatus = await this.projectStatusRepository.update(
            id,
            <ProjectStatusDocument>projectStatusDto,
        );

        return RESPOND(RESPOND_UPDATED, updatedProjectStatus);
    }

    async deleteProjectStatus(id: string) {
        checkObjectId(id);
        const checkProjectStatus = this.projectStatusRepository.getById(id);
        if (!checkProjectStatus)
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);

        const projects = await this.projectService.findByCondition({statuses: id});
        if (!projects || projects.length == 0) {
            await this.projectStatusRepository.delete(id);
            return RESPOND(RESPOND_DELETED, {
                id: id,
            });
        } else {
            throw new HttpException('Cannot be deleted', HttpStatus.FORBIDDEN);
        }
    }
}
