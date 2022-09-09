import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Injectable,
    Query,
} from '@nestjs/common';
import mongoose, { Model, Types } from 'mongoose';
import { Employee, EmployeeDocument } from '../core/schemas/employee.schema';
import { ProjectDto } from '../core/dtos/project.dto';
import { Project, ProjectDocument } from '../core/schemas/project.schema';
import { convertObjectId } from '../shared/utils/convertObjectId';
import { ProjectRepository } from './projects.repository';
import { checkObjectId } from '../shared/utils/checkObjectId';
import { InjectModel } from '@nestjs/mongoose';
import { Department } from '../core/schemas/department.schema';
import { checkValidDate } from '../shared/utils/checkValidDate';
import {
    RESPOND,
    RESPOND_CREATED,
    RESPOND_DELETED,
    RESPOND_GOT,
    RESPOND_UPDATED,
} from '../shared/const/respond.const';

@Injectable()
export class ProjectService {
    constructor(
        private projectRepository: ProjectRepository,
        @InjectModel(Employee.name)
        private employeeModel: Model<EmployeeDocument>,
        @InjectModel(Department.name)
        private departmentModel: Model<ProjectDocument>,
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

        return RESPOND(RESPOND_UPDATED, updatedProject);
    }

    async deleteProject(id: Types.ObjectId) {
        
        const checkProject = await this.projectRepository.getById(id);

        if (!checkProject)
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);

        const checkDepartment = this.departmentModel.find({ projects: id });
        if (!checkDepartment || (await checkDepartment).length == 0) {
            const listEmployees = (await this.projectRepository.getById(id))
                .employees;
            await this.projectRepository.deleteProject(id);
            await this.employeeModel.updateMany(
                { _id: { $in: listEmployees } },
                { $pull: { projects: id } },
            );

            return RESPOND(RESPOND_DELETED, { id: id });
        } else {
            throw new HttpException('Cannot be deleted', HttpStatus.FORBIDDEN);
        }
    }

    async findByCondition(query) {
        return this.projectRepository.findByCondition(query);
    }
}
