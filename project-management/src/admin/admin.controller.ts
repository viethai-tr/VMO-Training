import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { ChangePasswordDto } from 'src/core/dtos/change-password.dto';
import { GetCurrentAdmin } from 'src/shared/decorators/get-current-admin.decorator';
import { AdminService } from './admin.service';
import { AdminDto } from '../core/dtos/admin.dto';

@Controller('admin')
@ApiBearerAuth()
@ApiTags('Admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Patch('me')
    @ApiBody({type: AdminDto})
    async updateAdmin(@GetCurrentAdmin('id') id: string, @Body() adminDto: AdminDto) {
        return await this.adminService.updateAdmin(id, adminDto);
    }

    @Patch('password')
    @ApiBody({type: ChangePasswordDto})
    async changePassword(@GetCurrentAdmin('id') id: string, @Body() passwordDto: ChangePasswordDto) {
        return await this.adminService.changePassword(id, passwordDto);
    }
    
    @Get('me')
    async getAdminInfo(@GetCurrentAdmin('sub') id: string) {
        return await this.adminService.getAdminInfo(id);
    }
}
