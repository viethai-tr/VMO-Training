import { Module } from '@nestjs/common';
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
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './shared/auth/guards/at.guard';

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
    providers: [AppService, { provide: APP_GUARD, useClass: AtGuard }],
})
export class AppModule {}
