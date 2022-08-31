import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { DepartmentDto } from 'src/core/dtos';
import { DepartmentDocument } from 'src/core/schemas/department.schema';
import { convertObjectId } from 'src/shared/convertObjectId';
import { DepartmentRepository } from './department.repository';

@Injectable()
export class DepartmentService {
    constructor(
        private departmentRepository: DepartmentRepository
    ) { }

    async getAllDepartments(limit?: number, page?: number, sort?: string, sortBy?: string): Promise<DepartmentDocument[]> {
        return await this.departmentRepository.getAllDepartments(limit, page, sort, sortBy);
    }

    async getDepartmentById(id: string): Promise<DepartmentDocument> {
        return await this.departmentRepository.getDepartmentById(id);
    }

    async createDepartment(departmentDto: DepartmentDto) {
        const { name, description, founding_date, manager, employees, projects } = departmentDto;
        const idManager = new mongoose.Types.ObjectId(manager);
        const idEmployees = convertObjectId(employees);
        const idProjects = convertObjectId(projects);

        return await this.departmentRepository.create(<DepartmentDocument>{ name, description, founding_date, manager: idManager, employees: idEmployees, projects: idProjects });
    }

    async updateDepartment(id: string, departmentDto: DepartmentDto) {
        const { name, description, founding_date, manager, employees, projects } = departmentDto;
        const idEmployees = convertObjectId(employees);
        const idProjects = convertObjectId(projects);
        const idManager = new mongoose.Types.ObjectId(manager);

        return await this.departmentRepository.update(id, <DepartmentDocument>{ name, description, founding_date, manager: idManager, employees: idEmployees, projects: idProjects });
    }

    async deleteDepartment(id: string) {
        return await this.departmentRepository.delete(id);
    }

    async getEmployeesDepartment(id: string) {
        return await this.departmentRepository.getEmployeesDepartment(id);
    }

    async getProjectsDepartment(id: string) {
        return await this.departmentRepository.getProjectsDepartment(id);
    }

}
