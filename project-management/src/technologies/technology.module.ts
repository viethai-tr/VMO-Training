import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Employee, EmployeeSchema } from '../core/schemas/employee.schema';
import { Project, ProjectSchema } from '../core/schemas/project.schema';
import { Technology, TechnologySchema } from '../core/schemas/technology.schema';
import { TechnologyController } from './technology.controller';
import { TechnologyRepository } from './technology.repository';
import { TechnologyService } from './technology.service';

@Module({
  controllers: [TechnologyController],
  providers: [TechnologyService, TechnologyRepository],
  imports: [
    MongooseModule.forFeature([
      {name: Technology.name, schema: TechnologySchema},
      {name: Employee.name, schema: EmployeeSchema},
      {name: Project.name, schema: ProjectSchema}
    ])
  ]
})
export class TechnologyModule {}
