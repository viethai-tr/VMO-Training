import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import mongoose, { Model, Types } from 'mongoose';
import { Employee, EmployeeDocument } from '../core/schemas/employee.schema';
import { ProjectDto } from './dtos/create.project.dto';
import { Project, ProjectDocument } from '../core/schemas/project.schema';
import { convertObjectId } from '../shared/utils/convertObjectId';
import { ProjectRepository } from './project.repository';
import { InjectModel } from '@nestjs/mongoose';
import {
    Department,
    DepartmentDocument,
} from '../core/schemas/department.schema';
import { checkValidDate } from '../shared/utils/checkValidDate';
import {
    RESPOND,
    RESPOND_CREATED,
    RESPOND_GOT,
} from '../shared/const/respond.const';
import { Customer, CustomerDocument } from '../core/schemas/customer.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { UpdateProjectDto } from './dtos/update.project.dto';
import {
    ProjectType,
    ProjectTypeDocument,
} from '../core/schemas/project-type.schema';
import {
    ProjectStatus,
    ProjectStatusDocument,
} from '../core/schemas/project-status.schema';
import {
    Technology,
    TechnologyDocument,
} from '../core/schemas/technology.schema';

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
        @InjectModel(Project.name)
        private projectModel: SoftDeleteModel<ProjectDocument>,
        @InjectModel(ProjectType.name)
        private projectTypeModel: SoftDeleteModel<ProjectTypeDocument>,
        @InjectModel(ProjectStatus.name)
        private projectStatusModel: SoftDeleteModel<ProjectStatusDocument>,
        @InjectModel(Technology.name)
        private technologyModel: SoftDeleteModel<TechnologyDocument>,
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

    async getProjectById(id: string) {
        const curProject = await this.projectRepository.getProjectById(id);

        return RESPOND(RESPOND_GOT, curProject);
    }

    async getEmployeesProject(id: string) {
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

        let checkCustomerExists = this.customerModel.find({ _id: idCustomer });
        if (!checkCustomerExists)
            throw new NotFoundException('Customer not exists');

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

        return this.employeeModel.updateMany(
            { _id: { $in: employees } },
            { $push: { projects: newProject._id } },
            { multi: true, upsert: true },
        );
    }

    async updateProject(id: string, updateProjectDto: UpdateProjectDto) {
        let {
            name,
            description,
            type,
            status,
            technologies,
            employees,
            customer,
            starting_date,
        } = updateProjectDto;

        let idType: Types.ObjectId;
        let idStatus: Types.ObjectId;
        let idTechnologies: Types.ObjectId[];
        let idEmployees: Types.ObjectId[];
        let idCustomer: Types.ObjectId;

        if (technologies) {
            technologies = [...new Set(technologies)];
            idTechnologies = convertObjectId(technologies);
        }

        if (employees) {
            employees = [...new Set(employees)];
            idEmployees = convertObjectId(employees);
        }

        if (type) idType = new mongoose.Types.ObjectId(type);

        if (status) idStatus = new mongoose.Types.ObjectId(status);

        if (customer) {
            idCustomer = new mongoose.Types.ObjectId(customer);
            let checkCustomerExists = this.customerModel.find({
                _id: idCustomer,
                isDeleted: false,
            });
            if (!checkCustomerExists)
                throw new NotFoundException('Customer not exists');
        }

        const listEmployees = (await this.projectRepository.getById(id))
            .employees;

        await this.employeeModel.updateMany(
            { _id: { $in: listEmployees } },
            { $pull: { projects: id } },
        );

        await this.employeeModel.updateMany(
            { _id: { $in: employees } },
            { $push: { projects: id } },
            { multi: true, upsert: true },
        );

        return this.projectRepository.update(id, {
            name,
            description,
            type: idType,
            status: idStatus,
            technologies: idTechnologies,
            employees: idEmployees,
            customer: idCustomer,
            starting_date,
        });
    }

    async deleteProject(id: string) {
        const checkProject = await this.projectRepository.getById(id);

        if (!checkProject)
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);

        const checkDepartment = this.departmentModel.find({ projects: id });
        if (!checkDepartment || (await checkDepartment).length == 0) {
            const listEmployees = (await this.projectRepository.getById(id))
                .employees;
            await this.employeeModel.updateMany(
                { _id: { $in: listEmployees } },
                { $pull: { projects: id }, $push: { deletedProjects: id } },
            );

            return this.projectRepository.deleteProject(id);
        } else {
            throw new HttpException('Cannot be deleted', HttpStatus.FORBIDDEN);
        }
    }

    async restoreProject(id: string) {
        const project = await this.projectRepository.getDeletedProject(id);
        let { type, status, technologies, employees, customer } = project;

        const checkType = await this.projectTypeModel.find({
            _id: type,
            isDeleted: false,
        });
        if (!checkType) throw new BadRequestException('Cannot recover project');

        const checkStatus = await this.projectStatusModel.find({
            _id: status,
            isDeleted: false,
        });
        if (!checkStatus)
            throw new BadRequestException('Cannot recover project');

        const checkTechnologies = await this.technologyModel.countDocuments({
            _id: { $in: technologies },
            isDeleted: false,
        });
        if (checkTechnologies < technologies.length)
            throw new BadRequestException('Cannot recover project');

        const checkEmployee = await this.employeeModel.countDocuments({
            _id: { $in: employees },
            isDeleted: false,
        });
        if (checkEmployee < employees.length)
            throw new BadRequestException('Cannot recover project');

        const checkCustomer = await this.customerModel.countDocuments({
            _id: customer,
            isDeleted: false,
        });
        if (!checkCustomer)
            throw new BadRequestException('Cannot recover project');

        await this.employeeModel.updateMany(
            { _id: { $in: employees } },
            { $pull: { deleteProjects: id }, $push: { projects: id } },
        );
        return this.projectModel.restore({ _id: id });
    }

    async findByCondition(query) {
        return this.projectRepository.findByCondition(query);
    }
}
