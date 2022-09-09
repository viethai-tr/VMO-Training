import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
    ProjectType,
    ProjectTypeSchema,
} from '../core/schemas/project-type.schema';
import { ProjectModule } from '../projects/project.module';
import { ProjectTypeController } from './project-type.controller';
import { ProjectTypeRepository } from './project-types.repository';
import { ProjectTypeService } from './project-types.service';

@Module({
    controllers: [ProjectTypeController],
    providers: [ProjectTypeService, ProjectTypeRepository],
    imports: [
        MongooseModule.forFeature([
            { name: ProjectType.name, schema: ProjectTypeSchema },
        ]),

        ProjectModule
    ],
})
export class ProjectTypeModule {}
