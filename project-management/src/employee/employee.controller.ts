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
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { EmployeeDto, PaginationDto } from '../core/dtos';
import { EmployeeDocument } from '../core/schemas/employee.schema';
import { EmployeeService } from './employee.service';

@ApiBearerAuth()
@Controller('employee')
@ApiTags('Employee')
export class EmployeeController {
    constructor(private readonly employeeService: EmployeeService) {}

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
        return await this.employeeService.countEmployees(technology, project);
    }

    @Get(':id')
    async getEmployeeById(@Param('id') id: string): Promise<EmployeeDocument> {
        return await this.employeeService.getEmployeeById(id);
    }

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
        enum: ['name', 'dob', 'experience'],
    })
    async getAllEmployees(
        @Query() { limit, page }: PaginationDto,
        @Query() { sort, sortBy },
    ): Promise<EmployeeDocument[]> {
        return await this.employeeService.getAllEmployees(
            limit,
            page,
            sort,
            sortBy,
        );
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
