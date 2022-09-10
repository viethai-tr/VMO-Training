import {
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import mongoose, { Model, Types } from 'mongoose';
import { Employee, EmployeeDocument } from '../core/schemas/employee.schema';
import { ProjectDto } from '../core/dtos/project.dto';
import { Project, ProjectDocument } from '../core/schemas/project.schema';
import { convertObjectId } from '../shared/utils/convertObjectId';
import { ProjectRepository } from './projects.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Department, DepartmentDocument } from '../core/schemas/department.schema';
import { checkValidDate } from '../shared/utils/checkValidDate';
import {
    RESPOND,
    RESPOND_CREATED,
    RESPOND_GOT,
} from '../shared/const/respond.const';
import { Customer, CustomerDocument } from '../core/schemas/customer.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class ProjectService {
    constructor(
        private projectRepository: ProjectRepository,
        @InjectModel(Employee.name)
        private employeeModel: SoftDeleteModel<EmployeeDocument>,
        @InjectModel(Department.name)
        private departmentModel: SoftDeleteModel<DepartmentDocument>,
        @InjectModel(Customer.name)
        private customerModel: SoftDeleteModel<CustomerDocument>,
        @InjectModel(Project.name) private projectModel: SoftDeleteModel<ProjectDocument>
    ) {}

    async getAllProjects(
        limit?: string,
        page?: string,
        search?: string,
        sort?: string,
        sortBy?: string,
    ) {
        return this.projectRepository.getAllProjects(
            limit,
            page,
            search,
            sort,
            sortBy,
        );
    }

    async getProjectById(id: Types.ObjectId) {
        const curProject = await this.projectRepository.getProjectById(id);

        return RESPOND(RESPOND_GOT, curProject);
    }

    async getEmployeesProject(id: Types.ObjectId) {
        const listEmployees = await this.projectRepository.getEmployeesProject(
            id,
        );

        return RESPOND(RESPOND_GOT, listEmployees);
    }

    async countProjects(
        type?: string,
        status?: string,
        customer?: string,
        technology?: string,
        startingDate?: Date,
    ) {
        let query = {
            type: type,
            status: status,
            customer: customer,
            technologies: technology,
            starting_date: startingDate,
            isDeleted: false,
        };

        Object.keys(query).forEach((key) =>
            query[key] === undefined ? delete query[key] : {},
        );

        if (startingDate) checkValidDate(startingDate);

        return this.projectRepository.countProjects(query);
    }

    async createProject(projectDto: ProjectDto) {
        let {
            name,
            description,
            type,
            status,
            technologies,
            employees,
            customer,
            starting_date,
        } = projectDto;

        technologies = [...new Set(technologies)];
        employees = [...new Set(employees)];

        checkValidDate(starting_date);

        const idType = new mongoose.Types.ObjectId(type);
        const idStatus = new mongoose.Types.ObjectId(status);
        const idTechnologies = convertObjectId(technologies);
        const idEmployees = convertObjectId(employees);
        const idCustomer = new mongoose.Types.ObjectId(customer);

        let checkCustomerExists = this.customerModel.find({_id: idCustomer});
        if (!checkCustomerExists) throw new NotFoundException('Customer not exists');

        const newProject = await this.projectRepository.create(<
            ProjectDocument
        >{
            name,
            description,
            type: idType,
            status: idStatus,
            technologies: idTechnologies,
            employees: idEmployees,
            customer: idCustomer,
            starting_date,
        });

        await this.employeeModel.updateMany(
            { _id: { $in: employees } },
            { $push: { projects: newProject._id } },
            { multi: true, upsert: true },
        );

        return RESPOND(RESPOND_CREATED, newProject);
    }

    async updateProject(id: Types.ObjectId, projectDto: ProjectDto) {

        let {
            name,
            description,
            type,
            status,
            technologies,
            employees,
            customer,
            starting_date,
        } = projectDto;

        technologies = [...new Set(technologies)];
        employees = [...new Set(employees)];

        checkValidDate(starting_date);

        const idType = new mongoose.Types.ObjectId(type);
        const idStatus = new mongoose.Types.ObjectId(status);
        const idTechnologies = convertObjectId(technologies);
        const idEmployees = convertObjectId(employees);
        const idCustomer = new mongoose.Types.ObjectId(customer);

        let checkCustomerExists = this.customerModel.find({_id: idCustomer});
        if (!checkCustomerExists) throw new NotFoundException('Customer not exists');

        const listEmployees = (await this.projectRepository.getById(id))
            .employees;

        await this.employeeModel.updateMany(
            { _id: { $in: listEmployees } },
            { $pull: { projects: id } },
        );

        const updatedProject = await this.projectRepository.update(id, <
            ProjectDocument
        >{
            name,
            description,
            type: idType,
            status: idStatus,
            technologies: idTechnologies,
            employees: idEmployees,
            customer: idCustomer,
            starting_date,
        });

        await this.employeeModel.updateMany(
            { _id: { $in: employees } },
            { $push: { projects: id } },
            { multi: true, upsert: true },
        );

    }

    async deleteProject(id: Types.ObjectId) {
        
        const checkProject = await this.projectRepository.getById(id);

        if (!checkProject)
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);

        const checkDepartment = this.departmentModel.find({ projects: id });
        if (!checkDepartment || (await checkDepartment).length == 0) {
            const listEmployees = (await this.projectRepository.getById(id))
                .employees;
                await this.employeeModel.updateMany(
                    { _id: { $in: listEmployees } },
                    { $pull: { projects: id } },
                );
            return this.projectRepository.deleteProject(id);
        } else {
            throw new HttpException('Cannot be deleted', HttpStatus.FORBIDDEN);
        }
    }

    async restoreProject(id: Types.ObjectId) {
        return this.projectModel.restore({_id: id});
    }

    async findByCondition(query) {
        return this.projectRepository.findByCondition(query);
    }
}
