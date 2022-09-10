import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
    Department,
    DepartmentSchema,
} from '../core/schemas/department.schema';
import { Employee, EmployeeSchema } from '../core/schemas/employee.schema';
import { DepartmentController } from './department.controller';
import { DepartmentRepository } from './department.repository';
import { DepartmentService } from './department.service';

@Module({
    controllers: [DepartmentController],
    providers: [DepartmentService, DepartmentRepository],
    imports: [
        MongooseModule.forFeature([
            { name: Department.name, schema: DepartmentSchema },
            { name: Employee.name, schema: EmployeeSchema }
        ]),
    ],
    exports: [DepartmentService],
})
export class DepartmentModule {}
