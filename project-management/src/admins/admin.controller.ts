import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Patch,
    Post,
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
import { HttpExceptionFilter } from '../shared/filters/http-exception.filter';
import { MongoExceptionFilter } from '../shared/filters/mongo-exception.filter';
import { API_QUERY } from '../shared/const/variables.const';
import { CreateUserDto } from 'src/core/dtos/create-user.dto';
import { ParseObjectIdPipe } from 'src/shared/pipes/objectid.pipe';
import { Types } from 'mongoose';

@ApiBearerAuth()
@ApiTags('Admin')
@Roles(Role.Admin)
@UseFilters(MongoExceptionFilter)
@UseFilters(HttpExceptionFilter)
@Controller('admins')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @ApiQuery(API_QUERY.SEARCH)
    @ApiQuery(API_QUERY.SORT)
    @ApiQuery(API_QUERY.LIMIT)
    @ApiQuery(API_QUERY.PAGE)
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
        @GetCurrentAdmin('sub', ParseObjectIdPipe) id: Types.ObjectId,
        @Body() adminDto: AdminDto,
    ) {
        await this.adminService.updateAdmin(id, adminDto);
        return {
            HttpStatus: HttpStatus.OK,
            message: 'Infomation updated successfully!',
        };
    }

    @ApiBody({ type: ChangePasswordDto })
    @Roles(Role.Admin, Role.User)
    @Patch('password')
    async changePassword(
        @GetCurrentAdmin('sub', ParseObjectIdPipe) id: Types.ObjectId,
        @Body() passwordDto: ChangePasswordDto,
    ) {
        return this.adminService.changePassword(id, passwordDto);
    }

    @Roles(Role.Admin, Role.User)
    @Get('me')
    async getAdminInfo(@GetCurrentAdmin('sub', ParseObjectIdPipe) id: Types.ObjectId) {
        return this.adminService.getAdminInfo(id);
    }

    @ApiBody({ type: CreateUserDto })
    @Post('create')
    async createUser(@Body() createUserDto: CreateUserDto) {
        return this.adminService.createUser(createUserDto);
    }

    @Delete(':id')
    async deleteUser(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
        return this.adminService.deleteUser(id);
    }
}
