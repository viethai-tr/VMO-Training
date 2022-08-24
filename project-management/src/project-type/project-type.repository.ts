import { HttpException, HttpStatus } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ProjectType, ProjectTypeDocument } from "src/core/schemas/project-type.schema";
import { Project, ProjectDocument } from "src/core/schemas/project.schema";
import { Repository } from "src/core/Repository";

export class ProjectTypeRepository extends Repository<ProjectTypeDocument> {
    constructor(
        @InjectModel(ProjectType.name) private projectTypeModel: Model<ProjectTypeDocument>,
        @InjectModel(Project.name) private projectModel: Model<ProjectDocument>
    ) {
        super(projectTypeModel);
    }

    async deleteProjectType(id: string) {
        const checkProjectType = this.projectTypeModel.find({_id: id});
        if (checkProjectType) {
            const projects = await this.projectModel.find({type: id});
            if (!projects || projects.length == 0) {
                await this.projectTypeModel.findOneAndDelete({_id: id});
                return "Delete successfully!";
            } else {
                throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
            }
        } else {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
    }
}