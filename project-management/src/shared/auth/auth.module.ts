import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from '../../core/schemas/admin.schema';
import { JwtModule } from '@nestjs/jwt';
import { Employee, EmployeeSchema } from '../../core/schemas/employee.schema';
import { RtStrategy } from './strategy/rt.strategy';
import { AtStrategy } from './strategy/at.strategy';
import { AdminModule } from '../../admins/admin.module';
import { RedisCacheModule } from 'src/caches/cache.module';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Admin.name, schema: AdminSchema}]),
    MongooseModule.forFeature([{name: Employee.name, schema: EmployeeSchema}]),
    JwtModule.register({}),
    AdminModule,
    RedisCacheModule
  ],
  providers: [AuthService, AtStrategy, RtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
