import { HttpException, HttpStatus } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Employee, EmployeeDocument } from "../core/schemas/employee.schema";
import { Project, ProjectDocument } from "src/core/schemas/project.schema";
import { Technology, TechnologyDocument } from "src/core/schemas/technology.schema";
import { Repository } from "src/core/Repository";

export class TechnologyRepository extends Repository<TechnologyDocument> {
    constructor(
        @InjectModel(Technology.name) private technologyModel: Model<TechnologyDocument>,
        @InjectModel(Employee.name) private employeeModel: Model<EmployeeDocument>,
        @InjectModel(Project.name) private projectModel: Model<ProjectDocument>
    ) {
        super(technologyModel);
    }

    async deleteTechnology(id: string) {
        const checkTechnology = await this.technologyModel.find({ _id: id });
        if (checkTechnology) {
            const employees = this.employeeModel.find({technologies: id});
            const projects = this.projectModel.find({technologies: id});

            const checkLinked = (!projects || (await projects).length == 0) && (!employees || (await employees).length == 0);
            if (checkLinked) {
                await this.technologyModel.findOneAndDelete({ _id: id });
                return "Delete successfully!"
            } else {
                throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
            }
        } else {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
    }
}