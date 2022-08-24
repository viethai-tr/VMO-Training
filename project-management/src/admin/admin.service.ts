import { Body, Injectable } from '@nestjs/common';
import { AdminDto } from '../core/dtos/admin.dto';
import { ChangePasswordDto } from '../core/dtos/change-password.dto';
import { AdminRepository } from './admin.repository';

@Injectable()
export class AdminService {
    constructor(private adminRepository: AdminRepository) {}

    async changePassword(id: string, passwordDto: ChangePasswordDto) {
        return await this.adminRepository.changePassword(id, passwordDto);
    }

    async updateAdmin(id: string, adminDto: AdminDto) {
        return await this.adminRepository.updateAdmin(id, adminDto);
    }

    async getAdminInfo(id: string) {
        return await this.adminRepository.getAdminInfo(id);
    }
}
