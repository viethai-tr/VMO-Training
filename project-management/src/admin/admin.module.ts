import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from '../core/schemas/admin.schema';
import { AdminController } from './admin.controller';
import { AdminRepository } from './admin.repository';
import { AdminService } from './admin.service';

@Module({
    controllers: [AdminController],
    providers: [AdminService, AdminRepository],
    imports: [
        MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    ],
})
export class AdminModule {}
