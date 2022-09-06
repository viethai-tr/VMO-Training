import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpException,
    HttpStatus,
    Param,
    Patch,
    Post,
    Put,
    Query,
    UseFilters,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from '../shared/decorators/roles.decorator';
import { EmployeeDto, PaginationDto } from '../core/dtos';
import { EmployeeService } from './employee.service';
import Role from '../core/enums/role.enum';
import { HttpExceptionFilter } from '../shared/filters/http-exception.filter';
import { MongoExceptionFilter } from '../shared/filters/mongo-exception.filter';
import { API_QUERY } from '../shared/const/variables.const';
import { EMPLOYEE_QUERY } from './employee.const';

@ApiBearerAuth()
@ApiTags('Employee')
@Roles(Role.Admin)
// @UseFilters(HttpExceptionFilter)
@UseFilters(MongoExceptionFilter)
@Controller('employee')
export class EmployeeController {
    constructor(private readonly employeeService: EmployeeService) {}

    @Roles(Role.Admin, Role.User)
    @ApiQuery(API_QUERY.SEARCH)
    @ApiQuery(API_QUERY.LIMIT)
    @ApiQuery(API_QUERY.PAGE)
    @ApiQuery(API_QUERY.SORT)
    @ApiQuery(EMPLOYEE_QUERY.SORT_BY)
    @Get()
    async getAllEmployees(
        @Query() { limit, page }: PaginationDto,
        @Query() { sort, sortBy, search },
    ) {
        return this.employeeService.getAllEmployees(
            limit,
            page,
            search,
            sort,
            sortBy,
        );
    }

    @Roles(Role.Admin, Role.User)
    @Get('count')
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
        return this.employeeService.countEmployees(technology, project);
    }

    @Roles(Role.Admin, Role.User)
    @Get(':id')
    async getEmployeeById(@Param('id') id: string) {
        return this.employeeService.getEmployeeById(id);
    }

    @Patch(':id')
    @ApiBody({ type: EmployeeDto })
    async updateEmployee(
        @Param('id') id: string,
        @Body() employee: EmployeeDto,
    ) {
        return this.employeeService.updateEmployee(id, employee);
    }

    @Post()
    @ApiBody({ type: EmployeeDto })
    // @HttpCode(HttpStatus.BAD_REQUEST)
    async createEmployee(@Body() employee: EmployeeDto) {
        return this.employeeService.createEmployee(employee);
    }

    @Delete(':id')
    async deleteEmployee(@Param('id') id: string) {
        return this.employeeService.deleteEmployee(id);
    }
}
