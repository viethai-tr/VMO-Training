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
}