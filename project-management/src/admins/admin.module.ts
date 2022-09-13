import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { VerifyEmailToken } from '../shared/utils/verifyToken';
import { Admin, AdminSchema } from '../core/schemas/admin.schema';
import { AdminController } from './admin.controller';
import { AdminRepository } from './admin.repository';
import { AdminService } from './admin.service';
import { EmailModule } from '../email/email.module';

@Module({
    controllers: [AdminController],
    providers: [AdminService, AdminRepository, VerifyEmailToken],
    imports: [
        MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),

        JwtModule.register({}),

        EmailModule,
    ],
    exports: [AdminService],
})
export class AdminModule {}
