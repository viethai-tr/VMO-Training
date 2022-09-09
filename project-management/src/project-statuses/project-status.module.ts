import { Module } from '@nestjs/common';
import { ProjectStatusService } from './project-status.service';
import { ProjectStatusController } from './project-status.controller';
import { ProjectStatusRepository } from './project-status.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectStatus, ProjectStatusSchema } from '../core/schemas/project-status.schema';
import { Project, ProjectSchema } from '../core/schemas/project.schema';
import { ProjectModule } from '../projects/project.module';

@Module({
  providers: [ProjectStatusService, ProjectStatusRepository],
  controllers: [ProjectStatusController],
  imports: [
    MongooseModule.forFeature([
      {name: ProjectStatus.name, schema: ProjectStatusSchema},
    ]),
    ProjectModule
  ]
})
export class ProjectStatusModule {}
