import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseFilters,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import Role from '../core/enums/role.enum';
import { Roles } from '../shared/decorators/roles.decorator';
import { DepartmentDto, PaginationDto } from '../core/dtos';
import { DepartmentService } from './department.service';
import { MongoExceptionFilter } from '../shared/filters/mongo-exception.filter';
import { API_QUERY } from '../shared/const/variables.const';
import { DEPARTMENT_QUERY } from './department.const';

@ApiBearerAuth()
@ApiTags('Department')
@Roles(Role.Admin)
@UseFilters(MongoExceptionFilter)
@Controller('department')
export class DepartmentController {
    constructor(private departmentService: DepartmentService) {}

    @Roles(Role.Admin, Role.User)
    @Get()
    @ApiQuery(API_QUERY.SEARCH)
    @ApiQuery(API_QUERY.LIMIT)
    @ApiQuery(API_QUERY.PAGE)
    @ApiQuery(API_QUERY.SORT)
    @ApiQuery(DEPARTMENT_QUERY.SORT_BY)
    async getAllDepartments(
        @Query() { limit, page }: PaginationDto,
        @Query() { search, sort, sortBy },
    ) {
        return this.departmentService.getAllDepartments(
            limit,
            page,
            search,
            sort,
            sortBy
        );
    }

    @Roles(Role.Admin, Role.User)
    @Get(':id')
    async getDepartmentById(
        @Param('id') id: string,
    ) {
        return this.departmentService.getDepartmentById(id);
    }

    @Roles(Role.Admin, Role.User)
    @Get(':id/employees')
    async getEmployeesDepartment(@Param('id') id: string) {
        return this.departmentService.getEmployeesDepartment(id);
    }

    @Roles(Role.Admin, Role.User)
    @Get(':id/projects')
    async getProjectsDepartment(@Param('id') id: string) {
        return this.departmentService.getProjectsDepartment(id);
    }

    @Patch(':id')
    async updateDepartment(
        @Param('id') id: string,
        @Body() departmentDto: DepartmentDto,
    ) {
        return this.departmentService.updateDepartment(id, departmentDto);
    }

    @Post()
    @ApiBody({ type: DepartmentDto })
    async createDepartment(@Body() departmentDto: DepartmentDto) {
        return this.departmentService.createDepartment(departmentDto);
    }

    @Delete(':id')
    async deleteDepartment(@Param('id') id: string) {
        return this.departmentService.deleteDepartment(id);
    }
}
