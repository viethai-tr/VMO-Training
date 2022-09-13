import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    Query,
    UploadedFile,
    UseFilters,
    UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ChangePasswordDto } from './dtos/update.password.dto';
import { GetCurrentAdmin } from '../shared/decorators/get-current-admin.decorator';
import { AdminService } from './admin.service';
import { AdminDto } from './dtos/update.admin.dto';
import { Roles } from '../shared/decorators/roles.decorator';
import Role from '../core/enums/role.enum';
import { PaginationDto } from '../core/dtos';
import { HttpExceptionFilter } from '../shared/filters/http-exception.filter';
import { MongoExceptionFilter } from '../shared/filters/mongo-exception.filter';
import { API_QUERY } from '../shared/const/variables.const';
import { CreateUserDto } from './dtos/create.admin.dto';
import { ParseObjectIdPipe } from '../shared/pipes/objectid.pipe';
import { Public } from '../shared/decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiBearerAuth()
@ApiTags('Admin')
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
        @GetCurrentAdmin('sub', ParseObjectIdPipe) id: string,
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
        @GetCurrentAdmin('sub', ParseObjectIdPipe) id: string,
        @Body() passwordDto: ChangePasswordDto,
    ) {
        return this.adminService.changePassword(id, passwordDto);
    }

    @Roles(Role.Admin, Role.User)
    @Get('me')
    async getAdminInfo(@GetCurrentAdmin('sub', ParseObjectIdPipe) id: string) {
        return this.adminService.getAdminInfo(id);
    }

    @Post('create')
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: CreateUserDto })
    @Roles(Role.Admin)
    @UseInterceptors(FileInterceptor('avatar'))
    @HttpCode(201)
    async createUser(@Body() createUserDto: CreateUserDto, @UploadedFile() avatar) {
        return this.adminService.createUser(createUserDto, avatar);
    }

    @Delete(':id')
    @Roles(Role.Admin)
    @HttpCode(204)
    async deleteUser(@Param('id', ParseObjectIdPipe) id: string) {
        return this.adminService.deleteUser(id);
    }

    @Post('restore/:id')
    @Roles(Role.Admin)
    async restoreUser(@Param('id', ParseObjectIdPipe) id: string) {
        return this.adminService.restoreUser(id);
    }

    @Public()
    @Get('active')
    async activeUser(@Query('token') token: string) {
        return this.adminService.activeUser(token);
    }

    @Public()
    @ApiBody({
        schema: {
            type: 'object',
            required: ['email'],
            properties: {
                email: { type: 'string' },
            },
        },
    })
    @Post('resend')
    async resendEmail(@Body('email') email: string) {
        return this.adminService.resendEmail(email);
    }
}
