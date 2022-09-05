import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    HttpStatus,
    Patch,
    Query,
    UseFilters,
    UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ChangePasswordDto } from '../core/dtos/change-password.dto';
import { GetCurrentAdmin } from '../shared/decorators/get-current-admin.decorator';
import { AdminService } from './admin.service';
import { AdminDto } from '../core/dtos/admin.dto';
import { Roles } from '../shared/decorators/roles.decorator';
import Role from '../core/enums/role.enum';
import { PaginationDto } from '../core/dtos';
import { AdminDocument } from '../core/schemas/admin.schema';
import { HttpExceptionFilter } from 'src/shared/filters/http-exception.filter';
import { MongoExceptionFilter } from 'src/shared/filters/mongo-exception.filter';

@ApiBearerAuth()
@ApiTags('Admin')
@Roles(Role.Admin)
@UseFilters(MongoExceptionFilter)
@UseFilters(HttpExceptionFilter)
@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @ApiQuery({
        name: 'search',
        required: false,
        description: 'Search by name',
        type: 'string',
    })
    @ApiQuery({
        name: 'sort',
        required: false,
        description: 'Type of Sort',
        enum: ['asc', 'desc'],
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        description: 'Number of employees per page',
        type: 'integer',
    })
    @ApiQuery({
        name: 'page',
        required: false,
        description: 'Current page',
        type: 'integer',
    })
    @Get('user')
    async getAllUsers(
        @Query() { limit, page }: PaginationDto,
        @Query() { search, sort },
    ) {
        return this.adminService.getAllUser(limit, page, search, sort);
    }

    @ApiBody({ type: AdminDto })
    @Roles(Role.Admin, Role.User)
    @Patch('me')
    async updateAdmin(
        @GetCurrentAdmin('sub') id: string,
        @Body() adminDto: AdminDto,
    ) {
        await this.adminService.updateAdmin(id, adminDto);
        return {
            HttpStatus: HttpStatus.OK,
            msg: 'Infomation updated successfully!',
        };
    }

    @ApiBody({ type: ChangePasswordDto })
    @Roles(Role.Admin, Role.User)
    @Patch('password')
    async changePassword(
        @GetCurrentAdmin('sub') id: string,
        @Body() passwordDto: ChangePasswordDto,
    ) {
        return await this.adminService.changePassword(id, passwordDto);
    }

    @Roles(Role.Admin, Role.User)
    @Get('me')
    async getAdminInfo(@GetCurrentAdmin('sub') id: string) {
        return await this.adminService.getAdminInfo(id);
    }
}
