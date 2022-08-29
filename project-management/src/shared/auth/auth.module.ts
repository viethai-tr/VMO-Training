import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from '../../core/schemas/admin.schema';
import { JwtModule } from '@nestjs/jwt';
import { Employee, EmployeeSchema } from '../../core/schemas/employee.schema';
import { EmployeeModule } from 'src/employee/employee.module';
import { CustomerModule } from 'src/customer/customer.module';
import { RtStrategy } from './strategy/rt.strategy';
import { AtStrategy } from './strategy/at.strategy';
// import { RtStrategy } from './strategy/rt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Admin.name, schema: AdminSchema}]),
    MongooseModule.forFeature([{name: Employee.name, schema: EmployeeSchema}]),
    JwtModule.register({}),
    EmployeeModule,
    CustomerModule
  ],
  providers: [AuthService, AtStrategy, RtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
