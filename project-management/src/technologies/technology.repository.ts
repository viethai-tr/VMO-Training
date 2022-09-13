import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Employee, EmployeeDocument } from '../core/schemas/employee.schema';
import { Project, ProjectDocument } from '../core/schemas/project.schema';
import {
    Technology,
    TechnologyDocument,
} from '../core/schemas/technology.schema';
import { Repository } from '../core/Repository';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

export class TechnologyRepository extends Repository<TechnologyDocument> {
    constructor(
        @InjectModel(Technology.name)
        private technologyModel: SoftDeleteModel<TechnologyDocument>,
        @InjectModel(Employee.name)
        private employeeModel: Model<EmployeeDocument>,
        @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    ) {
        super(technologyModel);
    }

    async deleteTechnology(id: string) {
        const checkTechnology = await this.technologyModel.find({ _id: id });
        if (checkTechnology) {
            const employees = this.employeeModel.find({ technologies: id });
            const projects = this.projectModel.find({ technologies: id });

            const checkLinked =
                (!projects || (await projects).length == 0) &&
                (!employees || (await employees).length == 0);
            if (checkLinked) {
                await this.technologyModel.softDelete({ _id: id });
            } else {
                throw new BadRequestException('Cannot delete');
            }
        } else {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
    }

    async restoreTechnology(id: string) {
        return this.technologyModel.restore({ _id: id });
    }
}
