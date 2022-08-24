import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CustomerDto, PaginationDto } from '../core/dtos';
import { Customer, CustomerDocument } from '../core/schemas/customer.schema';
import { CustomerService } from './customer.service';

@Controller('customer')
@ApiBearerAuth()
@ApiTags('Customer')
export class CustomerController {
    constructor(private customerService: CustomerService) {}

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
