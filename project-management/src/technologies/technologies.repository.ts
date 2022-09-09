import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Employee, EmployeeDocument } from '../core/schemas/employee.schema';
import { Project, ProjectDocument } from '../core/schemas/project.schema';
import {
    Technology,
    TechnologyDocument,
} from '../core/schemas/technology.schema';
import { Repository } from '../core/Repository';
import { RESPOND, RESPOND_DELETED } from 'src/shared/const/respond.const';

export class TechnologyRepository extends Repository<TechnologyDocument> {
    constructor(
        @InjectModel(Technology.name)
        private technologyModel: Model<TechnologyDocument>,
        @InjectModel(Employee.name)
        private employeeModel: Model<EmployeeDocument>,
        @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    ) {
        super(technologyModel);
    }

    async deleteTechnology(id: Types.ObjectId) {
        const checkTechnology = await this.technologyModel.find({ _id: id });
        if (checkTechnology) {
            const employees = this.employeeModel.find({ technologies: id });
            const projects = this.projectModel.find({ technologies: id });

            const checkLinked =
                (!projects || (await projects).length == 0) &&
                (!employees || (await employees).length == 0);
            if (checkLinked) {
                await this.technologyModel.findOneAndUpdate({ _id: id }, {deleted: true});
                return RESPOND(RESPOND_DELETED, {
                    id: id,
                });
            } else {
                throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
            }
        } else {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
    }
}
