import {
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
import { AllExceptionsFilter } from '../shared/filters/all-exceptions.filter';
import { HttpAdapterHost } from '@nestjs/core';
import { Roles } from 'src/shared/decorators/roles.decorator';
import Role from 'src/core/enums/role.enum';

@ApiBearerAuth()
@ApiTags('Customer')
@Roles(Role.Admin)
@Controller('customer')
export class CustomerController {
    constructor(private customerService: CustomerService) {}

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
    async getAllCustomers(
        @Query() { limit, page }: PaginationDto,
    ): Promise<CustomerDocument[]> {
        return await this.customerService.getAllCustomers(limit, page);
    }

    @Roles(Role.Admin, Role.User)
    @Get(':id')
    async getCustomerById(@Param('id') id: string): Promise<Customer> {
        return await this.customerService.getCustomerById(id);
    }

    @Delete(':id')
    async deleteCustomer(@Param('id') id: string) {
        try {
            return await this.customerService.deleteCustomer(id);
        } catch (err) {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    error: err.message,
                },
                HttpStatus.BAD_REQUEST,
            );
        }
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
