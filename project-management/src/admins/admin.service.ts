import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../core/dtos/create-user.dto';
import { checkObjectId } from '../shared/utils/checkObjectId';
import { AdminDto } from '../core/dtos/admin.dto';
import { ChangePasswordDto } from '../core/dtos/change-password.dto';
import { AdminRepository } from './admin.repository';
import * as argon from 'argon2';
import { AdminDocument } from '../core/schemas/admin.schema';
import { RESPOND, RESPOND_CREATED, RESPOND_DELETED } from '../shared/const/respond.const';
import { Types } from 'mongoose';

@Injectable()
export class AdminService {
    constructor(private adminRepository: AdminRepository) {}

    async getAllUser(limit?: string, page?: string, search?: string, sort?: string) {
        return this.adminRepository.getAllUsers(limit, page, search, sort);
    }

    async changePassword(id: Types.ObjectId, passwordDto: ChangePasswordDto) {
        
        return this.adminRepository.changePassword(id, passwordDto);
    }

    async updateAdmin(id: Types.ObjectId, adminDto: AdminDto) {
        
        return this.adminRepository.updateAdmin(id, adminDto);
    }

    async getAdminInfo(id: Types.ObjectId) {
        
        return this.adminRepository.getAdminInfo(id);
    }

    async createUser(createUserDto: CreateUserDto) {
        createUserDto.password = await argon.hash(createUserDto.password);
        await this.adminRepository.create(<AdminDocument>(createUserDto));

        return RESPOND(RESPOND_CREATED, {
            username: createUserDto.username,
            name: createUserDto.name
        })
    }

    async deleteUser(id: Types.ObjectId) {
        
        const checkUser = await this.adminRepository.getById(id);
        if (!checkUser) throw new NotFoundException('User not found');
        if (checkUser.role != 'User') throw new ForbiddenException('Not a user');

        await this.adminRepository.delete(id);

        return RESPOND(RESPOND_DELETED, {
            id: id,
        })
    }

    async findByCondition(query) {
        return this.adminRepository.findByCondition(query);
    }
}
