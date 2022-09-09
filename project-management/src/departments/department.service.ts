import { Injectable } from '@nestjs/common';
import mongoose, { Types } from 'mongoose';
import { DepartmentDto } from '../core/dtos';
import { DepartmentDocument } from '../core/schemas/department.schema';
import {
    RESPOND,
    RESPOND_CREATED,
    RESPOND_DELETED,
    RESPOND_GOT,
    RESPOND_UPDATED,
} from '../shared/const/respond.const';
import { checkObjectId } from '../shared/utils/checkObjectId';
import { checkValidDate } from '../shared/utils/checkValidDate';
import { convertObjectId } from '../shared/utils/convertObjectId';
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

    async getDepartmentById(id: Types.ObjectId) {
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

        const idEmployees = convertObjectId(employees);

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

    async updateDepartment(id: Types.ObjectId, departmentDto: DepartmentDto) {
        let { name, description, founding_date, manager, employees, projects } =
            departmentDto;

        const idManager = new mongoose.Types.ObjectId(manager);

        employees = [...new Set(employees)];
        projects = [...new Set(projects)];

        const idEmployees = convertObjectId(employees);

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

    async deleteDepartment(id: Types.ObjectId) {
        await this.departmentRepository.delete(id);

        return RESPOND(RESPOND_DELETED, {
            id: id,
        });
    }

    async getEmployeesDepartment(id: Types.ObjectId) {
        const listEmployees =
            await this.departmentRepository.getEmployeesDepartment(id);

        return RESPOND(RESPOND_GOT, listEmployees);
    }

    async getProjectsDepartment(id: Types.ObjectId) {
        const listProjects =
            await this.departmentRepository.getProjectsDepartment(id);

        return RESPOND(RESPOND_GOT, listProjects);
    }

    async findByCondition(query) {
        return this.departmentRepository.findByCondition(query);
    }
}
