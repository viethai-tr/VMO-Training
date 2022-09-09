import {
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import { CustomerDto } from '../core/dtos';
import { CustomerDocument } from '../core/schemas/customer.schema';
import { CustomerRepository } from './customer.repository';
import { RESPOND, RESPOND_CREATED, RESPOND_DELETED, RESPOND_GOT, RESPOND_UPDATED } from '../shared/const/respond.const';
import { ProjectService } from '../projects/projects.service';
import { Types } from 'mongoose';

@Injectable()
export class CustomerService {
    constructor(
        private customerRepository: CustomerRepository,
        private projectService: ProjectService
    ) {}

    async getAllCustomers(
        limit?: string,
        page?: string,
        sort?: string,
        search?: string,
    ) {
        return await this.customerRepository.getAll(limit, page, sort, search);
    }

    async getCustomerById(id: Types.ObjectId) {
        const customer = await this.customerRepository.getById(id);
        return RESPOND(RESPOND_GOT, customer);
    }

    async updateCustomer(id: Types.ObjectId, customerDto: CustomerDto) {
        const updatedCustomer = await this.customerRepository.update(
            id,
            <CustomerDocument>customerDto,
        );

        return RESPOND(RESPOND_UPDATED, updatedCustomer);
    }

    async createCustomer(customerDto: CustomerDto) {
        const newCustomer = await this.customerRepository.create(<CustomerDocument>customerDto);
        return RESPOND(RESPOND_CREATED, newCustomer);
    }

    async deleteCustomer(id: Types.ObjectId) {

        let checkCustomer;
        checkCustomer = await this.customerRepository.getById(id);

        if (!checkCustomer)
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);

        const projects = this.projectService.findByCondition({customer: id});
        if (!projects || (await projects).length == 0) {
            await this.customerRepository.deleteCustomer(id);
            return RESPOND(RESPOND_DELETED, {
                id: id
            });
        } else {
            throw new HttpException('Cannot be deleted', HttpStatus.FORBIDDEN);
        }
    }
}
