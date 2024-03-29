import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer, CustomerDocument } from '../core/schemas/customer.schema';
import { Repository } from '../core/Repository';

@Injectable()
export class CustomerRepository extends Repository<CustomerDocument> {
    constructor(
        @InjectModel(Customer.name)
        private customerModel: Model<CustomerDocument>,
    ) {
        super(customerModel);
    }

    // async deleteCustomer(id: string) {
    //     return this.customerModel.findOneAndDelete({ _id: id });
    // }
}
