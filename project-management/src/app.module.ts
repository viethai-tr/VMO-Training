import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './shared/auth/auth.module';
import { EmployeeModule } from './employees/employee.module';
import { CustomerModule } from './customers/customer.module';
import { TechnologyModule } from './technologies/technology.module';
import { ProjectTypeModule } from './project-types/project-types.module';
import { ProjectModule } from './projects/project.module';
import { ProjectStatusModule } from './project-statuses/project-status.module';
import { DepartmentModule } from './departments/department.module';
import { AdminModule } from './admins/admin.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AtGuard } from './shared/auth/guards/at.guard';
import { RolesGuard } from './shared/auth/guards/roles.guard';
import { MongoExceptionFilter } from './shared/filters/mongo-exception.filter';
import { EmailModule } from './email/email.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { SessionModule } from 'nestjs-session';
import { RedisCacheModule } from './caches/cache.module';
import { JwtModule } from '@nestjs/jwt';
import { ResponseInterceptor } from './shared/interceptors/response.interceptor';

@Module({
    imports: [
        AuthModule,

        ConfigModule.forRoot({
            envFilePath: 'src/config/env/.env',
            isGlobal: true,
        }),

        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => ({
                uri: config.get<string>('DATABASE_URL'),
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

        EmailModule,

        CloudinaryModule,

        RedisCacheModule,

        SessionModule.forRoot({
            session: {
                secret: new ConfigService().get<string>('SESSION_SECRET'),
                resave: false,
                saveUninitialized: false,
            },
        }),

        JwtModule,
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
        // { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
        { provide: APP_PIPE, useClass: ValidationPipe },
    ],
})
export class AppModule {}
