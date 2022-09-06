import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { check } from 'prettier';
import { DepartmentDto } from 'src/core/dtos';
import { DepartmentDocument } from 'src/core/schemas/department.schema';
import {
    RESPOND,
    RESPOND_CREATED,
    RESPOND_DELETED,
    RESPOND_GOT,
    RESPOND_UPDATED,
} from 'src/shared/const/respond.const';
import { checkObjectId } from 'src/shared/utils/checkObjectId';
import { checkValidDate } from 'src/shared/utils/checkValidDate';
import { convertObjectId } from 'src/shared/utils/convertObjectId';
import { DepartmentRepository } from './department.repository';

@Injectable()
export class DepartmentService {
    constructor(private departmentRepository: DepartmentRepository) {}

    async getAllDepartments(
        limit?: string,
        page?: string,
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

    async getDepartmentById(id: string) {
        checkObjectId(id);
        const curDepartment = await this.departmentRepository.getDepartmentById(
            id,
        );

        return RESPOND(RESPOND_GOT, curDepartment);
    }

    async createDepartment(departmentDto: DepartmentDto) {
        let { name, description, founding_date, manager, employees, projects } =
            departmentDto;

        checkObjectId(manager);
        const idManager = new mongoose.Types.ObjectId(manager);

        employees = [...new Set(employees)];
        projects = [...new Set(projects)];

        for (let employee of employees) {
            checkObjectId(employee);
        }
        const idEmployees = convertObjectId(employees);

        for (let project of projects) {
            checkObjectId(project);
        }
        const idProjects = convertObjectId(projects);

        checkValidDate(founding_date);

        const newDepartment = await this.departmentRepository.create(<
            DepartmentDocument
        >{
            name,
            description,
            founding_date,
            manager: idManager,
            employees: idEmployees,
            projects: idProjects,
        });

        return RESPOND(RESPOND_CREATED, newDepartment);
    }

    async updateDepartment(id: string, departmentDto: DepartmentDto) {
        let { name, description, founding_date, manager, employees, projects } =
            departmentDto;

        checkObjectId(manager);
        const idManager = new mongoose.Types.ObjectId(manager);

        employees = [...new Set(employees)];
        projects = [...new Set(projects)];

        for (let employee of employees) {
            checkObjectId(employee);
        }
        const idEmployees = convertObjectId(employees);

        for (let project of projects) {
            checkObjectId(project);
        }
        const idProjects = convertObjectId(projects);

        checkValidDate(founding_date);

        const updatedDepartment = await this.departmentRepository.update(id, <
            DepartmentDocument
        >{
            name,
            description,
            founding_date,
            manager: idManager,
            employees: idEmployees,
            projects: idProjects,
        });

        return RESPOND(RESPOND_UPDATED, updatedDepartment);
    }

    async deleteDepartment(id: string) {
        checkObjectId(id);
        await this.departmentRepository.delete(id);

        return RESPOND(RESPOND_DELETED, {
            id: id,
        });
    }

    async getEmployeesDepartment(id: string) {
        checkObjectId(id);
        const listEmployees =
            await this.departmentRepository.getEmployeesDepartment(id);

        return RESPOND(RESPOND_GOT, listEmployees);
    }

    async getProjectsDepartment(id: string) {
        checkObjectId(id);
        const listProjects =
            await this.departmentRepository.getProjectsDepartment(id);

        return RESPOND(RESPOND_GOT, listProjects);
    }
}
