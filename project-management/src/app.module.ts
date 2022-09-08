import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './shared/auth/auth.module';
import { EmployeeModule } from './employee/employee.module';
import { CustomerModule } from './customer/customer.module';
import { TechnologyModule } from './technology/technology.module';
import { ProjectTypeModule } from './project-type/project-type.module';
import { ProjectModule } from './project/project.module';
import { ProjectStatusModule } from './project-status/project-status.module';
import { DepartmentModule } from './department/department.module';
import { AdminModule } from './admin/admin.module';
import configuration from './config/configuration';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { AtGuard } from './shared/auth/guards/at.guard';
import { RolesGuard } from './shared/auth/guards/roles.guard';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { MongoExceptionFilter } from './shared/filters/mongo-exception.filter';

@Module({
    imports: [
        AuthModule,

        ConfigModule.forRoot({
            load: [configuration],
            isGlobal: true,
        }),

        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => ({
                uri: config.get('database'),
            }),
        }),

        EmployeeModule,

        CustomerModule,

        TechnologyModule,

        ProjectTypeModule,

        ProjectModule,

        ProjectStatusModule,

        DepartmentModule,

        AdminModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        { provide: APP_GUARD, useClass: AtGuard },
        { provide: APP_GUARD, useClass: RolesGuard },
        {
            provide: APP_FILTER,
            useClass: MongoExceptionFilter,
        },
        { provide: APP_PIPE, useClass: ValidationPipe },
    ],
})
export class AppModule {}
