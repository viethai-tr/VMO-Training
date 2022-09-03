import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { checkObjectId } from '../shared/checkObjectId';
import { EmployeeDto } from '../core/dtos';
import { Department, DepartmentDocument } from '../core/schemas/department.schema';
import { Employee, EmployeeDocument } from '../core/schemas/employee.schema';
import { Project, ProjectDocument } from '../core/schemas/project.schema';
import { convertObjectId } from '../shared/convertObjectId';
import { EmployeeRepository } from './employee.repository';

@Injectable()
export class EmployeeService {
    constructor(
        private employeeRepository: EmployeeRepository,
        @InjectModel(Employee.name) private employeeModel: Model<EmployeeDocument>,
        @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
        @InjectModel(Department.name) private departmentModel: Model<DepartmentDocument>
    ) { }

    async getAllEmployees(limit: number = 0, page: number = 1, search: string = '', sort: string = 'asc', sortBy: string = 'name') {
        return await this.employeeRepository.getAllEmployeesAsync(limit, page, search, sort, sortBy);
    }

    async getEmployeeById(id: string) {
        if (checkObjectId(id))
            return await this.employeeRepository.getEmployeeByIdAsync(id);
    }

    async countEmployees(technology?: string, project?: string) {
        try {
            return await this.employeeRepository.countEmployees(technology, project);
        } catch (err) {
            throw new BadRequestException('Invalid ID');
        }
    }

    async updateEmployee(id: string, employeeDto: EmployeeDto) {
        if (checkObjectId(id)) {
            const { name, dob, address, id_card, phone_number, technologies, experience, languages, certs } = employeeDto;
            const idTechnologies = convertObjectId(technologies);
            return await this.employeeRepository.update(id, <EmployeeDocument>{ name, dob, address, id_card, phone_number, technologies: idTechnologies, experience, languages, certs });
        }
    }

    async createEmployee(employeeDto: EmployeeDto) {
        const { name, dob, address, id_card, phone_number, technologies, experience, languages, certs } = employeeDto;
        const idTechnologies = convertObjectId(technologies);
        return await this.employeeRepository.create(<EmployeeDocument>{ name, dob, address, id_card, phone_number, technologies: idTechnologies, experience, languages, certs });
    }

    async deleteEmployee(id: string) {
        if (checkObjectId(id)) {
            let checkEmployee = await this.employeeModel.findOne({ _id: id });

            if (!checkEmployee)
                throw new HttpException('Not found', HttpStatus.NOT_FOUND);

            const projects = this.projectModel.find({ employees: id });
            const departments = this.departmentModel.find({ employees: id });
            const manager = this.departmentModel.find({ manager: id });

            if (
                (!projects || (await projects).length == 0) &&
                (!departments || (await departments).length == 0) &&
                (!manager || (await manager).length == 0)
            ) {
                await this.employeeRepository.deleteEmployee(id);
                return {
                    HttpStatus: HttpStatus.OK,
                    msg: 'Delete successfully!',
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
