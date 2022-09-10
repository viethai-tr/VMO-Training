import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../core/dtos/create-user.dto';
import { AdminDto } from '../core/dtos/admin.dto';
import { ChangePasswordDto } from '../core/dtos/change-password.dto';
import { AdminRepository } from './admin.repository';
import * as argon from 'argon2';
import { Admin, AdminDocument } from '../core/schemas/admin.schema';
import { Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class AdminService {
    constructor(private adminRepository: AdminRepository, @InjectModel(Admin.name) private adminModel: SoftDeleteModel<AdminDocument>) {}

    async getAllUser(limit?: string, page?: string, search?: string, sort?: string) {
        return this.adminRepository.getAllUsers(limit, page, search, sort);
    }

    async changePassword(id: string, passwordDto: ChangePasswordDto) {
        
        return this.adminRepository.changePassword(id, passwordDto);
    }

    async updateAdmin(id: string, adminDto: AdminDto) {
        
        return this.adminRepository.updateAdmin(id, adminDto);
    }

    async getAdminInfo(id: string) {
        
        return this.adminRepository.getAdminInfo(id);
    }

    async createUser(createUserDto: CreateUserDto) {
        createUserDto.password = await argon.hash(createUserDto.password);
        return this.adminRepository.create(<AdminDocument>(createUserDto));
    }

    async deleteUser(id: string) {
        
        const checkUser = await this.adminRepository.getById(id);
        if (!checkUser) throw new NotFoundException('User not found');
        if (checkUser.role != 'User') throw new BadRequestException('Not a user');

        return this.adminModel.softDelete({ _id: id });
    }

    async restoreUser(id: string) {
        return this.adminModel.restore({ _id: id });
    }

    async findByCondition(query) {
        return this.adminRepository.findByCondition(query);
    }
}
