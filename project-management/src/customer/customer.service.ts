import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import { CustomerDto } from '../core/dtos';
import { Customer, CustomerDocument } from '../core/schemas/customer.schema';
import { CustomerRepository } from './customer.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from '../core/schemas/project.schema';
import { checkObjectId } from '../shared/utils/checkObjectId';
import { RESPOND, RESPOND_CREATED, RESPOND_DELETED, RESPOND_GOT, RESPOND_UPDATED } from '../shared/const/respond.const';

@Injectable()
export class CustomerService {
    constructor(
        private customerRepository: CustomerRepository,
        @InjectModel(Customer.name)
        private customerModel: Model<CustomerDocument>,
        @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    ) {}

    async getAllCustomers(
        limit?: string,
        page?: string,
        sort?: string,
        search?: string,
    ) {
        return await this.customerRepository.getAll(limit, page, sort, search);
    }

    async getCustomerById(id: string) {
        checkObjectId(id);
        const customer = await this.customerRepository.getById(id);
        return RESPOND(RESPOND_GOT, customer);
    }

    async updateCustomer(id: string, customerDto: CustomerDto) {
        checkObjectId(id);
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

    async deleteCustomer(id: string) {
        checkObjectId(id);

        let checkCustomer;
        checkCustomer = await this.customerModel.findOne({ _id: id });

        if (!checkCustomer)
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);

        const projects = this.projectModel.find({ customer: id });
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
