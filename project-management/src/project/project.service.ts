import { BadRequestException, HttpException, HttpStatus, Injectable, Query } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { EmployeeDocument } from '../core/schemas/employee.schema';
import { ProjectDto } from '../core/dtos/project.dto';
import { Project, ProjectDocument } from '../core/schemas/project.schema';
import { convertObjectId } from '../shared/convertObjectId';
import { ProjectRepository } from './project.repository';
import { ApiQuery } from '@nestjs/swagger';
import { ProjectCountDto } from 'src/core/dtos/project-count.dto';
import { checkObjectId } from 'src/shared/checkObjectId';
import { InjectModel } from '@nestjs/mongoose';
import { Department } from 'src/core/schemas/department.schema';

@Injectable()
export class ProjectService {
    constructor(
        private projectRepository: ProjectRepository,
        @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
        @InjectModel(Department.name) private departmentModel: Model<ProjectDocument>
    ) { }

    async getAllProjects(limit?: number, page?: number, search?: string, sort?: string, sortBy?: string) {
        return await this.projectRepository.getAllProjects(limit, page, search, sort, sortBy);
    }

    async getProjectById(id: string): Promise<ProjectDocument> {
        if (checkObjectId(id))
            return await this.projectRepository.getProjectById(id);
    }

    async getEmployeesProject(id: string) {
        if (checkObjectId(id))
            return await this.projectRepository.getEmployeesProject(id);
    }


    async countProjects(type?: string, status?: string, customer?: string, technology?: string, startingDate?: string) {
        if (!checkObjectId(type) || !checkObjectId(status) || !checkObjectId(customer) || !checkObjectId(technology) || !checkObjectId(startingDate))
            throw new BadRequestException('Invalid ID');

        let oriQuery = {
            type: type,
            status: status,
            customer: customer,
            technologies: technology,
            starting_date: startingDate,
        };

        const query = Object.fromEntries(
            Object.entries(oriQuery).filter(([_, v]) => v != null),
        );
        return await this.projectRepository.countProjects(query);
    }

    async createProject(projectDto: ProjectDto) {
        const { name, description, type, status, technologies, employees, customer, starting_date } = projectDto;
        const idType = new mongoose.Types.ObjectId(type);
        const idStatus = new mongoose.Types.ObjectId(status);
        const idTechnologies = convertObjectId(technologies);
        const idEmployees = convertObjectId(employees);
        const idCustomer = new mongoose.Types.ObjectId(customer);
        return await this.projectRepository.create(<ProjectDocument>{ name, description, type: idType, status: idStatus, technologies: idTechnologies, employees: idEmployees, customer: idCustomer, starting_date });
    }

    async updateProject(id: string, projectDto: ProjectDto) {
        const { name, description, type, status, technologies, employees, customer, starting_date } = projectDto;
        const idType = new mongoose.Types.ObjectId(type);
        const idStatus = new mongoose.Types.ObjectId(status);
        const idTechnologies = convertObjectId(technologies);
        const idEmployees = convertObjectId(employees);
        const idCustomer = new mongoose.Types.ObjectId(customer);

        return await this.projectRepository.update(id, <ProjectDocument>{ name, description, type: idType, status: idStatus, technologies: idTechnologies, employees: idEmployees, customer: idCustomer, starting_date });
    }

    async deleteProject(id: string) {
        if (checkObjectId(id)) {
            const checkProject = await this.projectModel.findOne({ _id: id });

            if (!checkProject) throw new HttpException('Not found', HttpStatus.NOT_FOUND);
            
            const checkDepartment = this.departmentModel.find({ projects: id });
            if (!checkDepartment || (await checkDepartment).length == 0) {
                await this.projectModel.findOneAndDelete({ _id: id });
                return {
                    HttpStatus: HttpStatus.OK,
                    message: 'Delete successfully!',
                };
            } else {
                throw new HttpException(
                    'Cannot be deleted',
                    HttpStatus.FORBIDDEN,
                );
            }
        }
    }
}
