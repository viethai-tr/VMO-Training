import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    Param,
    Patch,
    Post,
    Put,
    Query,
    UseFilters,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from '../shared/decorators/roles.decorator';
import { EmployeeDto, PaginationDto } from '../core/dtos';
import { EmployeeDocument } from '../core/schemas/employee.schema';
import { EmployeeService } from './employee.service';
import Role from '../core/enums/role.enum';
import { HttpExceptionFilter } from 'src/shared/filters/http-exception.filter';

@ApiBearerAuth()
@ApiTags('Employee')
@Roles(Role.Admin)
@UseFilters(HttpExceptionFilter)
@Controller('employee')
export class EmployeeController {
    constructor(private readonly employeeService: EmployeeService) { }

    @Roles(Role.Admin, Role.User)
    @Get()
    @ApiQuery({
        name: 'search',
        required: false,
        description: 'Search by name',
        type: 'string',
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
        enum: ['name', 'dob', 'experience'],
    })
    async getAllEmployees(
        @Query() { limit, page }: PaginationDto,
        @Query() { sort, sortBy, search },
    ) {
        return await this.employeeService.getAllEmployees(
            limit,
            page,
            search,
            sort,
            sortBy,
        );
    }

    @Roles(Role.Admin, Role.User)
    @Get('/count')
    @ApiQuery({
        name: 'project',
        required: false,
        description: 'Project ID',
        type: 'string',
    })
    @ApiQuery({
        name: 'technology',
        required: false,
        description: 'Technology ID',
        type: 'string',
    })
    async countEmployees(@Query() { technology, project }) {
        return await this.employeeService.countEmployees(
            technology,
            project,
        );
    }

    @Roles(Role.Admin, Role.User)
    @Get(':id')
    async getEmployeeById(@Param('id') id: string) {
        return await this.employeeService.getEmployeeById(id);
    }

    @Patch(':id')
    async updateEmployee(
        @Param('id') id: string,
        @Body() employee: EmployeeDto,
    ) {
        return await this.employeeService.updateEmployee(id, employee);
    }

    @Post()
    async createEmployee(@Body() employee: EmployeeDto) {
        return await this.employeeService.createEmployee(employee);
    }

    @Delete(':id')
    async deleteEmployee(@Param('id') id: string) {
        return await this.employeeService.deleteEmployee(id);
    }
}
