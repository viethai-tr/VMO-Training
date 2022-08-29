import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Mongoose } from 'mongoose';
import { Department, DepartmentSchema } from 'src/core/schemas/department.schema';
import { Project, ProjectSchema } from 'src/core/schemas/project.schema';
import { Technology, TechnologySchema } from 'src/core/schemas/technology.schema';
import { Employee, EmployeeSchema } from '../core/schemas/employee.schema';
import { EmployeeController } from './employee.controller';
import { EmployeeRepository } from './employee.repository';
import { EmployeeService } from './employee.service';

@Module({
  controllers: [EmployeeController],
  providers: [EmployeeService, EmployeeRepository],
  imports: [
    MongooseModule.forFeature([
      { name: Employee.name, schema: EmployeeSchema },
      { name: Technology.name, schema: TechnologySchema },
      { name: Project.name, schema: ProjectSchema },
      { name: Department.name, schema: DepartmentSchema }
    ]),
    JwtModule.register({})
  ],
  exports: [EmployeeService]
})
export class EmployeeModule {}
