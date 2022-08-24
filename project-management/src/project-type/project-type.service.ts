import { Injectable } from '@nestjs/common';
import { ProjectTypeDto } from 'src/core/dtos';
import { ProjectType, ProjectTypeDocument } from 'src/core/schemas/project-type.schema';
import { ProjectTypeRepository } from './project-type.repository';

@Injectable()
export class ProjectTypeService {
    constructor(
        private projectTypeRepository: ProjectTypeRepository
    ) {}

    async getAllProjectTypes(limit?: number, page?: number): Promise<ProjectType[]> {
        return await this.projectTypeRepository.getAll(limit, page);
    }

    async getProjectTypeById(id: string): Promise<ProjectType> {
        return await this.projectTypeRepository.getById(id);
    }

    async updateProjectType(id: string, projectTypeDto: ProjectTypeDto) {
        return await this.projectTypeRepository.update(id, <ProjectTypeDocument>(projectTypeDto));
    }

    async createProjectType(projectTypeDto: ProjectTypeDto) {
        return await this.projectTypeRepository.create(<ProjectTypeDocument>(projectTypeDto));
    }

    async deleteProjectType(id: string) {
        return await this.projectTypeRepository.deleteProjectType(id);
    }
}
