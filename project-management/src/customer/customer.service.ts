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
import { Project, ProjectDocument } from 'src/core/schemas/project.schema';
import { checkObjectId } from 'src/shared/checkObjectId';

@Injectable()
export class CustomerService {
    constructor(
        private customerRepository: CustomerRepository,
        @InjectModel(Customer.name)
        private customerModel: Model<CustomerDocument>,
        @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    ) {}

    async getAllCustomers(
        limit?: number,
        page?: number,
        sort?: string,
        search?: string,
    ) {
        return await this.customerRepository.getAll(limit, page, sort, search);
    }

    async getCustomerById(id: string) {
        if (checkObjectId(id)) return this.customerRepository.getById(id);
    }

    async updateCustomer(id: string, customerDto: CustomerDto) {
        if (checkObjectId(id)) {
            return this.customerRepository.update(
                id,
                <CustomerDocument>customerDto,
            );
        }
    }

    async createCustomer(customerDto: CustomerDto) {
        return this.customerRepository.create(<CustomerDocument>customerDto);
    }

    async deleteCustomer(id: string) {
        if (!id.match(/^[0-9a-fA-F]{24}$/))
            throw new BadRequestException('Invalid ID');

        let checkCustomer;
        checkCustomer = await this.customerModel.findOne({ _id: id });

        if (!checkCustomer)
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);

        const projects = this.projectModel.find({ customer: id });
        if (!projects || (await projects).length == 0) {
            await this.customerRepository.deleteCustomer(id);
            return {
                HttpStatus: HttpStatus.OK,
                msg: 'Delete successfully!',
            };
        } else {
            throw new HttpException('Cannot be deleted', HttpStatus.FORBIDDEN);
        }
    }
}
