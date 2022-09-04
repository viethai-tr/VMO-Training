import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProjectTypeDto } from 'src/core/dtos';
import {
    ProjectType,
    ProjectTypeDocument,
} from 'src/core/schemas/project-type.schema';
import { Project, ProjectDocument } from 'src/core/schemas/project.schema';
import { checkObjectId } from 'src/shared/checkObjectId';
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
        limit?: number,
        page?: number,
        search?: string,
        sort?: string,
    ) {
        return await this.projectTypeRepository.getAll(
            limit,
            page,
            search,
            sort,
        );
    }

    async getProjectTypeById(id: string): Promise<ProjectType> {
        return await this.projectTypeRepository.getById(id);
    }

    async updateProjectType(id: string, projectTypeDto: ProjectTypeDto) {
        return await this.projectTypeRepository.update(
            id,
            <ProjectTypeDocument>projectTypeDto,
        );
    }

    async createProjectType(projectTypeDto: ProjectTypeDto) {
        return await this.projectTypeRepository.create(
            <ProjectTypeDocument>projectTypeDto,
        );
    }

    async deleteProjectType(id: string) {
        if (checkObjectId(id)) {
            const checkProjectType = this.projectTypeModel.find({ _id: id });
            if (!checkProjectType)
                throw new HttpException('Not found', HttpStatus.NOT_FOUND);

            const projects = await this.projectModel.find({ type: id });
            if (!projects || projects.length == 0) {
                await this.projectTypeRepository.delete(id);
                return {
                    HttpStatus: HttpStatus.OK,
                    message: 'Delete successfully!',
                };
            } else {
                throw new HttpException('Cannot delete', HttpStatus.FORBIDDEN);
            }
        }
    }
}
