import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './shared/auth/auth.module';
import { EmployeeModule } from './employees/employee.module';
import { CustomerModule } from './customers/customer.module';
import { TechnologyModule } from './technologies/technologies.module';
import { ProjectTypeModule } from './project-types/project-types.module';
import { ProjectModule } from './projects/project.module';
import { ProjectStatusModule } from './project-statuses/project-status.module';
import { DepartmentModule } from './departments/department.module';
import { AdminModule } from './admins/admin.module';
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
