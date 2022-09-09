import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Employee, EmployeeSchema } from 'src/core/schemas/employee.schema';
import { Project, ProjectSchema } from 'src/core/schemas/project.schema';
import { Technology, TechnologySchema } from 'src/core/schemas/technology.schema';
import { TechnologyController } from './technologies.controller';
import { TechnologyRepository } from './technologies.repository';
import { TechnologyService } from './technologies.service';

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
