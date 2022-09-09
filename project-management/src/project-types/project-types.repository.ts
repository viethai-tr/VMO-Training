import { HttpException, HttpStatus } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ProjectType, ProjectTypeDocument } from "src/core/schemas/project-type.schema";
import { Project, ProjectDocument } from "src/core/schemas/project.schema";
import { Repository } from "src/core/Repository";

export class ProjectTypeRepository extends Repository<ProjectTypeDocument> {
    constructor(
        @InjectModel(ProjectType.name) private projectTypeModel: Model<ProjectTypeDocument>,
    ) {
        super(projectTypeModel);
    }
}