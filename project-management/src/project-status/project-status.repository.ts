import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ProjectStatus, ProjectStatusDocument } from "src/core/schemas/project-status.schema";
import { Repository } from "src/core/Repository";

@Injectable()
export class ProjectStatusRepository extends Repository<ProjectStatusDocument> {
    constructor(
        @InjectModel(ProjectStatus.name) private projectStatusModel: Model<ProjectStatusDocument>
    ) {
        super(projectStatusModel);
    }

    async deleteProjectStatus(id: string) {
        const checkProjectType = this.projectStatusModel.find({_id: id});
        if (checkProjectType) {
            const projects = await this.projectStatusModel.find({type: id});
            if (!projects || projects.length == 0) {
                await this.projectStatusModel.findOneAndDelete({_id: id});
                return "Delete successfully!";
            } else {
                throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
            }
        } else {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
    }
}