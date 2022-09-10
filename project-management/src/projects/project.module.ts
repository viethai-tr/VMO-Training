import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from '../core/schemas/customer.schema';
import { Department, DepartmentSchema } from '../core/schemas/department.schema';
import { Employee, EmployeeSchema } from '../core/schemas/employee.schema';
import { ProjectStatus, ProjectStatusSchema } from '../core/schemas/project-status.schema';
import { ProjectType, ProjectTypeSchema } from '../core/schemas/project-type.schema';
import { Project, ProjectSchema } from '../core/schemas/project.schema';
import { Technology, TechnologySchema } from '../core/schemas/technology.schema';
import { ProjectController } from './project.controller';
import { ProjectRepository } from './project.repository';
import { ProjectService } from './project.service';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService, ProjectRepository],
  imports: [
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      { name: ProjectType.name, schema: ProjectTypeSchema },
      { name: ProjectStatus.name, schema: ProjectStatusSchema },
      { name: Technology.name, schema: TechnologySchema },
      { name: Employee.name, schema: EmployeeSchema },
      { name: Customer.name, schema: CustomerSchema },
      { name: Department.name, schema: DepartmentSchema }
    ]),

  ],
  exports: [ProjectService]
})
export class ProjectModule {}
