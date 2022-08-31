import { Injectable } from '@nestjs/common';
import { ProjectStatusDto } from 'src/core/dtos/project-status.dto';
import { ProjectStatusDocument } from 'src/core/schemas/project-status.schema';
import { ProjectStatusRepository } from './project-status.repository';

@Injectable()
export class ProjectStatusService {
    constructor(private projectStatusRepository: ProjectStatusRepository) {}

    async getAllProjectStatuses(limit?: number, page?: number): Promise<ProjectStatusDocument[]> {
        return await this.projectStatusRepository.getAll(limit, page);
    }

    async getProjectStatusById(id: string): Promise<ProjectStatusDocument> {
        return await this.projectStatusRepository.getById(id);
    }

    async createProjectStatus(projectStatusDto: ProjectStatusDto) { 
        return await this.projectStatusRepository.create(<ProjectStatusDocument>(projectStatusDto));
    }

    async updateProjectStatus(id: string, projectStatusDto: ProjectStatusDto) { 
        return await this.projectStatusRepository.update(id, <ProjectStatusDocument>(projectStatusDto));
    }

    async deleteProjectStatus(id: string) {
        return await this.projectStatusRepository.deleteProjectStatus(id);
    }
}
