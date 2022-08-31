import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import Role from '../core/enums/role.enum';
import { Roles } from '../shared/decorators/roles.decorator';
import { DepartmentDto, PaginationDto } from '../core/dtos';
import { DepartmentDocument } from '../core/schemas/department.schema';
import { DepartmentService } from './department.service';

@ApiBearerAuth()
@ApiTags('Department')
@Roles(Role.Admin)
@Controller('department')
export class DepartmentController {
    constructor(private departmentService: DepartmentService) {}

    @Roles(Role.Admin, Role.User)
    @Get()
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
    @ApiQuery({
        name: 'sort',
        required: false,
        description: 'Type of sort',
        enum: ['asc', 'desc'],
    })
    @ApiQuery({
        name: 'sortBy',
        required: false,
        description: 'Sort by',
        enum: ['name', 'founding_date'],
    })
    async getAllDepartments(
        @Query() { limit, page }: PaginationDto,
        @Query() { sort, sortBy },
    ): Promise<DepartmentDocument[]> {
        return await this.departmentService.getAllDepartments(
            limit,
            page,
            sort,
            sortBy,
        );
    }

    @Roles(Role.Admin, Role.User)
    @Get(':id')
    async getDepartmentById(
        @Param('id') id: string,
    ): Promise<DepartmentDocument> {
        return await this.departmentService.getDepartmentById(id);
    }

    @Roles(Role.Admin, Role.User)
    @Get(':id/employees')
    async getEmployeesDepartment(@Param('id') id: string) {
        return await this.departmentService.getEmployeesDepartment(id);
    }

    @Roles(Role.Admin, Role.User)
    @Get(':id/projects')
    async getProjectsDepartment(@Param('id') id: string) {
        return await this.departmentService.getProjectsDepartment(id);
    }

    @Patch(':id')
    async updateDepartment(
        @Param('id') id: string,
        @Body() departmentDto: DepartmentDto,
    ) {
        return await this.departmentService.updateDepartment(id, departmentDto);
    }

    @Post()
    @ApiBody({ type: DepartmentDto })
    async createDepartment(@Body() departmentDto: DepartmentDto) {
        return await this.departmentService.createDepartment(departmentDto);
    }

    @Delete(':id')
    async deleteDepartment(@Param('id') id: string) {
        return await this.departmentService.deleteDepartment(id);
    }
}
