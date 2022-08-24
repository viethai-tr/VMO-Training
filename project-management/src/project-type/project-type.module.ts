import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectType, ProjectTypeSchema } from 'src/core/schemas/project-type.schema';
import { Project, ProjectSchema } from 'src/core/schemas/project.schema';
import { ProjectTypeController } from './project-type.controller';
import { ProjectTypeRepository } from './project-type.repository';
import { ProjectTypeService } from './project-type.service';

@Module({
  controllers: [ProjectTypeController],
  providers: [ProjectTypeService, ProjectTypeRepository],
  imports: [MongooseModule.forFeature([
    { name: ProjectType.name, schema: ProjectTypeSchema },
    { name: Project.name, schema: ProjectSchema }
  ])]
})

export class ProjectTypeModule {}
