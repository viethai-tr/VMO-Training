import { Module } from '@nestjs/common';
import { ProjectStatusService } from './project-status.service';
import { ProjectStatusController } from './project-status.controller';
import { ProjectStatusRepository } from './project-status.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectStatus, ProjectStatusSchema } from 'src/core/schemas/project-status.schema';

@Module({
  providers: [ProjectStatusService, ProjectStatusRepository],
  controllers: [ProjectStatusController],
  imports: [
    MongooseModule.forFeature([{name: ProjectStatus.name, schema: ProjectStatusSchema}])
  ]
})
export class ProjectStatusModule {}
