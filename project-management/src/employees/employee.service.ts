import {
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { EmployeeDto } from '../core/dtos';
import { EmployeeDocument } from '../core/schemas/employee.schema';
import { convertObjectId } from '../shared/utils/convertObjectId';
import { EmployeeRepository } from './employee.repository';
import {
    RESPOND,
    RESPOND_CREATED,
    RESPOND_DELETED,
    RESPOND_GOT,
    RESPOND_UPDATED,
} from '../shared/const/respond.const';
import { ProjectService } from '../projects/projects.service';
import { DepartmentService } from '../departments/department.service';
import { checkValidDate } from '../shared/utils/checkValidDate';
import { Types } from 'mongoose';

@Injectable()
export class EmployeeService {
    constructor(
        private employeeRepository: EmployeeRepository,
        private projectService: ProjectService,
        private departmentService: DepartmentService
    ) {}

    async getAllEmployees(
        limit?: string,
        page?: string,
        search?: string,
        sort?: string,
        sortBy?: string,
    ) {
        return this.employeeRepository.getAllEmployeesAsync(
            limit,
            page,
            search,
            sort,
            sortBy,
        );
    }

    async getEmployeeById(id: Types.ObjectId) {
        const curEmployee = await this.employeeRepository.getEmployeeByIdAsync(
            id,
        );

        return RESPOND(RESPOND_GOT, curEmployee);
    }

    async countEmployees(technology?: Types.ObjectId, project?: Types.ObjectId) {
        return this.employeeRepository.countEmployees(technology, project);
    }

    async updateEmployee(id: Types.ObjectId, employeeDto: EmployeeDto) {
        let {
            name,
            dob,
            address,
            id_card,
            phone_number,
            technologies,
            experience,
            languages,
            certs,
        } = employeeDto;

        technologies = [...new Set(technologies)];

        const idTechnologies = convertObjectId(technologies);

        const updatedEmployee = await this.employeeRepository.update(id, <
            EmployeeDocument
        >{
            name,
            dob,
            address,
            id_card,
            phone_number,
            technologies: idTechnologies,
            experience,
            languages,
            certs,
        });

        return RESPOND(RESPOND_UPDATED, updatedEmployee);
    }

    async createEmployee(employeeDto: EmployeeDto) {
        let {
            name,
            dob,
            address,
            id_card,
            phone_number,
            technologies,
            experience,
            languages,
            certs,
        } = employeeDto;

        technologies = [...new Set(technologies)];
        

        const idTechnologies = convertObjectId(technologies);

        checkValidDate(dob);

        const newEmployee = await this.employeeRepository.create(<
            EmployeeDocument
        >{
            name,
            dob,
            address,
            id_card,
            phone_number,
            technologies: idTechnologies,
            experience,
            languages,
            certs,
        });

        return RESPOND(RESPOND_CREATED, newEmployee);
    }

    async deleteEmployee(id: Types.ObjectId) {
        let checkEmployee = await this.employeeRepository.getById(id);

        if (!checkEmployee) throw new NotFoundException('Employee not exist');

        const projects = this.projectService.findByCondition({employees: id});
        const departments = this.departmentService.findByCondition({employees: id});
        const manager = this.departmentService.findByCondition({manager: id});

        if (
            (!projects || (await projects).length == 0) &&
            (!departments || (await departments).length == 0) &&
            (!manager || (await manager).length == 0)
        ) {
            await this.employeeRepository.deleteEmployee(id);
            return RESPOND(RESPOND_DELETED, {
                id: id,
            });
        } else {
            throw new HttpException('Cannot be deleted', HttpStatus.FORBIDDEN);
        }
    }
}
