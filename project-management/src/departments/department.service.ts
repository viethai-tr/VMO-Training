import { Injectable, NotFoundException } from '@nestjs/common';
import mongoose, { Model, Types } from 'mongoose';
import { DepartmentDto } from '../core/dtos';
import {
    Department,
    DepartmentDocument,
} from '../core/schemas/department.schema';
import { convertObjectId } from '../shared/utils/convertObjectId';
import { DepartmentRepository } from './department.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Employee, EmployeeDocument } from '../core/schemas/employee.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { UpdateDepartmentDto } from './dtos/update.department.dto';

@Injectable()
export class DepartmentService {
    constructor(
        private departmentRepository: DepartmentRepository,
        @InjectModel(Employee.name)
        private employeeModel: Model<EmployeeDocument>,
        @InjectModel(Department.name)
        private departmentModel: SoftDeleteModel<DepartmentDocument>,
    ) {}

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
        return this.departmentRepository.getDepartmentById(id);
    }

    async createDepartment(departmentDto: DepartmentDto) {
        let { name, description, founding_date, manager, employees, projects } =
            departmentDto;
        const idManager = new mongoose.Types.ObjectId(manager);

        let checkManagerExists = await this.employeeModel.find({
            _id: idManager,
            isDeleted: false,
        });
        if (!checkManagerExists || checkManagerExists.length === 0)
            throw new NotFoundException('Manager does not exist');

        employees = [...new Set(employees)];
        projects = [...new Set(projects)];

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

    async updateDepartment(
        id: string,
        updateDepartmentDto: UpdateDepartmentDto,
    ) {
        let { name, description, founding_date, manager, employees, projects } =
            updateDepartmentDto;

        let idManager: Types.ObjectId;
        let idEmployees: Types.ObjectId[];
        let idProjects: Types.ObjectId[];

        if (manager) {
            idManager = new mongoose.Types.ObjectId(manager);
            let checkManagerExists = await this.employeeModel.find({
                _id: idManager,
                isDeleted: false,
            });
            if (!checkManagerExists || checkManagerExists.length === 0)
                throw new NotFoundException('Manager does not exist');
        }

        if (employees) {
            employees = [...new Set(employees)];
            idEmployees = convertObjectId(employees);
        }

        if (projects) {
            projects = [...new Set(projects)];
            idProjects = convertObjectId(projects);
        }

        let query = {
            name,
            description,
            founding_date,
            manager: idManager,
            employees: idEmployees,
            projects: idProjects,
        };

        Object.keys(query).forEach((key) =>
            query[key] === undefined ? delete query[key] : {},
        );

        return this.departmentRepository.update(id, query);
    }

    async deleteDepartment(id: string) {
        return this.departmentModel.softDelete({ _id: id });
    }

    async restoreDepartment(id: string) {
        return this.departmentModel.restore({ _id: id });
    }

    async getEmployeesDepartment(id: string) {
        return this.departmentRepository.getEmployeesDepartment(id);
    }

    async getProjectsDepartment(id: string) {
        return this.departmentRepository.getProjectsDepartment(id);
    }

    async findByCondition(query) {
        return this.departmentRepository.findByCondition(query);
    }
}
