import { Body, Injectable } from '@nestjs/common';
import { AdminDocument } from 'src/core/schemas/admin.schema';
import { checkObjectId } from 'src/shared/checkObjectId';
import { AdminDto } from '../core/dtos/admin.dto';
import { ChangePasswordDto } from '../core/dtos/change-password.dto';
import { AdminRepository } from './admin.repository';

@Injectable()
export class AdminService {
    constructor(private adminRepository: AdminRepository) {}

    async getAllUser(limit?: number, page?: number, search?: string, sort?: string) {
        return this.adminRepository.getAllUsers(limit, page, search, sort);
    }

    async changePassword(id: string, passwordDto: ChangePasswordDto) {
        return this.adminRepository.changePassword(id, passwordDto);
    }

    async updateAdmin(id: string, adminDto: AdminDto) {
        return this.adminRepository.updateAdmin(id, adminDto);
    }

    async getAdminInfo(id: string) {
        checkObjectId(id);
        return this.adminRepository.getAdminInfo(id);
    }
}
