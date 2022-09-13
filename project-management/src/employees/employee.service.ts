import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { EmployeeDto } from '../core/dtos';
import { Employee, EmployeeDocument } from '../core/schemas/employee.schema';
import { convertObjectId } from '../shared/utils/convertObjectId';
import { EmployeeRepository } from './employee.repository';
import { ProjectService } from '../projects/project.service';
import { DepartmentService } from '../departments/department.service';
import { Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { UpdateEmployeeDto } from './dtos/update.employee.dto';

@Injectable()
export class EmployeeService {
    constructor(
        private employeeRepository: EmployeeRepository,
        private projectService: ProjectService,
        private departmentService: DepartmentService,
        @InjectModel(Employee.name)
        private employeeModel: SoftDeleteModel<EmployeeDocument>,
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

    async getEmployeeById(id: string) {
        return this.employeeRepository.getEmployeeByIdAsync(id);
    }

    async countEmployees(technology?: string, project?: string) {
        return this.employeeRepository.countEmployees(technology, project);
    }

    async updateEmployee(id: string, updateEmployeeDto: UpdateEmployeeDto) {
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
        } = updateEmployeeDto;

        let idTechnologies: Types.ObjectId[];

        if (technologies) {
            technologies = [...new Set(technologies)];
            idTechnologies = convertObjectId(technologies);
        }

        return this.employeeRepository.update(id, <EmployeeDocument>{
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

        return this.employeeRepository.create(<EmployeeDocument>{
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
    }

    async deleteEmployee(id: string) {
        let checkEmployee = await this.employeeRepository.getById(id);

        if (!checkEmployee) throw new NotFoundException('Employee not exist');

        const projects = this.projectService.findByCondition({
            employees: id,
            isDeleted: false,
        });
        const departments = this.departmentService.findByCondition({
            employees: id,
            isDeleted: false,
        });
        const manager = this.departmentService.findByCondition({
            manager: id,
            isDeleted: false,
        });

        if (
            (!projects || (await projects).length == 0) &&
            (!departments || (await departments).length == 0) &&
            (!manager || (await manager).length == 0)
        ) {
            return this.employeeModel.softDelete({ _id: id });
        } else {
            throw new BadRequestException('Cannot delete');
        }
    }

    async restoreEmployee(id: string) {
        return this.employeeModel.restore({ _id: id });
    }
}
