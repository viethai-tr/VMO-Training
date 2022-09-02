import { Injectable, Query } from '@nestjs/common';
import mongoose from 'mongoose';
import { EmployeeDocument } from '../core/schemas/employee.schema';
import { ProjectDto } from '../core/dtos/project.dto';
import { ProjectDocument } from '../core/schemas/project.schema';
import { convertObjectId } from '../shared/convertObjectId';
import { ProjectRepository } from './project.repository';
import { ApiQuery } from '@nestjs/swagger';
import { ProjectCountDto } from 'src/core/dtos/project-count.dto';

@Injectable()
export class ProjectService {
    constructor(
        private projectRepository: ProjectRepository
    ) { }

    async getAllProjects(limit?: number, page?: number, search?: string, sort?: string, sortBy?: string) {
        return await this.projectRepository.getAllProjects(limit, page, search, sort, sortBy);
    }

    async getProjectById(id: string): Promise<ProjectDocument> {
        return await this.projectRepository.getProjectById(id);
    }

    async getEmployeesProject(id: string) {
        return await this.projectRepository.getEmployeesProject(id);
    }

    
    async countProjects(type?: string, status?: string, customer?: string, technology?: string, startingDate?: string) {
        return await this.projectRepository.countProjects(type, status, customer, technology, startingDate);
    }

    async createProject(projectDto: ProjectDto) {
        const {name, description, type, status, technologies, employees, customer, starting_date} = projectDto;
        const idType = new mongoose.Types.ObjectId(type);
        const idStatus = new mongoose.Types.ObjectId(status);
        const idTechnologies = convertObjectId(technologies);
        const idEmployees = convertObjectId(employees);
        const idCustomer = new mongoose.Types.ObjectId(customer);
        return await this.projectRepository.create(<ProjectDocument>{name, description, type: idType, status: idStatus, technologies: idTechnologies, employees: idEmployees, customer: idCustomer, starting_date});
    }

    async updateProject(id: string, projectDto: ProjectDto) {
        const {name, description, type, status, technologies, employees, customer, starting_date} = projectDto;
        const idType = new mongoose.Types.ObjectId(type);
        const idStatus = new mongoose.Types.ObjectId(status);
        const idTechnologies = convertObjectId(technologies);
        const idEmployees = convertObjectId(employees);
        const idCustomer = new mongoose.Types.ObjectId(customer);

        return await this.projectRepository.update(id, <ProjectDocument>{name, description, type: idType, status: idStatus, technologies: idTechnologies, employees: idEmployees, customer: idCustomer, starting_date});
    }

    async deleteProject(id: string) {
        return await this.projectRepository.deleteProject(id);
    }
}
