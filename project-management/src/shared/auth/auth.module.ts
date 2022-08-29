import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from '../../core/schemas/admin.schema';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { Employee, EmployeeSchema } from '../../core/schemas/employee.schema';
import { EmployeeModule } from 'src/employee/employee.module';
import { CustomerModule } from 'src/customer/customer.module';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Admin.name, schema: AdminSchema}]),
    MongooseModule.forFeature([{name: Employee.name, schema: EmployeeSchema}]),
    JwtModule.register({}),
    EmployeeModule,
    CustomerModule
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
