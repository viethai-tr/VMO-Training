import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import { CustomerDto } from '../core/dtos';
import { Customer, CustomerDocument } from '../core/schemas/customer.schema';
import { CustomerRepository } from './customer.repository';
import { ProjectService } from '../projects/projects.service';
import { Types } from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CustomerService {
    constructor(
        private customerRepository: CustomerRepository,
        @InjectModel(Customer.name)
        private customerModel: SoftDeleteModel<CustomerDocument>,
        private projectService: ProjectService,
    ) {}

    async getAllCustomers(
        limit?: string,
        page?: string,
        sort?: string,
        search?: string,
    ) {
        return this.customerRepository.getAll(limit, page, sort, search);
    }

    async getCustomerById(id: Types.ObjectId) {
        return this.customerRepository.getById(id);
    }

    async updateCustomer(id: Types.ObjectId, customerDto: CustomerDto) {
        return this.customerRepository.update(
            id,
            <CustomerDocument>customerDto,
        );
    }

    async createCustomer(customerDto: CustomerDto) {
        return this.customerRepository.create(
            <CustomerDocument>customerDto,
        );
    }

    async deleteCustomer(id: Types.ObjectId) {
        let checkCustomer;
        checkCustomer = await this.customerRepository.getById(id);
        // console.log(checkCustomer);

        if (!checkCustomer)
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);

        const projects = await this.projectService.findByCondition({
            customer: id, isDeleted: false
        });
        if (projects.length > 0)
            throw new BadRequestException('Cannot be deleted');

        return this.customerModel.softDelete({ _id: id});

        // return this.customerRepository.deleteCustomer(id);
    }

    async restoreCustomer(id: Types.ObjectId) {
        return this.customerModel.restore({_id: id});
    }
}
