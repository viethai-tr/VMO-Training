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
import { checkObjectId } from 'src/shared/checkObjectId';
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
        limit?: number,
        page?: number,
        search?: string,
        sort?: string,
    ) {
        return this.projectStatusRepository.getAll(
            limit,
            page,
            search,
            sort,
        );
    }

    async getProjectStatusById(id: string) {
        checkObjectId(id);
        return this.projectStatusRepository.getById(id);
    }

    async createProjectStatus(projectStatusDto: ProjectStatusDto) {
        return this.projectStatusRepository.create(
            <ProjectStatusDocument>projectStatusDto,
        );
    }

    async updateProjectStatus(id: string, projectStatusDto: ProjectStatusDto) {
        checkObjectId(id);
        return this.projectStatusRepository.update(
            id,
            <ProjectStatusDocument>projectStatusDto,
        );
    }

    async deleteProjectStatus(id: string) {
        checkObjectId(id);
        const checkProjectStatus = this.projectStatusModel.find({ _id: id });
        if (!checkProjectStatus)
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);

        const projects = await this.projectModel.find({ status: id });
        if (!projects || projects.length == 0) {
            await this.projectStatusRepository.delete(id);
            return 'Delete successfully!';
        } else {
            throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        }
    }
}
