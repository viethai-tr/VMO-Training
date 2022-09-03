import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Patch,
    Post,
    Query,
    UseFilters,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../shared/filters/http-exception.filter';
import { CustomerDto, PaginationDto } from '../core/dtos';
import { Customer, CustomerDocument } from '../core/schemas/customer.schema';
import { CustomerService } from './customer.service';
import { Roles } from 'src/shared/decorators/roles.decorator';
import Role from 'src/core/enums/role.enum';

@ApiBearerAuth()
@ApiTags('Customer')
@Roles(Role.Admin)
@UseFilters(HttpExceptionFilter)
@Controller('customer')
export class CustomerController {
    constructor(private customerService: CustomerService) {}

    @Roles(Role.Admin, Role.User)
    @Get()
    @ApiQuery({
        name: 'search',
        required: false,
        description: 'Search',
        type: 'string',
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        description: 'Number of records per page',
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
    async getAllCustomers(
        @Query() { limit, page }: PaginationDto,
        @Query() { sort, search },
    ) {
        return await this.customerService.getAllCustomers(
            limit,
            page,
            search,
            sort,
        );
    }

    @Roles(Role.Admin, Role.User)
    @Get(':id')
    async getCustomerById(@Param('id') id: string): Promise<Customer> {
        return await this.customerService.getCustomerById(id);
    }

    @Delete(':id')
    async deleteCustomer(@Param('id') id: string) {
            return await this.customerService.deleteCustomer(id);
    }

    @Post()
    async createCustomer(@Body() customerDto: CustomerDto) {
        return await this.customerService.createCustomer(customerDto);  
    }

    @Patch(':id')
    async updateCustomer(
        @Param('id') id: string,
        @Body() customerDto: CustomerDto,
    ) {
        return await this.customerService.updateCustomer(id, customerDto);
    }
}
