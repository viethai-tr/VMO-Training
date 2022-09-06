import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProjectStatusDto } from 'src/core/dtos/project-status.dto';
import { Employee, EmployeeDocument } from 'src/core/schemas/employee.schema';
import {
    ProjectStatus,
    ProjectStatusDocument,
} from 'src/core/schemas/project-status.schema';
import { Project, ProjectDocument } from 'src/core/schemas/project.schema';
import {
    RESPOND,
    RESPOND_CREATED,
    RESPOND_DELETED,
    RESPOND_GOT,
    RESPOND_UPDATED,
} from 'src/shared/const/respond.const';
import { checkObjectId } from 'src/shared/utils/checkObjectId';
import { ProjectStatusRepository } from './project-status.repository';

@Injectable()
export class ProjectStatusService {
    constructor(
        private projectStatusRepository: ProjectStatusRepository,
        @InjectModel(ProjectStatus.name)
        private projectStatusModel: Model<ProjectStatusDocument>,
        @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
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
        const checkProjectStatus = this.projectStatusModel.find({ _id: id });
        if (!checkProjectStatus)
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);

        const projects = await this.projectModel.find({ status: id });
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
