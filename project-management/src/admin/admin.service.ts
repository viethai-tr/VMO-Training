import { Body, Injectable } from '@nestjs/common';
import { AdminDocument } from 'src/core/schemas/admin.schema';
import { AdminDto } from '../core/dtos/admin.dto';
import { ChangePasswordDto } from '../core/dtos/change-password.dto';
import { AdminRepository } from './admin.repository';

@Injectable()
export class AdminService {
    constructor(private adminRepository: AdminRepository) {}

    async getAllUser(limit?: number, page?: number): Promise<AdminDocument[]> {
        return await this.adminRepository.getAllUsers(limit, page);
    }

    async changePassword(id: string, passwordDto: ChangePasswordDto) {
        return await this.adminRepository.changePassword(id, passwordDto);
    }

    async updateAdmin(id: string, adminDto: AdminDto) {
        return await this.adminRepository.updateAdmin(id, adminDto);
    }

    async getAdminInfo(id: string) {
        return this.adminRepository.getAdminInfo(id);
    }
}
