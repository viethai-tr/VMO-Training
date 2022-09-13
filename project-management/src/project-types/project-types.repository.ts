import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ProjectType, ProjectTypeDocument } from "../core/schemas/project-type.schema";
import { Repository } from "../core/Repository";

export class ProjectTypeRepository extends Repository<ProjectTypeDocument> {
    constructor(
        @InjectModel(ProjectType.name) private projectTypeModel: Model<ProjectTypeDocument>,
    ) {
        super(projectTypeModel);
    }
}