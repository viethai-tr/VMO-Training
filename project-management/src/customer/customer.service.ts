import {
    HttpException,
    HttpStatus,
    Injectable,
    UseFilters,
} from '@nestjs/common';
import { HttpExceptionFilter } from '../shared/filters/http-exception.filter';
import { CustomerDto } from '../core/dtos';
import { CustomerDocument } from '../core/schemas/customer.schema';
import { CustomerRepository } from './customer.repository';

@Injectable()
export class CustomerService {
    constructor(private customerRepository: CustomerRepository) {}

    async getAllCustomers(
        limit?: number,
        page?: number,
    ): Promise<CustomerDocument[]> {
        return await this.customerRepository.getAll(limit, page);
    }

    async getCustomerById(id: string) {
        return this.customerRepository.getById(id);
    }

    async updateCustomer(id: string, customerDto: CustomerDto) {
        return this.customerRepository.update(
            id,
            <CustomerDocument>customerDto,
        );
    }

    async createCustomer(customerDto: CustomerDto) {
        return this.customerRepository.create(<CustomerDocument>customerDto);
    }

    async deleteCustomer(id: string) {
        try {
            return this.customerRepository.deleteCustomer(id);
        } catch (e) {
            throw new HttpException('Lmao', HttpStatus.NOT_ACCEPTABLE);
        }
    }
}
