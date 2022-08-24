import { Body, Controller, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { DepartmentDto, PaginationDto } from '../core/dtos';
import { DepartmentDocument } from '../core/schemas/department.schema';
import { DepartmentService } from './department.service';

@ApiBearerAuth()
@ApiTags('Department')
@Controller('department')
export class DepartmentController {
    constructor(
        private departmentService: DepartmentService
    ) {}

    @Get()
    @ApiQuery({
        name: 'limit',
        required: false,
        description: 'Number of employees per page',
        type: 'integer'
    })
    @ApiQuery({
        name: 'page',
        required: false,
        description: 'Current page',
        type: 'integer'
    })
    async getAllDepartments(@Query() {limit, page}: PaginationDto): Promise<DepartmentDocument[]> {
        return await this.departmentService.getAllDepartments(limit, page);
    }

    @Get(':id')
    async getDepartmentById(@Param('id') id: string): Promise<DepartmentDocument> {
        return await this.departmentService.getDepartmentById(id);
    }

    @Get(':id/employees')
    async getEmployeesDepartment(@Param('id') id: string) {
        return await this.departmentService.getEmployeesDepartment(id);
    }

    @Get(':id/projects')
    async getProjectsDepartment(@Param('id') id: string) {
        return await this.departmentService.getProjectsDepartment(id);
    }

    @Patch(':id')
    async updateDepartment(@Param('id') id: string, @Body() departmentDto: DepartmentDto) {
        return await this.departmentService.updateDepartment(id, departmentDto);
    }

    @Post()
    @ApiBody({type: DepartmentDto})
    async createDepartment(@Body() departmentDto: DepartmentDto) {
        return await this.departmentService.createDepartment(departmentDto);
    }
}
