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
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CustomerDto, PaginationDto } from '../core/dtos';
import { CustomerService } from './customer.service';
import { Roles } from '../shared/decorators/roles.decorator';
import Role from '../core/enums/role.enum';
import { MongoExceptionFilter } from '../shared/filters/mongo-exception.filter';
import { API_QUERY } from '../shared/const/variables.const';

@ApiBearerAuth()
@ApiTags('Customer')
@Roles(Role.Admin)
@UseFilters(MongoExceptionFilter)
@Controller('customer')
export class CustomerController {
    constructor(private customerService: CustomerService) {}

    @Roles(Role.Admin, Role.User)
    @Get()
    @ApiQuery(API_QUERY.SEARCH)
    @ApiQuery(API_QUERY.LIMIT)
    @ApiQuery(API_QUERY.PAGE)
    @ApiQuery(API_QUERY.SORT)
    async getAllCustomers(
        @Query() { limit, page }: PaginationDto,
        @Query() { sort, search },
    ) {
        return this.customerService.getAllCustomers(limit, page, search, sort);
    }

    @Roles(Role.Admin, Role.User)
    @Get(':id')
    async getCustomerById(@Param('id') id: string) {
        return this.customerService.getCustomerById(id);
    }

    @Delete(':id')
    async deleteCustomer(@Param('id') id: string) {
        return this.customerService.deleteCustomer(id);
    }

    @Post()
    async createCustomer(@Body() customerDto: CustomerDto) {
        return this.customerService.createCustomer(customerDto);
    }

    @Patch(':id')
    async updateCustomer(
        @Param('id') id: string,
        @Body() customerDto: CustomerDto,
    ) {
        return this.customerService.updateCustomer(id, customerDto);
    }
}
