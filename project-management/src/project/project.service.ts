import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Injectable,
    Query,
} from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { Employee, EmployeeDocument } from '../core/schemas/employee.schema';
import { ProjectDto } from '../core/dtos/project.dto';
import { Project, ProjectDocument } from '../core/schemas/project.schema';
import { convertObjectId } from '../shared/utils/convertObjectId';
import { ProjectRepository } from './project.repository';
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
} from 'src/shared/const/respond.const';

@Injectable()
export class ProjectService {
    constructor(
        private projectRepository: ProjectRepository,
        @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
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

    async getProjectById(id: string) {
        checkObjectId(id);
        const curProject = await this.projectRepository.getProjectById(id);

        return RESPOND(RESPOND_GOT, curProject);
    }

    async getEmployeesProject(id: string) {
        checkObjectId(id);
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
        startingDate?: string,
    ) {
        let oriQuery = {
            type: type,
            status: status,
            customer: customer,
            technologies: technology,
            starting_date: startingDate,
        };

        const query = Object.fromEntries(
            Object.entries(oriQuery).filter(
                ([_, v]) => v != null && v != '' && v != undefined,
            ),
        );

        for (let queryProperty in query) {
            if (queryProperty != 'starting_date')
                checkObjectId(query[queryProperty]);
        }

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

        checkObjectId(type);
        checkObjectId(status);
        checkObjectId(customer);
        for (let technology of technologies) checkObjectId(technology);
        for (let employee of employees) checkObjectId(employee);

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

    async updateProject(id: string, projectDto: ProjectDto) {
        checkObjectId(id);

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

        checkObjectId(type);
        checkObjectId(status);
        checkObjectId(customer);
        for (let technology of technologies) checkObjectId(technology);
        for (let employee of employees) checkObjectId(employee);

        checkValidDate(starting_date);

        const idType = new mongoose.Types.ObjectId(type);
        const idStatus = new mongoose.Types.ObjectId(status);
        const idTechnologies = convertObjectId(technologies);
        const idEmployees = convertObjectId(employees);
        const idCustomer = new mongoose.Types.ObjectId(customer);

        const listEmployees = (await this.projectModel.findOne({ _id: id }))
            .employees;

        await this.employeeModel.updateMany(
            { _id: { $in: listEmployees } },
            { $pull: { projects: new mongoose.Types.ObjectId(id) } },
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
            { $push: { projects: new mongoose.Types.ObjectId(id) } },
            { multi: true, upsert: true },
        );

        return RESPOND(RESPOND_UPDATED, updatedProject);
    }

    async deleteProject(id: string) {
        checkObjectId(id);
        const checkProject = await this.projectModel.findOne({ _id: id });

        if (!checkProject)
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);

        const checkDepartment = this.departmentModel.find({ projects: id });
        if (!checkDepartment || (await checkDepartment).length == 0) {
            const listEmployees = (await this.projectModel.findOne({ _id: id }))
                .employees;
            await this.projectModel.findOneAndDelete({ _id: id });
            await this.employeeModel.updateMany(
                { _id: { $in: listEmployees } },
                { $pull: { projects: id } },
            );

            return RESPOND(RESPOND_DELETED, { id: id });
        } else {
            throw new HttpException('Cannot be deleted', HttpStatus.FORBIDDEN);
        }
    }
}
