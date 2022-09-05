import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { check } from 'prettier';
import { DepartmentDto } from 'src/core/dtos';
import { DepartmentDocument } from 'src/core/schemas/department.schema';
import { checkObjectId } from 'src/shared/checkObjectId';
import { convertObjectId } from 'src/shared/convertObjectId';
import { DepartmentRepository } from './department.repository';

@Injectable()
export class DepartmentService {
    constructor(private departmentRepository: DepartmentRepository) {}

    async getAllDepartments(
        limit?: number,
        page?: number,
        search?: string,
        sort?: string,
        sortBy?: string,
    ) {
        return this.departmentRepository.getAllDepartments(
            limit,
            page,
            search,
            sort,
            sortBy,
        );
    }

    async getDepartmentById(id: string): Promise<DepartmentDocument> {
        checkObjectId(id);
        return this.departmentRepository.getDepartmentById(id);
    }

    async createDepartment(departmentDto: DepartmentDto) {
        const {
            name,
            description,
            founding_date,
            manager,
            employees,
            projects,
        } = departmentDto;
        const idManager = new mongoose.Types.ObjectId(manager);
        const idEmployees = convertObjectId(employees);
        const idProjects = convertObjectId(projects);

        return this.departmentRepository.create(<DepartmentDocument>{
            name,
            description,
            founding_date,
            manager: idManager,
            employees: idEmployees,
            projects: idProjects,
        });
    }

    async updateDepartment(id: string, departmentDto: DepartmentDto) {
        const {
            name,
            description,
            founding_date,
            manager,
            employees,
            projects,
        } = departmentDto;
        const idEmployees = convertObjectId(employees);
        const idProjects = convertObjectId(projects);
        const idManager = new mongoose.Types.ObjectId(manager);

        return this.departmentRepository.update(id, <DepartmentDocument>{
            name,
            description,
            founding_date,
            manager: idManager,
            employees: idEmployees,
            projects: idProjects,
        });
    }

    async deleteDepartment(id: string) {
        checkObjectId(id);
        return this.departmentRepository.delete(id);
    }

    async getEmployeesDepartment(id: string) {
        checkObjectId(id);
        return this.departmentRepository.getEmployeesDepartment(id);
    }

    async getProjectsDepartment(id: string) {
        checkObjectId(id);
        return this.departmentRepository.getProjectsDepartment(id);
    }
}
