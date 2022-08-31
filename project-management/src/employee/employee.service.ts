import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmployeeDto } from '../core/dtos';
import { Department, DepartmentDocument } from '../core/schemas/department.schema';
import { EmployeeDocument } from '../core/schemas/employee.schema';
import { Project, ProjectDocument } from '../core/schemas/project.schema';
import { convertObjectId } from '../shared/convertObjectId';
import { EmployeeRepository } from './employee.repository';

@Injectable()
export class EmployeeService {
    constructor(
        private employeeRepository: EmployeeRepository,
        @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
        @InjectModel(Department.name) private departmentModel: Model<DepartmentDocument>
    ) { }

    async getAllEmployees(limit?: number, page?: number, sort?: string, sortBy?: string) {
        return await this.employeeRepository.getAllEmployeesAsync(limit, page, sort, sortBy);
    }

    async getEmployeeById(id: string) {
        try {
            let result = await this.employeeRepository.getEmployeeByIdAsync(id);
            return Promise.resolve(result);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    async countEmployees(technology?: string, project?: string) {
        return await this.employeeRepository.countEmployees(technology, project);
    }

    async updateEmployee(id: string, employeeDto: EmployeeDto) {
        const { name, dob, address, id_card, phone_number, technologies, experience, languages, certs } = employeeDto;
        const idTechnologies = convertObjectId(technologies);
        return await this.employeeRepository.update(id, <EmployeeDocument>{ name, dob, address, id_card, phone_number, technologies: idTechnologies, experience, languages, certs });
    }

    async createEmployee(employeeDto: EmployeeDto) {
        const { name, dob, address, id_card, phone_number, technologies, experience, languages, certs } = employeeDto;
        const idTechnologies = convertObjectId(technologies);
        return await this.employeeRepository.create(<EmployeeDocument>{ name, dob, address, id_card, phone_number, technologies: idTechnologies, experience, languages, certs });
    }

    async deleteEmployee(id: string) {
        
        return await this.employeeRepository.deleteEmployee(id);
    }
}
